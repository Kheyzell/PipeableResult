import { fail, succeed } from '../src/factories';
import { chain, chainErr, map, mapErr } from '../src/operators';
import { ResultImpl } from '../src/result.implementation';
import { Result, ResultError } from '../src/result.interface';
import { ErrorCases, ErrorTag, ResultOperator } from '../src/types';

describe("ResultImpl", () => {

    describe("static succeed method", () => {
        it("should create a success result without a value", () => {
            // Act
            const result = ResultImpl.succeed();

            // Arrange
            expect(result.isSuccess()).toBe(true);
            expect(result.isFailure()).toBe(false);
            expect(result.value()).toBeNull();
        });

        it("should create a success result with a value", () => {
            // Act
            const result = ResultImpl.succeed(42);

            // Arrange
            expect(result.isSuccess()).toBe(true);
            expect(result.isFailure()).toBe(false);
            expect(result.value()).toBe(42);
        });
    });

    describe("static fail method", () => {
        it("should create a failure result with an error", () => {
            // Arrange
            const error: ResultError = { [ErrorTag]: "TestError" };

            // Act
            const result = ResultImpl.fail<ResultError>(error);

            // Assert
            expect(result.isSuccess()).toBe(false);
            expect(result.isFailure()).toBe(true);
            expect(result.error()).toBe(error);
        });
    });

    describe("isSuccess and isFailure methods", () => {
        it("isSuccess should return true for a success result", () => {
            // Act
            const result = ResultImpl.succeed("success");

            // Assert
            expect(result.isSuccess()).toBe(true);
        });

        it("isFailure should return true for a failure result", () => {
            // Arrange
            const error: ResultError = { [ErrorTag]: "TestError" };

            // Act
            const result = ResultImpl.fail<ResultError>(error);

            // Assert
            expect(result.isFailure()).toBe(true);
        });
    });

    describe("unwrap method", () => {
        it("should return the value for a success result", () => {
            // Act
            const result = ResultImpl.succeed(100);
            const value = result.unwrap(() => 0 );

            // Assert
            expect(value).toBe(100);
        });

        it("should call the err handler for a failure result", () => {
            // Arrange
            const error: ResultError = { [ErrorTag]: "TestError" };

            const result = ResultImpl.fail<ResultError, number>(error);
            const errHandler = jest.fn(() => -1);
            
            // Act
            const value = result.unwrap(errHandler);

            // Assert
            expect(value).toBe(-1);
            expect(errHandler).toHaveBeenCalledWith(error);
        });
        
        it("should handle multiple error handlers for a failure result and call the first handler", () => {
            // Arrange
            type Error1 = { [ErrorTag]: "Error1" };
            type Error2 = { [ErrorTag]: "Error2" };
            const error: Error1 | Error2 = { [ErrorTag]: "Error1" };

            const result = ResultImpl.fail<Error1 | Error2, number>(error);
            const errHandler1 = jest.fn(() => -1);
            const errHandler2 = jest.fn(() => -2);
            const casesHandler: ErrorCases<Error1 | Error2, number> = {
                Error1: errHandler1,
                Error2: errHandler2
            };

            // Act
            const value = result.unwrap(casesHandler);

            // Assert
            expect(value).toBe(-1);
            expect(errHandler1).toHaveBeenCalledWith(error);
            expect(errHandler2).not.toHaveBeenCalledWith(error);
        });
        
        it("should handle multiple error handlers for a failure result and call the second handler", () => {
            // Arrange
            type Error1 = { [ErrorTag]: "Error1" };
            type Error2 = { [ErrorTag]: "Error2" };
            const error: Error1 | Error2 = { [ErrorTag]: "Error2" };

            const result = ResultImpl.fail<Error1 | Error2, number>(error);
            const errHandler1 = jest.fn(() => -1);
            const errHandler2 = jest.fn(() => -2);
            const casesHandler: ErrorCases<Error1 | Error2, number> = {
                Error1: errHandler1,
                Error2: errHandler2
            };

            // Act
            const value = result.unwrap(casesHandler);

            // Assert
            expect(value).toBe(-2);
            expect(errHandler2).toHaveBeenCalledWith(error);
            expect(errHandler1).not.toHaveBeenCalledWith(error);
        });
    });

    describe("inspect method", () => {
        it("should return a correct string for a success result", () => {
            // Act
            const inspectString = ResultImpl.succeed("hello").inspect();

            // Assert
            expect(inspectString).toBe('Success("hello")');
        });

        it("should return a correct string for a failure result", () => {
            // Arrange
            const error: ResultError = { [ErrorTag]: "TestError", message: "Failed process", code: 40, data: { isTest: true} };

            // Act
            const inspectString = ResultImpl.fail<ResultError>(error).inspect();

            // Assert
            expect(inspectString).toBe(`Failure(TestError): { message: "Failed process", code: 40, data: {"isTest":true} }`);
        });
    });

    describe("value method", () => {
        it("should return the value if the result is a success", () => {
            // Act
            const result = ResultImpl.succeed("test");

            // Assert
            expect(result.value()).toBe("test");
        });

        it("should throw an error if the result is a failure", () => {
            // Arrange
            const error: ResultError = { [ErrorTag]: "TestError" };

            // Act
            const result = ResultImpl.fail<ResultError>(error);

            // Assert
            expect(() => result.value()).toThrow("Cannot get value from Failure");
        });
    });

    describe("error method", () => {
        it("should return the error if the result is a failure", () => {
            // Arrange
            const error: ResultError = { [ErrorTag]: "TestError" };

            // Act
            const result = ResultImpl.fail<ResultError>(error);

            // Assert
            expect(result.error()).toBe(error);
        });

        it("should return null if the result is a success", () => {
            // Act
            const result = ResultImpl.succeed("value");

            // Assert
            expect(result.error()).toBeNull();
        });
    });

    describe("match method", () => {
       it("should return a value when matching on Success", () => {
            // Arrange
            type ErrorType1 = { [ErrorTag]: "ErrorType1" }
            type ErrorType2 = { [ErrorTag]: "ErrorType2" }
    
            const result: Result<number, ErrorType1 | ErrorType2> = succeed<number>(10);
            const cases = {
                Success: (value: number) => value * 2,
                ErrorType1: (_err: any) => 0,
                ErrorType2: (_err: any) => -1,
            };
    
            // Act
            const matched = result.match(cases);
    
            // Assert
            expect(matched).toBe(20);
        });
    
        it("should return the value of the matched error handler (ErrorType1)", () => {
            // Arrange
            type ErrorType1 = { [ErrorTag]: "ErrorType1" }
            type ErrorType2 = { [ErrorTag]: "ErrorType2" }
    
            const error: ErrorType1 = { [ErrorTag]: "ErrorType1" };
            const result = fail<ErrorType1 | ErrorType2, number>(error);
            const cases = {
                Success: (_: number) => 999,
                ErrorType1: (_err: ErrorType1) => 7,
                ErrorType2: (_err: ErrorType2) => -1,
            };
    
            // Act
            const matched = result.match(cases);
    
            // Assert
            expect(matched).toBe(7);
        });
    
        it("should return the value of the matched error handler (ErrorType2)", () => {
            // Arrange
            type ErrorType1 = { [ErrorTag]: "ErrorType1" }
            type ErrorType2 = { [ErrorTag]: "ErrorType2" }
    
            const error: ErrorType2 = { [ErrorTag]: "ErrorType2" };
            const result = fail<ErrorType1 | ErrorType2, number>(error);
            const cases = {
                Success: (_: number) => 999,
                ErrorType1: (_err: ErrorType1) => 7,
                ErrorType2: (_err: ErrorType2) => -1,
            };
    
            // Act
            const matched = result.match(cases);
    
            // Assert
            expect(matched).toBe(-1);
        });
    
        it("should throw if no matching case is provided", () => {
            // Arrange
            const error: ResultError = { [ErrorTag]: "UnhandledType", message: "Unhandled" };
            const result = fail(error);
            const cases = {
                Success: (_: number) => 1,
                // Missing handler for "UnhandledType"
            } as any;
    
            // Act & Assert
            expect(() => result.match(cases)).toThrow();
        });
    });

    describe("matchErrors method", () => {    
        it("should return the value of the matched error handler (ErrorType1)", () => {
            // Arrange
            type ErrorType1 = { [ErrorTag]: "ErrorType1" }
            type ErrorType2 = { [ErrorTag]: "ErrorType2" }
    
            const error: ErrorType1 = { [ErrorTag]: "ErrorType1" };
            const result = fail<ErrorType1 | ErrorType2, number>(error);
            const cases = {
                ErrorType1: (_err: ErrorType1) => 7,
                ErrorType2: (_err: ErrorType2) => -1,
            };
    
            // Act
            const matched = result.matchErrors(cases);
    
            // Assert
            expect(matched).toBe(7);
        });
    
        it("should return the value of the matched error handler (ErrorType2)", () => {
            // Arrange
            type ErrorType1 = { [ErrorTag]: "ErrorType1" }
            type ErrorType2 = { [ErrorTag]: "ErrorType2" }
    
            const error: ErrorType2 = { [ErrorTag]: "ErrorType2" };
            const result = fail<ErrorType1 | ErrorType2, number>(error);
            const cases = {
                ErrorType1: (_err: ErrorType1) => 7,
                ErrorType2: (_err: ErrorType2) => -1,
            };
    
            // Act
            const matched = result.matchErrors(cases);
    
            // Assert
            expect(matched).toBe(-1);
        });
    
        it("should throw if no matching case is provided", () => {
            // Arrange
            const error: ResultError = { [ErrorTag]: "UnhandledType", message: "Unhandled" };
            const result = fail(error);
            const cases = {
                // Missing handler for "UnhandledType"
            } as any;
    
            // Act & Assert
            expect(() => result.matchErrors(cases)).toThrow();
        }); 
    });

    describe("pipe method", () => {
        const toUpperCase: ResultOperator<string, ResultError, Result<string, ResultError>> = (result) => {
            return result.isSuccess() ? ResultImpl.succeed(result.value().toUpperCase()) : result;
        };

        const addExclamation: ResultOperator<string, ResultError, Result<string, ResultError>> = (result) => {
            return result.isSuccess() ? ResultImpl.succeed(result.value() + "!") : result;
        };

        const addInterrogation: ResultOperator<string, ResultError, Result<string, ResultError>> = (result) => {
            return result.isSuccess() ? ResultImpl.succeed(result.value() + "?") : result;
        };

        it("should apply functions in sequence", async () => {
            // Act
            const result = ResultImpl.succeed("hello").pipe(toUpperCase, addInterrogation, addExclamation);

            // Assert
            expect(result.isSuccess()).toBe(true);
            expect(result.value()).toBe("HELLO?!");
        });
    });

    describe("pipe with promises", () => {
        it("should apply functions in sequence asynchronously", async () => {
            // Arrange
            // Act
            const result = await ResultImpl.succeed("hello").pipe(
                map(async x => {
                    await delay({ ms: 1 });
                    return x.toUpperCase();
                }),
                map(x => x + "?!"),
                chain(x => succeed(`@${x}`)),
                chain(async x => {
                    await delay({ ms: 1 });
                    return succeed(`${x}-${x}`);
                }),
            );

            // Assert
            expect(result.isSuccess()).toBe(true);
            expect(result.value()).toBe("@HELLO?!-@HELLO?!");
        });

        it("should handle errors asynchronously", async () => {
            // Arrange
            const error: ResultError = { [ErrorTag]: "TestError", message: "Failed process" };

            // Act
            const result = await fail<ResultError>(error).pipe(
                mapErr(async x => {
                    await delay({ ms: 1 });
                    return { [ErrorTag]: "MapError", message: `${x.message}: Mapping error` };
                }),
                chainErr(async x => {
                    await delay({ ms: 1 });
                    return fail({ [ErrorTag]: "ChainError", message: `${x.message}: Chaining error async` });
                }),
            );

            // Assert
            expect(result.isFailure()).toBe(true);
            expect(result.error()?.[ErrorTag]).toBe("ChainError");
            expect(result.error()?.message).toBe("Failed process: Mapping error: Chaining error async");
        })
    });

});

const delay = ({ ms }: { ms: number }) => new Promise(res => setTimeout(res, ms));
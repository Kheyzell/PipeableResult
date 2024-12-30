import { fail, succeed } from '../src/factories';
import { chain, chainErr, map, mapErr } from '../src/operators';
import { ResultError, ResultImpl } from '../src/result.implementation';
import { ResultOperatorFunction } from '../src/types';

describe("ResultImpl", () => {

    describe("static succeed method", () => {
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
            const error = new ResultError("TestError", "Something went wrong");

            // Act
            const result = ResultImpl.fail<number, ResultError>(error);

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
            const error = new ResultError("TestError", "Failure occurred");

            // Act
            const result = ResultImpl.fail<string, ResultError>(error);

            // Assert
            expect(result.isFailure()).toBe(true);
        });
    });

    describe("unwrap method", () => {
        it("should return the value for a success result", () => {
            // Act
            const result = ResultImpl.succeed(100);

            // Assert
            expect(result.unwrap({ err: () => 0 })).toBe(100);
        });

        it("should call the err handler for a failure result", () => {
            // Arrange
            const error = new ResultError("TestError", "An error occurred");

            // Act
            const result = ResultImpl.fail<number, ResultError>(error);
            const errHandler = jest.fn(() => -1);

            // Assert
            expect(result.unwrap({ err: errHandler })).toBe(-1);
            expect(errHandler).toHaveBeenCalledWith(error);
        });
    });

    describe("inspect method", () => {
        it("should return a correct string for a success result", () => {
            // Act
            const result = ResultImpl.succeed("hello");

            // Assert
            expect(result.inspect()).toBe("Success(hello)");
        });

        it("should return a correct string for a failure result", () => {
            // Arrange
            const error = new ResultError("TestError", "Failed process");

            // Act
            const result = ResultImpl.fail<string, ResultError>(error);

            // Assert
            expect(result.inspect()).toBe("Failure(TestError: Failed process)");
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
            const error = new ResultError("TestError", "Cannot get value from Failure");

            // Act
            const result = ResultImpl.fail<string, ResultError>(error);

            // Assert
            expect(() => result.value()).toThrow("Cannot get value from Failure");
        });
    });

    describe("error method", () => {
        it("should return the error if the result is a failure", () => {
            // Arrange
            const error = new ResultError("TestError", "An error occurred");

            // Act
            const result = ResultImpl.fail<string, ResultError>(error);

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

    describe("pipe method", () => {
        const toUpperCase: ResultOperatorFunction<string, ResultError, string, ResultError> = (result) => {
            return result.isSuccess() ? ResultImpl.succeed(result.value().toUpperCase()) : result;
        };

        const addExclamation: ResultOperatorFunction<string, ResultError, string, ResultError> = (result) => {
            return result.isSuccess() ? ResultImpl.succeed(result.value() + "!") : result;
        };

        const addInterrogation: ResultOperatorFunction<string, ResultError, string, ResultError> = (result) => {
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
            const error = new ResultError("TestError", "Failed process");

            // Act
            const result = await ResultImpl.fail<string, ResultError>(error).pipe(
                mapErr(async x => {
                    await delay({ ms: 1 });
                    return new ResultError("MapError", `${x.message}: Mapping error`);
                }),
                chainErr(async x => {
                    await delay({ ms: 1 });
                    return fail(new ResultError("ChainError", `${x.message}: Chaining error async`));
                }),
            );

            // Assert
            expect(result.isFailure()).toBe(true);
            expect(result.error()?.name).toBe("ChainError");
            expect(result.error()?.message).toBe("Failed process: Mapping error: Chaining error async");
        })
    });

});

const delay = ({ ms }: { ms: number }) => new Promise(res => setTimeout(res, ms));
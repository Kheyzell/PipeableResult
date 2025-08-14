import { fail, succeed } from "../../src/factories";
import { match } from "../../src/operators";
import { matchErrors } from "../../src/operators/operators";
import { ResultError } from "../../src/result.interface";
import { ErrorTag } from "../../src/types";


describe("matchErrors operator", () => {
    it("should return a Success containing the result of the matched error handler (ErrorType1)", () => {
        // Arrange
        type ErrorType1 = { [ErrorTag]: "ErrorType1" }
        type ErrorType2 = { [ErrorTag]: "ErrorType2" }

        const error: ErrorType1 = { [ErrorTag]: "ErrorType1" };
        const result = fail<ErrorType1 | ErrorType2, number>(error);
        const cases = {
            ErrorType1: (_err: ErrorType1) => succeed(7),
            ErrorType2: (_err: ErrorType2) => succeed("-1"),
        };

        // Act
        const matched = result.pipe(matchErrors(cases));

        // Assert
        expect(matched.isSuccess()).toBe(true);
        expect(matched.value()).toBe(7);
    });

    it("should return a Success containing the result of the matched error handler (ErrorType2)", () => {
        // Arrange
        type ErrorType1 = { [ErrorTag]: "ErrorType1" }
        type ErrorType2 = { [ErrorTag]: "ErrorType2" }

        const error: ErrorType2 = { [ErrorTag]: "ErrorType2" };
        const result = fail<ErrorType1 | ErrorType2, number>(error);
        const cases = {
            ErrorType1: (_err: ErrorType1) => succeed(7),
            ErrorType2: (_err: ErrorType2) => succeed("-1"),
        };

        // Act
        const matched = result.pipe(matchErrors(cases));

        // Assert
        expect(matched.isSuccess()).toBe(true);
        expect(matched.value()).toBe("-1");
    });

    it("should handle an asynchronous flow and return the asynchronous case", async () => {
        // Arrange
        type ErrorType1 = { [ErrorTag]: "ErrorType1" }
        type ErrorType2 = { [ErrorTag]: "ErrorType2" }

        const error: ErrorType2 = { [ErrorTag]: "ErrorType2" };
        const result = fail<ErrorType1 | ErrorType2, number>(error);
        const cases = {
            ErrorType1: (_err: ErrorType1) => succeed(7),
            ErrorType2: (_err: ErrorType2) => Promise.resolve(succeed("-1")),
        };

        // Act
        const matchedPromise = result.pipe(matchErrors(cases));

        // Assert
        expect(matchedPromise).toBeInstanceOf(Promise);
        
        const matched = await matchedPromise;
        expect(matched.isSuccess()).toBe(true);
        expect(matched.value()).toBe("-1");
    });
    
    it("should handle an asynchronous flow and return the synchronous case as a Promise", async () => {
        // Arrange
        type ErrorType1 = { [ErrorTag]: "ErrorType1" }
        type ErrorType2 = { [ErrorTag]: "ErrorType2" }

        const error: ErrorType1 = { [ErrorTag]: "ErrorType1" };
        const result = fail<ErrorType1 | ErrorType2, number>(error);
        const cases = {
            ErrorType1: (_err: ErrorType1) => succeed(7),
            ErrorType2: (_err: ErrorType2) => Promise.resolve(succeed("-1")),
        };

        // Act
        const matchedPromise = result.pipe(matchErrors(cases));

        // Assert
        expect(matchedPromise).not.toBeInstanceOf(Promise);
        
        const matched = await matchedPromise;
        expect(matched.isSuccess()).toBe(true);
        expect(matched.value()).toBe(7);
    });

    it("should throw if no matching case is provided", () => {
        // Arrange
        const error: ResultError = { [ErrorTag]: "UnhandledType", message: "Unhandled" };
        const result = fail(error);
        const cases = {
            // Missing handler for "UnhandledType"
        } as any;

        // Act & Assert
        expect(() => match(cases)(result)).toThrow();
    });
});

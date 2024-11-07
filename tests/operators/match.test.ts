import { succeed, fail } from "../../src/factories";
import { match } from "../../src/operators";
import { ResultError } from "../../src/result.implementation";

describe("match function", () => {
    it("should call the 'ok' handler on a successful Result and return the original Result", () => {
        // Arrange
        const okHandler = jest.fn();
        const errHandler = jest.fn();
        const result = succeed("Task completed");

        // Act
        const matchedResult = match({ ok: okHandler, err: errHandler })(result);

        // Assert
        expect(okHandler).toHaveBeenCalledWith("Task completed");
        expect(errHandler).not.toHaveBeenCalled();
        expect(matchedResult).toBe(result);
        expect(matchedResult.isSuccess()).toBe(true);
        expect(matchedResult.value()).toBe("Task completed");
    });

    it("should call the 'err' handler on a failure Result and return the original Result", () => {
        // Arrange
        const okHandler = jest.fn();
        const errHandler = jest.fn();
        const error = new ResultError("TestError", "An error occurred");
        const result = fail(error);

        // Act
        const matchedResult = match({ ok: okHandler, err: errHandler })(result);

        // Assert
        expect(errHandler).toHaveBeenCalledWith(error);
        expect(okHandler).not.toHaveBeenCalled();
        expect(matchedResult).toBe(result);
        expect(matchedResult.isFailure()).toBe(true);
        expect(matchedResult.error()).toBe(error);
    });
});
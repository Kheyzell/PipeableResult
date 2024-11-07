import { succeed, fail } from "../../src/factories";
import { catchErr } from "../../src/operators";
import { ResultError } from "../../src/result.implementation";

describe("catchErr function", () => {

    it("should perform side-effect on a failure Result and return the original Result", () => {
        // Arrange
        const sideEffect = jest.fn();
        const error = new ResultError("TestError", "Task failed");
        const result = fail(error);

        // Act
        const caughtResult = catchErr(sideEffect)(result);

        // Assert
        expect(sideEffect).toHaveBeenCalledWith(error);
        expect(caughtResult).toBe(result);
        expect(caughtResult.isFailure()).toBe(true);
        expect(caughtResult.error()).toBe(error);
    });

    it("should not perform side-effect on a success Result and return the original Result", () => {
        // Arrange
        const sideEffect = jest.fn();
        const result = succeed("Task completed");

        // Act
        const caughtResult = catchErr(sideEffect)(result);

        // Assert
        expect(sideEffect).not.toHaveBeenCalled();
        expect(caughtResult).toBe(result);
        expect(caughtResult.isSuccess()).toBe(true);
        expect(caughtResult.value()).toBe("Task completed");
    });

});
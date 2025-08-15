import { fail, succeed } from "../../src/factories";
import { tap } from "../../src/operators";
import { ResultError } from "../../src/result.interface";
import { ErrorTag } from "../../src/types";

describe("tap operator", () => {

    it("should perform side-effect on a successful Result and return the original Result", () => {
        // Arrange
        const sideEffect = jest.fn();
        const result = succeed("Task completed");

        // Act
        const tappedResult = tap(sideEffect)(result);

        // Assert
        expect(sideEffect).toHaveBeenCalledWith("Task completed");
        expect(tappedResult).toBe(result);
        expect(tappedResult.isSuccess()).toBe(true);
        expect(tappedResult.value()).toBe("Task completed");
    });

    it("should not perform side-effect on a failure Result and return the original Result", () => {
        // Arrange
        const sideEffect = jest.fn();
        const error: ResultError = { [ErrorTag]: "Error", message: "Operation failed" };
        const result = fail(error);

        // Act
        const tappedResult = tap(sideEffect)(result);

        // Assert
        expect(sideEffect).not.toHaveBeenCalled();
        expect(tappedResult).toBe(result);
        expect(tappedResult.isFailure()).toBe(true);
        expect(tappedResult.error()).toBe(error);
    });

});
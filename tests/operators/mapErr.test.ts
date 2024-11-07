import { fail, succeed } from "../../src/factories";
import { mapErr } from "../../src/operators";
import { ResultError } from "../../src/result.implementation";

describe("mapErr function", () => {

    it("should apply the function to a failure Result and return a new Failure with mapped error", () => {
        // Arrange
        const error = new ResultError("TestError", "Something went wrong");
        const result = fail(error);

        // Act
        const mappedResult = mapErr((e: ResultError) => new ResultError(e.name, "Mapped: " + e.message))(result);

        // Assert
        expect(mappedResult.isFailure()).toBe(true);
        expect(mappedResult.error()?.message).toBe("Mapped: Something went wrong");
    });

    it("should return the original Success if the Result is a success", () => {
        // Arrange
        const result = succeed(42);

        // Act
        const mappedResult = mapErr((e: ResultError) => new ResultError("NewError", "New error message"))(result);

        // Assert
        expect(mappedResult.isSuccess()).toBe(true);
        expect(mappedResult.value()).toBe(42);
    });

});

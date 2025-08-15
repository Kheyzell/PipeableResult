import { fail, succeed } from "../../src/factories";
import { mapErr } from "../../src/operators";
import { ResultError } from "../../src/result.interface";
import { ErrorTag } from "../../src/types";

describe("mapErr operator", () => {

    it("should apply the function to a failure Result and return a new Failure with mapped error", () => {
        // Arrange
        const error: ResultError = { [ErrorTag]: "TestError", message: "Something went wrong" };
        const result = fail(error);

        // Act
        const mappedError: ResultError = { [ErrorTag]: "MappedError", message: "Mapped: Something went wrong" };
        const mappedResult = mapErr((e: ResultError) => mappedError)(result);

        // Assert
        expect(mappedResult.isFailure()).toBe(true);
        expect(mappedResult.error()?.message).toBe("Mapped: Something went wrong");
    });

    it("should return the original Success if the Result is a success", () => {
        // Arrange
        const result = succeed(42);

        // Act
        const error: ResultError = { [ErrorTag]: "NewError", message: "New error message" };
        const mappedResult = mapErr((e: ResultError) => error)(result);

        // Assert
        expect(mappedResult.isSuccess()).toBe(true);
        expect(mappedResult.value()).toBe(42);
    });

});

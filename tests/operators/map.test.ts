import { fail, succeed } from "../../src/factories";
import { map } from "../../src/operators";
import { ResultError } from "../../src/result.implementation";

describe("map function", () => {

    it("should apply the function to a successful Result and return a new Success", () => {
        // Arrange
        const result = succeed(5);

        // Act
        const mappedResult = map((x: number) => x * 2)(result);

        // Assert
        expect(mappedResult.isSuccess()).toBe(true);
        expect(mappedResult.value()).toBe(10);
    });

    it("should return the original Failure if the Result is a failure", () => {
        // Arrange
        const error = new ResultError("TestError", "An error occurred");
        const result = fail(error);

        // Act
        const mappedResult = map((x: number) => x * 2)(result);

        // Assert
        expect(mappedResult.isFailure()).toBe(true);
        expect(mappedResult.error()).toBe(error);
    });

});
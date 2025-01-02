import { fail, succeed } from '../src/factories';
import { ResultImpl, ResultError } from '../src/result.implementation';

describe("Result Factories", () => {

    describe("succeed factory function", () => {
        it("should create a success result with undefined if no argument is provided", () => {
            // Act
            const result = succeed();

            // Assert
            expect(result).toBeInstanceOf(ResultImpl);
            expect(result.isSuccess()).toBe(true);
            expect(result.value()).toBeNull();
        });

        it("should create a success result with the provided value", () => {
            // Act
            const result = succeed(42);

            // Assert
            expect(result).toBeInstanceOf(ResultImpl);
            expect(result.isSuccess()).toBe(true);
            expect(result.value()).toBe(42);
        });
    });

    describe("fail factory function", () => {
        it("should create a failure result with the provided error", () => {
            // Arrange
            const error = new ResultError("TestError", "Something went wrong");

            // Act
            const result = fail(error);

            // Assert
            expect(result).toBeInstanceOf(ResultImpl);
            expect(result.isFailure()).toBe(true);
            expect(result.error()).toBe(error);
        });
    });

});
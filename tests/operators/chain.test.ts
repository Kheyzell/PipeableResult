import { fail, succeed } from "../../src/factories";
import { chain } from "../../src/operators";
import { ResultError } from "../../src/result.implementation";

describe("chain function", () => {

    describe("on a successful Result", () => {
        it("should apply the function return a new Success with mapped value", () => {
            // Arrange
            const result = succeed(5);
    
            // Act
            const chainedResult = chain((x: number) => succeed(x * 2))(result);
            
            // Assert
            expect(chainedResult.isSuccess()).toBe(true);
            expect(chainedResult.value()).toBe(10);
        });
    
        it("should return a new Failure if the function returns an error", () => {
            // Arrange
            const result = succeed(5);
    
            // Act
            const chainedResult = chain(() => new ResultError("NewError", "New error message"))(result);
    
            // Assert
            expect(chainedResult.isFailure()).toBe(true);
            expect(chainedResult.error()?.message).toBe("New error message");
        });
    
        it("should return a value wrapped in a Success if the function returns a value", () => {
            // Arrange
            const result = succeed(5);
    
            // Act
            const chainedResult = chain((x: number) => x * 2)(result);
    
            // Assert
            expect(chainedResult.isSuccess()).toBe(true);
            expect(chainedResult.value()).toBe(10);
        });
    })

    describe("on a failure Result", () => {
        it("should return the original Failure if the Result is a failure", () => {
            // Arrange
            const error = new ResultError("TestError", "Original error");
            const result = fail(error);
    
            // Act
            const chainedResult = chain((x: number) => succeed(x * 2))(result);
    
            // Assert
            expect(chainedResult.isFailure()).toBe(true);
            expect(chainedResult.error()).toBe(error);
        });
    });

});
import { fail, succeed } from "../../src/factories";
import { chainErr } from "../../src/operators";
import { ResultError } from "../../src/result.implementation";

describe("chainErr function", () => {

    describe("on a failure Result", () => {
        it("should apply the function to a failure Result and return a new Result", () => {
            // Arrange
            const error = new ResultError("TestError", "Something went wrong");
            const result = fail(error);
            
            // Act
            const chainedResult = chainErr(() => succeed(true))(result);

            // Assert
            expect(chainedResult.isSuccess()).toBe(true);
            expect(chainedResult.value()).toEqual(true);
        });

        it("should return a new Failure if the function returns an error", () => {
            // Arrange
            const error = new ResultError("TestError", "Something went wrong");
            const result = fail(error);
            
            // Act
            const chainedResult = chainErr(() => new ResultError("NewError", "New error message"))(result);

            // Assert
            expect(chainedResult.isFailure()).toBe(true);
            expect(chainedResult.error()?.message).toBe("New error message");
        });

        it("should return a value wrapped in a Success if the function returns a value", () => {
            // Arrange
            const error = new ResultError("TestError", "Something went wrong");
            const result = fail(error);
            
            // Act
            const chainedResult = chainErr(() => true)(result);

            // Assert
            expect(chainedResult.isSuccess()).toBe(true);
            expect(chainedResult.value()).toEqual(true);
        });
    });
    
    describe("on a success Result", () => {
        it("should return the original Success if the Result is a success", () => {
            // Arrange  
            const result = succeed(42);
            
            // Act
            const chainedResult = chainErr(() => succeed())(result);
    
            // Assert
            expect(chainedResult.isSuccess()).toBe(true);
            expect(chainedResult.value()).toBe(42);
        });
    });

});
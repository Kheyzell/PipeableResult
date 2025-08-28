import { defect, succeed } from '../../src/factories';
import { chain } from '../../src/operators';
import { Result, ResultError } from '../../src/result.interface';
import { ErrorTag } from '../../src/types';

describe('chain operator', () => {
    describe('on a successful Result', () => {
        it('should apply the function and return a new Success with mapped Result', () => {
            // Arrange
            const result = succeed(5);

            // Act
            const chainedResult = chain((x: number) => succeed(x * 2))(result);

            // Assert
            expect(chainedResult.isSuccess()).toBe(true);
            expect(chainedResult.value()).toBe(10);
        });

        it('should apply the function and return a new Failure with mapped Result', () => {
            // Arrange
            const result = succeed(5);

            // Act
            const error: ResultError = { [ErrorTag]: 'NewError', message: 'New error message' };
            const chainedResult = chain(() => defect(error))(result);

            // Assert
            expect(chainedResult.isFailure()).toBe(true);
            expect(chainedResult.error()?.message).toBe('New error message');
        });
    });

    describe('on a failure Result', () => {
        it('should return the original Failure if the Result is a failure', () => {
            // Arrange
            const error: ResultError = { [ErrorTag]: 'TestError', message: 'Original error' };
            const result: Result<number, ResultError> = defect(error);

            // Act
            const chainedResult = chain((x: number) => succeed(x * 2))(result);

            // Assert
            expect(chainedResult.isFailure()).toBe(true);
            expect(chainedResult.error()).toBe(error);
        });
    });
});

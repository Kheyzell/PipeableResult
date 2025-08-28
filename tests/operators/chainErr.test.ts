import { defect, succeed } from '../../src/factories';
import { chainErr } from '../../src/operators';
import { Result, ResultError } from '../../src/result.interface';
import { ErrorTag } from '../../src/types';

describe('chainErr operator', () => {
    describe('on a failure Result', () => {
        it('should apply the function and return a new Success', () => {
            // Arrange
            const error: ResultError = { [ErrorTag]: 'TestError', message: 'Something went wrong' };
            const result = defect<ResultError, boolean>(error);

            // Act
            const chainedResult = chainErr(() => succeed(true))(result);

            // Assert
            expect(chainedResult.isSuccess()).toBe(true);
            expect(chainedResult.value()).toEqual(true);
        });

        it('should apply the function and return a new Failure', () => {
            // Arrange
            const error: ResultError = { [ErrorTag]: 'TestError', message: 'Something went wrong' };
            const result = defect(error);

            const anotherError: ResultError = {
                [ErrorTag]: 'NewError',
                message: 'New error message',
            };

            // Act
            const chainedResult = chainErr(() => defect(anotherError))(result);

            // Assert
            expect(chainedResult.isFailure()).toBe(true);
            expect(chainedResult.error()?.message).toBe('New error message');
        });
    });

    describe('on a success Result', () => {
        it('should return the original Success if the Result is a success', () => {
            // Arrange
            const result: Result<number, ResultError> = succeed(42);

            // Act
            const chainedResult = chainErr(() => succeed(0))(result);

            // Assert
            expect(chainedResult.isSuccess()).toBe(true);
            expect(chainedResult.value()).toBe(42);
        });
    });
});

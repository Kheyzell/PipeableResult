import { defect, safe, succeed } from '../src/factories';
import { ResultImpl } from '../src/result.implementation';
import { ResultError } from '../src/result.interface';
import { ErrorTag } from '../src/types';

describe('Result Factories', () => {
    describe('succeed factory function', () => {
        it('should create a success result with undefined if no argument is provided', () => {
            // Act
            const result = succeed();

            // Assert
            expect(result).toBeInstanceOf(ResultImpl);
            expect(result.isSuccess()).toBe(true);
            expect(result.value()).toBeNull();
        });

        it('should create a success result with the provided value', () => {
            // Act
            const result = succeed(42);

            // Assert
            expect(result).toBeInstanceOf(ResultImpl);
            expect(result.isSuccess()).toBe(true);
            expect(result.value()).toBe(42);
        });
    });

    describe('defect factory function', () => {
        it('should create a failure result with the provided error', () => {
            // Arrange
            const error: ResultError = { [ErrorTag]: 'TestError' };

            // Act
            const result = defect(error);

            // Assert
            expect(result).toBeInstanceOf(ResultImpl);
            expect(result.isFailure()).toBe(true);
            expect(result.error()).toBe(error);
        });
    });

    describe('safe factory function', () => {
        it('should return a Success result with the returned value from the function', () => {
            // Act
            const result = safe(() => 42);

            // Assert
            expect(result.isSuccess()).toBe(true);
            expect(result.value()).toBe(42);
        });

        it('should return a Failure result with an UnknownError when the function throws', () => {
            // Arrange
            const thrownError = new Error('test error');

            const operation = (): void => {
                throw thrownError;
            };

            // Act
            const result = safe(operation);

            // Assert
            expect(result.isFailure()).toBe(true);
            expect(result.error()).toEqual({ [ErrorTag]: 'UnknownError', error: thrownError });
        });

        it('should return a Failure result with the provided error object when the function throws', () => {
            // Arrange
            type TestError = { [ErrorTag]: 'TestError' };
            const error: TestError = { [ErrorTag]: 'TestError' };

            const operation = (): void => {
                throw 'exception';
            };

            // Act
            const result = safe(operation, error);

            // Assert
            expect(result.isFailure()).toBe(true);
            expect(result.error()).toBe(error);
        });

        it('should return a Failure result with the error from the error handler function when the function throws', () => {
            // Arrange
            const thrownError = new Error('test error');

            type HandledError = { [ErrorTag]: 'HandledError'; code: number; ex?: Error };
            const handledError: HandledError = { [ErrorTag]: 'HandledError', code: 500 };

            const operation = (): void => {
                throw thrownError;
            };

            // Act
            const result = safe(operation, (ex) => ({ ...handledError, ex }));

            // Assert
            expect(result.isFailure()).toBe(true);
            expect(result.error()).toEqual({ ...handledError, ex: thrownError });
        });

        it('should return a successful async result with the resolved value', async () => {
            // Act
            const result = await safe(() => Promise.resolve(42));

            // Assert
            expect(result.isSuccess()).toBe(true);
            expect(result.value()).toBe(42);
        });

        it('should return a failed async result with an UnknownError when the promise is rejected', async () => {
            // Arrange
            const rejectedException = new Error('test error');

            // Act
            const result = await safe(() => Promise.reject(rejectedException));

            // Assert
            expect(result.isFailure()).toBe(true);
            expect(result.error()).toEqual({
                [ErrorTag]: 'UnknownError',
                error: rejectedException,
            });
        });

        it('should return a failed async result with the provided error object when the promise is rejected', async () => {
            // Arrange
            type TestError = { [ErrorTag]: 'TestError' };
            const error: TestError = { [ErrorTag]: 'TestError' };

            // Act
            const result = await safe(() => Promise.reject('exception'), error);

            // Assert
            expect(result.isFailure()).toBe(true);
            expect(result.error()).toBe(error);
        });

        it('should return a failed async result with the error from the error handler function when the promise is rejected', async () => {
            // Arrange
            const thrownError = new Error('test error');

            type HandledError = { [ErrorTag]: 'HandledError'; code: number; ex?: Error };
            const handledError: HandledError = { [ErrorTag]: 'HandledError', code: 500 };

            // Act
            const result = await safe(
                () => Promise.reject(thrownError),
                (ex) => ({ ...handledError, ex }),
            );

            // Assert
            expect(result.isFailure()).toBe(true);
            expect(result.error()).toEqual({ ...handledError, ex: thrownError });
        });
    });
});

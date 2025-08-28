import { defect, succeed } from '../../src/factories';
import { match } from '../../src/operators';
import { Result, ResultError, ResultOrAsync } from '../../src/result.interface';
import { ErrorTag, MatchCases } from '../../src/types';

describe('match operator', () => {
    it('should return a Success containing the transformed value when matching on Success', () => {
        // Arrange
        type ErrorType1 = { [ErrorTag]: 'ErrorType1' };
        type ErrorType2 = { [ErrorTag]: 'ErrorType2' };

        type ErrorType3 = { [ErrorTag]: 'ErrorType3' };

        const result: Result<number, ErrorType1 | ErrorType2> = succeed<number>(10);

        const cases: MatchCases<
            number,
            ErrorType1 | ErrorType2,
            Result<number | string, ErrorType3>
        > = {
            Success: (value) => succeed(value * 2),
            ErrorType1: (_error) => succeed('ok'),
            ErrorType2: (_error) => defect<ErrorType3>({ [ErrorTag]: 'ErrorType3' }),
        };

        // Act
        const matched = result.pipe(match(cases));

        // Assert
        expect(matched.isSuccess()).toBe(true);
        expect(matched.value()).toBe(20);
    });

    it('should return a Success containing the result of the matched error handler (ErrorType1)', () => {
        // Arrange
        type ErrorType1 = { [ErrorTag]: 'ErrorType1' };
        type ErrorType2 = { [ErrorTag]: 'ErrorType2' };

        type ErrorType3 = { [ErrorTag]: 'ErrorType3' };

        const error: ErrorType1 = { [ErrorTag]: 'ErrorType1' };
        const result = defect<ErrorType1 | ErrorType2, number>(error);

        const cases: MatchCases<
            number,
            ErrorType1 | ErrorType2,
            Result<number | string, ErrorType3>
        > = {
            Success: (_) => succeed(999),
            ErrorType1: (_error) => succeed('7'),
            ErrorType2: (_error) => defect<ErrorType3>({ [ErrorTag]: 'ErrorType3' }),
        };

        // Act
        const matched = result.pipe(match(cases));

        // Assert
        expect(matched.isSuccess()).toBe(true);
        expect(matched.value()).toBe('7');
    });

    it('should return a Failure containing the result of the matched error handler (ErrorType2)', () => {
        // Arrange
        type ErrorType1 = { [ErrorTag]: 'ErrorType1' };
        type ErrorType2 = { [ErrorTag]: 'ErrorType2' };

        type ErrorType3 = { [ErrorTag]: 'ErrorType3' };

        const error: ErrorType2 = { [ErrorTag]: 'ErrorType2' };
        const result = defect<ErrorType1 | ErrorType2, number>(error);

        const cases: MatchCases<
            number,
            ErrorType1 | ErrorType2,
            Result<number | string, ErrorType3>
        > = {
            Success: (_) => succeed(999),
            ErrorType1: (_error) => succeed('7'),
            ErrorType2: (_error) => defect<ErrorType3>({ [ErrorTag]: 'ErrorType3' }),
        };

        // Act
        const matched = result.pipe(match(cases));

        // Assert
        expect(matched.isFailure()).toBe(true);
        expect(matched.error()?.[ErrorTag]).toBe('ErrorType3');
    });

    it('should handle an asynchronous flow', async () => {
        // Arrange
        type ErrorType1 = { [ErrorTag]: 'ErrorType1' };
        type ErrorType2 = { [ErrorTag]: 'ErrorType2' };

        type ErrorType3 = { [ErrorTag]: 'ErrorType3' };

        const result: Result<number, ErrorType1 | ErrorType2> = succeed<number>(10);

        const cases: MatchCases<
            number,
            ErrorType1 | ErrorType2,
            ResultOrAsync<number | string, ErrorType3>
        > = {
            Success: (_) => Promise.resolve(succeed(999)),
            ErrorType1: (_error) => succeed('7'),
            ErrorType2: (_error) =>
                Promise.resolve(defect<ErrorType3>({ [ErrorTag]: 'ErrorType3' })),
        };

        // Act
        const matchedPromise = result.pipe(match(cases));

        // Assert
        expect(matchedPromise).toBeInstanceOf(Promise);

        const matched = await matchedPromise;
        expect(matched.isSuccess()).toBe(true);
        expect(matched.value()).toBe(999);
    });

    it('should handle an asynchronous flow and return the synchronous case as a Promise', async () => {
        // Arrange
        type ErrorType1 = { [ErrorTag]: 'ErrorType1' };
        type ErrorType2 = { [ErrorTag]: 'ErrorType2' };

        type ErrorType3 = { [ErrorTag]: 'ErrorType3' };

        const error: ErrorType1 = { [ErrorTag]: 'ErrorType1' };
        const result = defect<ErrorType1 | ErrorType2, number>(error);

        const cases: MatchCases<
            number,
            ErrorType1 | ErrorType2,
            ResultOrAsync<number | string, ErrorType3>
        > = {
            Success: (_) => Promise.resolve(succeed(999)),
            ErrorType1: (_error) => succeed('7'),
            ErrorType2: (_error) =>
                Promise.resolve(defect<ErrorType3>({ [ErrorTag]: 'ErrorType3' })),
        };

        // Act
        const matchedPromise = result.pipe(match(cases));

        // Assert
        expect(matchedPromise).not.toBeInstanceOf(Promise);

        const matched = await matchedPromise;
        expect(matched.isSuccess()).toBe(true);
        expect(matched.value()).toBe('7');
    });

    it('should throw if no matching case is provided', () => {
        // Arrange
        const error: ResultError = { [ErrorTag]: 'UnhandledType', message: 'Unhandled' };
        const result = defect(error);
        const cases = {
            Success: (_: number) => 1,
            // Missing handler for "UnhandledType"
        } as any;

        // Act & Assert
        expect(() => match(cases)(result)).toThrow();
    });
});

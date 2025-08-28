import { defect, succeed } from '../../src/factories';
import { tapErr } from '../../src/operators';
import { ResultError } from '../../src/result.interface';
import { ErrorTag } from '../../src/types';

describe('tapErr operator', () => {
    it('should perform side-effect on a failure Result and return the original Result', () => {
        // Arrange
        const sideEffect = jest.fn();
        const error: ResultError = { [ErrorTag]: 'TestError', message: 'Task failed' };
        const result = defect(error);

        // Act
        const caughtResult = tapErr(sideEffect)(result);

        // Assert
        expect(sideEffect).toHaveBeenCalledWith(error);
        expect(caughtResult).toBe(result);
        expect(caughtResult.isFailure()).toBe(true);
        expect(caughtResult.error()).toBe(error);
    });

    it('should not perform side-effect on a success Result and return the original Result', () => {
        // Arrange
        const sideEffect = jest.fn();
        const result = succeed('Task completed');

        // Act
        const caughtResult = tapErr(sideEffect)(result);

        // Assert
        expect(sideEffect).not.toHaveBeenCalled();
        expect(caughtResult).toBe(result);
        expect(caughtResult.isSuccess()).toBe(true);
        expect(caughtResult.value()).toBe('Task completed');
    });
});

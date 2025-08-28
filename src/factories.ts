import { MaybeAsync } from '../out/src/types';
import { ResultImpl } from './result.implementation';
import { Result, ResultAsync, ResultError, ResultOrAsync } from './result.interface';
import { ErrorTag } from './types';

/** Factories **/

/**
 * Creates a `Success` `Result`.
 * Contains a value if provided.
 *
 * @example
 * const result1 = succeed(5);             // Successful Result with value 5
 * const result2 = succeed("Success!");    // Successful Result with value "Success!"
 * const result3 = succeed();              // Successful Result with no value
 */
export function succeed(): Result<void, never>;
export function succeed<Value>(value: Value): Result<Value, never>;
export function succeed<Value>(value?: Value): Result<Value | void, never> {
    return ResultImpl.succeed(value);
}

/**
 * Creates a `Failure` `Result` with the provided error.
 * It is recommended to use a specific type for the error in the same of a `ResultError`.
 *
 * @example
 * type HttpNotFoundError = { [ErrorTag]: "HttpNotFoundError", code: 404, ressourceType: string };
 * ...
 * const result = defect<HttpNotFoundError>({ [ErrorTag]: "HttpNotFoundError", code: 404, ressourceType: "MediaFile" });*
 */
export function defect<Err extends ResultError = never, Value = never>(
    error: Err,
): Result<Value, Err> {
    return ResultImpl.defect(error);
}

/** Error type created when a `safe` method catches an exception and no error handler is provided. */
export type UnknownError = { [ErrorTag]: 'UnknownError'; error: unknown };

/**
 * Used to safely wrap up an exception and turn it into a `ResultError`.
 * Creates a `Result` containing the value returned by the provided function or a error if the function throws.
 *
 * @example
 * const result = safe(() => 8); // Returns a `Success` with value 8
 * const result = safe(() => 8/0); // Returns a `Failure` with a `UnknownError`
 * const result = safe<DivisionByZeroError>(() => 8/0, { [ErrorTag]: "DivisionByZeroError" }); // Returns a `Failure` with a `DivisionByZeroError`
 * const result = safe<DivisionByZeroError>(() => 8/0, (ex) => ({ [ErrorTag]: "DivisionByZeroError", ex })); // Returns a `Failure` with a `DivisionByZeroError`
 * const result = await safe<DivisionByZeroError>(() => Promise.resolve(8/0)); // Returns a `ResultAsync<number, DivisionByZeroError>`
 */
export function safe<Value, Err extends ResultError>(
    fn: () => Promise<Value>,
    error: Err,
): ResultAsync<Value, Err>;
export function safe<Value, Err extends ResultError>(
    fn: () => Value,
    error: Err,
): Result<Value, Err>;
export function safe<Value, Err extends ResultError>(
    fn: () => Promise<Value>,
    errorHandler: (ex: unknown) => Err,
): ResultAsync<Value, Err>;
export function safe<Value, Err extends ResultError>(
    fn: () => Value,
    errorHandler: (ex: unknown) => Err,
): Result<Value, Err>;
export function safe<Value>(fn: () => Promise<Value>): ResultAsync<Value, UnknownError>;
export function safe<Value>(fn: () => Value): Result<Value, UnknownError>;
export function safe<Err extends ResultError, Value>(
    fn: () => MaybeAsync<Value>,
    errorHandler?: ((ex: unknown) => Err) | Err,
): ResultOrAsync<Value, ResultError> {
    try {
        const value = fn();
        if (value instanceof Promise) {
            return value
                .then((value) => succeed(value))
                .catch((ex) => {
                    return handleExceptionDuringSafe(ex, errorHandler);
                });
        }

        return succeed(value);
    } catch (ex) {
        return handleExceptionDuringSafe(ex, errorHandler);
    }
}

function handleExceptionDuringSafe(
    ex: unknown,
    errorHandler?: ((ex: unknown) => ResultError) | ResultError,
) {
    if (!errorHandler) {
        return defect({ [ErrorTag]: 'UnknownError', error: ex });
    }

    if (typeof errorHandler === 'function') {
        const errorFactory = errorHandler;
        return defect(errorFactory(ex));
    }

    const error = errorHandler;
    return defect(error);
}

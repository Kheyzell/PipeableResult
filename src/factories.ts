import { ResultImpl, ResultError } from "./result.implementation";
import { Result } from "./result.interface";

/** Factories **/

/**
 * Creates a `Success` `Result` with the provided value.
 * 
 * @example
 * const result = succeed(5);
 */
export function succeed(): Result<any, any>;
export function succeed<O>(arg: O): Result<O, any>;
export function succeed<O>(arg?: O): Result<O | undefined, any> {
    return ResultImpl.succeed(arg);
}

/**
 * Creates a `Failure` `Result` with the provided error.
 * 
 * @example
 * const result = fail(new ResultError('Error', 'Something went wrong'));
 */
export function fail<E extends ResultError>(arg: E): Result<any, E> {
    return ResultImpl.fail(arg);
}
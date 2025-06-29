import { ResultError, ResultImpl } from "./result.implementation";
import { Result } from "./result.interface";
import { isError } from "./type-guards";

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
 * Creates a `Failure` `Result` with the provided error or error name and message.
 *
 * @example
 * const result = fail("Error", "Something went wrong");
 * // OR ...
 * const error = new ResultError('Error', 'Something went wrong');
 * const result = fail(error);
 */
export function fail<E extends ResultError>(name: string, message?: string): Result<any, E>;
export function fail<E extends ResultError>(arg: E): Result<any, E>;
export function fail<E extends ResultError>(...args: [string, string?] | [E]): Result<any, E> {
  if (isError<E>(args[0])) {
    return ResultImpl.fail(args[0]);
  }

  const [name, message] = args;
  return ResultImpl.fail(new ResultError(name, message ?? "") as E);
}

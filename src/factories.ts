import { ResultImpl } from "./result.implementation";
import { Result, ResultError } from "./result.interface";

/** Factories **/

/**
 * Creates a `Success` `Result`.
 * Contains a value if provided.
 *
 * @example
 * const result = succeed();
 * // ... or
 * const countResult = succeed(5);
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
 * const result = fail<HttpNotFoundError>({ [ErrorTag]: "HttpNotFoundError", code: 404, ressourceType: "MediaFile" });*
 */
export function fail<E extends ResultError, Value = never>(error: E): Result<Value, E> {
  return ResultImpl.fail(error);
}
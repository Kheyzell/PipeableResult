import { ResultImpl } from "./result.implementation";
import { Result, ResultError } from "./result.interface";

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
export function defect<E extends ResultError, Value = never>(error: E): Result<Value, E> {
  return ResultImpl.defect(error);
}
import { defect, succeed } from "../factories";
import { ResultImpl } from "../result.implementation";
import {
  Result,
  ResultAsync,
  ResultError,
  ResultOrAsync,
  UnwrapResultError
} from "../result.interface";
import { ErrorCaseReturns, ErrorCases, MatchCases, MatchCasesReturns, MaybeAsync } from "../types";

/** Operators **/

/**
 * Applies a transformation to a successful `Result` value using the provided predicate.
 * The predicate returns a mapped value, which is wrapped in a new `Success`.
 * If the `Result` is a `Failure`, it returns the original `Failure`.
 *
 * @example
 * const result = succeed(5);
 * const mappedResult = result.pipe(map(x => x * 2)); // Returns a `Success` with value 10
 */
export function map<InputValue, Err extends ResultError, OutputValue>(
  fn: (arg: InputValue) => OutputValue
) {
  return (result: Result<InputValue, Err>): Result<OutputValue, Err> => {
    if (result.isSuccess()) {
      return succeed(fn(result.value()));
    }
    return defect(result.error()!);
  };
}

/**
 * Applies a transformation to a `Failure` error value using the provided predicate.
 * The predicate returns a mapped error, which is wrapped in a new `Failure`.
 * If the `Result` is a `Success`, it returns the original `Success`.
 *
 * @example
 * type UnknownError = { [ErrorTag]: "UnknownError" };
 * type UserAccountNotActivated = { [ErrorTag]: "UserAccountNotActivated" };
 * ...
 * const apiCallResult = defect<UnknownError>({ [ErrorTag]: "UnknownError" });
 * const result2 = apiCallResult.pipe(mapErr(e => ({ [ErrorTag]: "UserAccountNotActivated" }) as UserAccountNotActivated)); // Returns a `Failure` with this `UserAccountNotActivated` error
 */
export function mapErr<Input, ErrInput extends ResultError, ErrOutput extends ResultError>(
  fn: (arg: ErrInput) => ErrOutput
): (result: Result<Input, ErrInput>) => Result<Input, ErrOutput>;
export function mapErr<Input, ErrInput extends ResultError, ErrOutput extends ResultError>(
  fn: (arg: ErrInput) => Promise<ErrOutput>
): (result: Result<Input, ErrInput>) => Promise<Result<Input, ErrOutput>>;
export function mapErr<Value, ErrInput extends ResultError, ErrOutput extends ResultError>(
    fn: (arg: ErrInput) => MaybeAsync<ErrOutput>
) {
  return (result: Result<Value, ErrInput>): ResultOrAsync<Value, ErrOutput> => {
    if (result.isFailure()) {
      const fnRes = fn(result.error()!);
      if (fnRes instanceof Promise) {
        return fnRes.then((err) => defect(err));
      }
      return defect(fnRes);
    }
    return ResultImpl.succeed(result.value());
  };
}

/**
 * Chains another operation on a successful `Result` value that returns a new `Result`.
 * If the `Result` is a `Failure`, it returns the original `Failure`.
 *
 * @example
 * const result = succeed(5);
 * const chainedResult = result.pipe(chain(x => {
 *     if (x < 0) { // if the value negative returns a `Failure`
 *         return defect({ [ErrorTag]: "NegativeNumberError" });
 *     }
 *     return succeed(x * 2); // Returns a `Success` with value 10
 * }));
 */
export function chain<Input, ErrInput extends ResultError, Output, ErrOutput extends ResultError>(
  fn: (arg: Input) => ResultAsync<Output, ErrOutput>
): (
  result: Result<Input, ErrInput>
) => ResultAsync<Output, ErrInput | ErrOutput>;
export function chain<Input, ErrInput  extends ResultError,Output, ErrOutput  extends ResultError>(
  fn: (arg: Input) => Result<Output, ErrOutput>
): (result: Result<Input, ErrInput>) => Result<Output, ErrInput | ErrOutput>;
export function chain<Input, ErrInput extends ResultError, Output, ErrOutput extends ResultError>(
    fn: (arg: Input) => ResultOrAsync<Output, ErrOutput>
) {
  return (result: Result<Input, ErrInput>) => {
    if (result.isSuccess()) {
      return fn(result.value());
    }
    return ResultImpl.defect(result.error()!);
  };
}

/**
 * Chains another operation on a `Failure` error value that returns a new `Result`.
 * If the `Result` is a `Success`, it returns the original `Success`.
 *
 * @example
 * const result = defect({ [ErrorTag]: "UnknownError" });
 * const handledResult = result.pipe(chainErr(e => succeed([]))); // Converts the failure to success
 */
export function chainErr<Input, ErrInput extends ResultError, ErrOutput extends ResultError>(
  fn: (arg: ErrInput) => Result<Input, ErrOutput>
): (result: Result<Input, ErrInput>) => Result<Input, ErrInput | ErrOutput>;
export function chainErr<Input, ErrInput extends ResultError, ErrOutput extends ResultError>(
  fn: (arg: ErrInput) => ResultAsync<Input, ErrOutput>
): (result: Result<Input, ErrInput>) => ResultAsync<Input, ErrInput | ErrOutput>;
export function chainErr<Input, ErrInput extends ResultError, ErrOutput extends ResultError>(
    fn: (arg: ErrInput) => ResultOrAsync<Input, ErrOutput>
) {
  return (
    result: Result<Input, ErrInput>
  ): ResultOrAsync<Input, ErrInput | ErrOutput> => {
    if (result.isFailure()) {
      return fn(result.error()!);
    }

    return ResultImpl.succeed(result.value());
  };
}

/**
 * Performs a side-effect operation on a successful `Result` value.
 * Returns the original `Result` after the side effect.
 *
 * @example
 * const result = succeed('Task completed!');
 * result.pipe(tap(state => console.log(state))); // Logs "Task completed!" and returns the original `Result`
 */
export function tap<Value, Err extends ResultError>(
  fn: (arg: Value) => void
): (result: Result<Value, Err>) => Result<Value, Err>;
export function tap<Value, Err extends ResultError>(
  fn: (arg: Value) => Promise<void>
): (result: Result<Value, Err>) => Promise<Result<Value, Err>>;
export function tap<Value, Err extends ResultError>(
  fn: (arg: Value) => MaybeAsync<void>
) {
  return (result: Result<Value, Err>): ResultOrAsync<Value, Err> => {
    if (result.isSuccess()) {
      const fnRes = fn(result.value());
      if (fnRes instanceof Promise) {
        return fnRes.then(() => result);
      }
    }
    return result;
  };
}

/**
 * Performs a side-effect operation on a `Failure` error value.
 * Returns the original `Result` after the side effect.
 *
 * @example
 * const result = defect(new ResultError('Error', 'Task failed'));
 * result.pipe(catchErr(err => console.error(err))); // Logs the error and returns the original `Result`
 */
export function catchErr<Value, Err extends ResultError>(
  fn: (arg: Err) => void
): (result: Result<Value, Err>) => Result<Value, Err>;
export function catchErr<Value, Err extends ResultError>(
  fn: (arg: Err) => Promise<void>
): (result: Result<Value, Err>) => Promise<Result<Value, Err>>;
export function catchErr<Value, Err extends ResultError>(
  fn: (arg: Err) => MaybeAsync<void>
) {
  return (result: Result<Value, Err>): ResultOrAsync<Value, Err> => {
    if (result.isFailure()) {
      fn(result.error()!);
    }
    return result;
  };
}


/**
 * Provides a matching structure on the `Result` `Success` case
 * and all `Failure` cases (meaning all possible errors) to a `Success`.
 *
 * @example
 * const result: Result<number, ErrorType1 | ErrorType2>;
 * result.pipe(
 *     match({
 *         Success: value => succeed(value * 2),
 *         ErrorType1: error => succeed(error.code === 500 ? true : false),
 *         ErrorType2: error => someOtherCalculation(error),
 *     })
 * );
*/
export function match<Value, Err extends ResultError, Cases extends MatchCases<Value, Err, any>>(
  cases: Cases
) {
  return (result: Result<Value, Err>): MatchCasesReturns<Cases> => {
    return result.match(cases);
  };
}

/**
 * Provides a matching structure on all `Failure` cases (meaning all possible errors) to a `Success`.
 *
 * @example
 * const result: Result<number, ErrorType1 | ErrorType2 | ErrorType3>;
 * result.pipe(
 *     matchErrors({
 *         ErrorType1: error => succeed(0),
 *         ErrorType2: error => succeed("VALUE_0"),
 *         ErrorType3: error => defect<ErrorType5>({ [ErrorTag]: "ErrorType4", message: `Error code ${error.code}` }),
 *     })
 * );
 */
export function matchErrors<R extends Result<any, any>, Cases extends ErrorCases<UnwrapResultError<R>, ResultOrAsync<any, UnwrapResultError<R>>>>(
  errorCases: Cases
) {
  return (result: R): R | ErrorCaseReturns<Cases> => {
    return result.matchErrors(errorCases);
  }
}
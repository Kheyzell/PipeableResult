import { succeed, fail } from "../factories";
import { ResultError, ResultImpl } from "../result.implementation";
import { Result } from "../result.interface";
import { isResult, isError } from "../type-guards";

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
export const map = <Value, Err extends ResultError, A>(
    fn: (arg: Value) => A
) => (result: Result<Value, Err>): Result<A, Err> => {
    if (result.isSuccess()) {
        return succeed(fn(result.value())) as Result<A, Err>;
    }
    return ResultImpl.fail(result.error()!)
};

/**
 * Applies a transformation to a `Failure` error value using the provided predicate.
 * The predicate returns a mapped error, which is wrapped in a new `Failure`.
 * If the `Result` is a `Success`, it returns the original `Success`.
 * 
 * @example
 * const result = fail(new ResultError('Error', 'Something went wrong'));
 * const handledResult = result.pipe(mapErr(e => new AnotherError(e.name, 'Handled: ' + e.message)));
 */
export const mapErr = <Value, Err extends ResultError, B extends ResultError>(
    fn: (arg: Err) => B | Promise<B>
) => (result: Result<Value, Err>): Result<Value, B> => {
    if (result.isFailure()) {
        const fnRes = fn(result.error()!);
        if (fnRes instanceof Promise) {
            return fnRes.then(err => fail(err)) as any as Result<Value, B>;
        }
        return fail(fnRes) as Result<Value, B>;
    }
    return ResultImpl.succeed(result.value());
};

/**
 * Chains another operation on a successful `Result` value that returns a new `Result`.
 * If the `Result` is a `Failure`, it returns the original `Failure`.
 * 
 * @example
 * const result = succeed(5);
 * const chainedResult = result.pipe(chain(x => succeed(x * 2))); // Returns a `Success` with value 10
 */
export const chain = <Value, Err extends ResultError, A>(
    fn: (arg: Value) => (Result<A, Err> | A | Err)
) => (result: Result<Value, Err>): Result<A, Err> => {
    if (result.isSuccess()) {
        const fnValue = fn(result.value());
        if (isResult(fnValue)) {
            return fnValue as Result<A, Err>;
        }

        if (isError<Err>(fnValue)) {
            const error = fnValue as Err;
            return ResultImpl.fail(error) as Result<A, Err>;
        }

        return succeed(fnValue) as Result<A, Err>;
    }

    return ResultImpl.fail(result.error()!);
};

/**
 * Chains another operation on a `Failure` error value that returns a new `Result`.
 * If the `Result` is a `Success`, it returns the original `Success`.
 * 
 * @example
 * const result = fail(new ResultError('Error', 'Something went wrong'));
 * const handledResult = result.pipe(chainErr(e => succeed([]))); // Converts the failure to success
 */
export const chainErr = <Value, Err extends ResultError, B extends ResultError>(
    fn: (arg: Err) => (Result<Value, B> | Value | B | Promise<Result<Value, B> | Value | B>)
) => (result: Result<Value, Err>): Result<Value, B> => {
    if (result.isFailure()) {
        const fnValue = fn(result.error()!);
        if (isResult(fnValue)) {
            return fnValue as Result<Value, B>;
        }

        if (isError(fnValue)) {
            return ResultImpl.fail(fnValue) as Result<Value, B>;
        }

        return succeed(fnValue) as Result<Value, B>;
    }

    return ResultImpl.succeed(result.value()) as Result<Value, B>;
};

/**
 * Performs a side-effect operation on a successful `Result` value.
 * Returns the original `Result` after the side effect.
 * 
 * @example
 * const result = succeed('Task completed');
 * result.pipe(tap(() => console.log('Success!'))); // Logs "Success!" and returns the original `Result`
 */
export const tap = <Value, Err extends ResultError>(
    fn: (arg: Value) => void
) => (result: Result<Value, Err>): Result<Value, Err> => {
    if (result.isSuccess()) {
        fn(result.value());
    }
    return result;
};

/**
 * Performs a side-effect operation on a `Failure` error value.
 * Returns the original `Result` after the side effect.
 * 
 * @example
 * const result = fail(new ResultError('Error', 'Task failed'));
 * result.pipe(catchErr(err => console.error(err))); // Logs the error and returns the original `Result`
 */
export const catchErr = <Value, Err extends ResultError>(
    fn: (arg: Err) => void
) => (result: Result<Value, Err>): Result<Value, Err> => {
    if (result.isFailure()) {
        fn(result.error()!);
    }
    return result;
};

/**
 * Matches the `Result` against a success case (`ok`) and an error case (`err`).
 * It passes the value or error to the appropriate handler and returns the original `Result`.
 * 
 * @example
 * const result = succeed('Task completed');
 * result.pipe(match({
 *     ok: value => console.log('Success:', value),
 *     err: error => console.error('Error:', error)
 * }));
 */
export const match = <Value, Err extends ResultError>(
    handlers: { ok: (arg: Value) => void; err: (arg: Err) => void }
) => (result: Result<Value, Err>): Result<Value, Err> => {
    if (result.isSuccess()) {
        handlers.ok(result.value());
    } else {
        handlers.err(result.error()!);
    }
    return result;
};
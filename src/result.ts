export type Result<Value, Err extends ResultError> = Success<Value> | Failure<Err>;

type Pipeable<Value, Err extends ResultError> = {
    /**
     * Chains multiple operations that take a `Result` and return a new `Result`. The `pipe`
     * method allows transformations to be applied sequentially on the `Result`.
     * 
     * @example
     * const result = succeed('hello');
     * result.pipe(
     *     map(x => x.toUpperCase()),
     *     catchErr(e => console.log(e))
     * );
     */
    pipe: (...fns: Array<(result: Result<Value, Err>) => Result<Value, Err>>) => Result<Value, Err>;
};

type ResultInspectable<Value, Err extends ResultError> = {
    /**
     * Safely get the value inside the Result by handling the error case.
     * @example
     * const result = unsafeCalculation(); // some Result<number, ResultError> to handle
     * const value = result.unwrap({ // safely unwrap the value
     *     err: (error: ResultError) => { // handle the error case
     *         if (error instanceof DivisionByZeroError) {
     *             return 0; // example: return 0 in case of this specific error
     *         }
     * 
     *         throw new Error(`Unexpected error: ${error}`); // example: throw an exception to be handled out of the result pattern
     *     }
     * });
     */
    unwrap: () => Value;

    /**
     * Returns a string representation of the `Result`. If the `Result` is a `Failure`,
     * the string representation is `Failure(<error>)`. If the `Result` is a `Success`,
     * the string representation is `Success(<value>)`.
     */
    inspect: () => string;

    /**
     * Returns `true` if the `Result` is a `Success`, `false` otherwise.
     */
    isSuccess: () => boolean;

    /**
     * Returns `true` if the `Result` is a `Failure`, `false` otherwise.
     */
    isFailure: () => boolean;

    /**
     * /!\ Unsafely /!\ Returns the value inside the `Result`.
     * Throws an error if it's a `Failure`.
     */
    value: () => Value;

    /**
     * Returns the error if it's a `Failure`, or `null` if it's a `Success`.
     */
    error: () => Err | null;
};

type Success<Value> = Pipeable<Value, ResultError> & ResultInspectable<Value, ResultError> & {
    type: 'success';
};

type Failure<Err extends ResultError> = Pipeable<any, Err> & ResultInspectable<any, Err> & {
    type: 'failure';
    _error: Err;
};

export class ResultError extends Error {
    constructor(name: string, message: string) {
        super();
        this.name = name;
        this.message = message;
    }
}

/** Type Guards **/

const isSuccess = <Value, Err extends ResultError>(result: Result<Value, Err>): result is Success<Value> => {
    return result.type === 'success';
};

const isFailure = <Value, Err extends ResultError>(result: Result<Value, Err>): result is Failure<Err> => {
    return result.type === 'failure';
};

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
    if (isSuccess(result)) {
        return succeed(fn(result.value()));
    }
    return result as Result<A, Err>;
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
    fn: (arg: Err) => B
) => (result: Result<Value, Err>): Result<Value, B> => {
    if (isFailure(result)) {
        return fail(fn(result._error));
    }
    return result as Result<Value, B>;
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
    fn: (arg: Value) => Result<A, Err>
) => (result: Result<Value, Err>): Result<A, Err> => {
    if (isSuccess(result)) {
        return fn(result.value());
    }
    return result as Result<A, Err>;
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
    fn: (arg: Err) => Result<Value, B>
) => (result: Result<Value, Err>): Result<Value, B> => {
    if (isFailure(result)) {
        return fn(result._error);
    }
    return result as Result<Value, B>;
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
    if (isSuccess(result)) {
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
    if (isFailure(result)) {
        fn(result._error);
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
    if (isSuccess(result)) {
        handlers.ok(result.value());
    } else {
        handlers.err(result._error);
    }
    return result;
};

/** Constructors **/

const success = <O>(value: O): Success<O> => ({
    type: 'success',
    pipe: (...fns) => fns.reduce((acc, fn) => fn(acc), succeed(value)),
    unwrap: () => value,
    inspect: () => `Success(${value})`,
    isSuccess: () => true,
    isFailure: () => false,
    value: () => value,
    error: () => null
});

const failure = <E extends ResultError>(error: E): Failure<E> => ({
    type: 'failure',
    _error: error,
    pipe: (...fns) => fns.reduce((acc, fn) => fn(acc), fail(error)),
    unwrap: () => { throw new Error('Cannot unwrap a Failure'); },
    inspect: () => `Failure(${error.message})`,
    isSuccess: () => false,
    isFailure: () => true,
    value: () => { throw new Error('Cannot get value from Failure'); },
    error: () => error
});

export function succeed(): Result<any, any>;
export function succeed<O>(arg: O): Result<O, any>;
export function succeed<O>(arg?: O): Result<O | undefined, any> {
    return success(arg);
}

export function fail<E extends ResultError>(arg: E): Result<any, E> {
    return failure(arg);
}
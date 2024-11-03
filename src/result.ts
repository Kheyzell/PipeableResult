export interface Result<Value, Err extends ResultError> {
    /**
     * Returns `true` if the `Result` is a `Success`, `false` otherwise.
     */
    isSuccess(): boolean;

    /**
     * Returns `true` if the `Result` is a `Failure`, `false` otherwise.
     */
    isFailure(): boolean;

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
    unwrap(obj: { err: (error: Err) => Value }): Value;

    /**
     * Returns a string representation of the `Result`. If the `Result` is a `Failure`,
     * the string representation is `Failure(<error>)`. If the `Result` is a `Success`,
     * the string representation is `Success(<value>)`.
     */
    inspect(): string;
    
    /**
     * /!\ Unsafely /!\ Returns the value inside the `Result`.
     * Throws an error if it's a `Failure`.
     */
    value(): Value;
    
    /**
     * Returns the error if it's a `Failure`, or `null` if it's a `Success`.
     */
    error(): Err | null;

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
    pipe(): Result<Value, ResultError>;
    pipe<A>(op1: ResultOperatorFunction<Value, ResultError, A, ResultError>): Result<A, ResultError>;
    pipe<A, B>(op1: ResultOperatorFunction<Value, ResultError, A, ResultError>, op2: ResultOperatorFunction<A, ResultError, B, ResultError>): Result<B, ResultError>;
    pipe<A, B, C>(op1: ResultOperatorFunction<Value, ResultError, A, ResultError>, op2: ResultOperatorFunction<A, ResultError, B, ResultError>, op3: ResultOperatorFunction<B, ResultError, C, ResultError>): Result<C, ResultError>;
    pipe<A, B, C, D>(op1: ResultOperatorFunction<Value, ResultError, A, ResultError>, op2: ResultOperatorFunction<A, ResultError, B, ResultError>, op3: ResultOperatorFunction<B, ResultError, C, ResultError>, op4: ResultOperatorFunction<C, ResultError, D, ResultError>): Result<D, ResultError>;
    pipe<A, B, C, D, E>(op1: ResultOperatorFunction<Value, ResultError, A, ResultError>, op2: ResultOperatorFunction<A, ResultError, B, ResultError>, op3: ResultOperatorFunction<B, ResultError, C, ResultError>, op4: ResultOperatorFunction<C, ResultError, D, ResultError>, op5: ResultOperatorFunction<D, ResultError, E, ResultError>): Result<E, ResultError>;
    pipe<A, B, C, D, E, F>(op1: ResultOperatorFunction<Value, ResultError, A, ResultError>, op2: ResultOperatorFunction<A, ResultError, B, ResultError>, op3: ResultOperatorFunction<B, ResultError, C, ResultError>, op4: ResultOperatorFunction<C, ResultError, D, ResultError>, op5: ResultOperatorFunction<D, ResultError, E, ResultError>, op6: ResultOperatorFunction<E, ResultError, F, ResultError>): Result<F, ResultError>;
    pipe<A, B, C, D, E, F, G>(op1: ResultOperatorFunction<Value, ResultError, A, ResultError>, op2: ResultOperatorFunction<A, ResultError, B, ResultError>, op3: ResultOperatorFunction<B, ResultError, C, ResultError>, op4: ResultOperatorFunction<C, ResultError, D, ResultError>, op5: ResultOperatorFunction<D, ResultError, E, ResultError>, op6: ResultOperatorFunction<E, ResultError, F, ResultError>, op7: ResultOperatorFunction<F, ResultError, G, ResultError>): Result<G, ResultError>;
    pipe<A, B, C, D, E, F, G, H>(op1: ResultOperatorFunction<Value, ResultError, A, ResultError>, op2: ResultOperatorFunction<A, ResultError, B, ResultError>, op3: ResultOperatorFunction<B, ResultError, C, ResultError>, op4: ResultOperatorFunction<C, ResultError, D, ResultError>, op5: ResultOperatorFunction<D, ResultError, E, ResultError>, op6: ResultOperatorFunction<E, ResultError, F, ResultError>, op7: ResultOperatorFunction<F, ResultError, G, ResultError>, op8: ResultOperatorFunction<G, ResultError, H, ResultError>): Result<H, ResultError>;
    pipe<A, B, C, D, E, F, G, H, I>(op1: ResultOperatorFunction<Value, ResultError, A, ResultError>, op2: ResultOperatorFunction<A, ResultError, B, ResultError>, op3: ResultOperatorFunction<B, ResultError, C, ResultError>, op4: ResultOperatorFunction<C, ResultError, D, ResultError>, op5: ResultOperatorFunction<D, ResultError, E, ResultError>, op6: ResultOperatorFunction<E, ResultError, F, ResultError>, op7: ResultOperatorFunction<F, ResultError, G, ResultError>, op8: ResultOperatorFunction<G, ResultError, H, ResultError>, op9: ResultOperatorFunction<H, ResultError, I, ResultError>): Result<I, ResultError>;
    pipe<A, B, C, D, E, F, G, H, I, J>(op1: ResultOperatorFunction<Value, ResultError, A, ResultError>, op2: ResultOperatorFunction<A, ResultError, B, ResultError>, op3: ResultOperatorFunction<B, ResultError, C, ResultError>, op4: ResultOperatorFunction<C, ResultError, D, ResultError>, op5: ResultOperatorFunction<D, ResultError, E, ResultError>, op6: ResultOperatorFunction<E, ResultError, F, ResultError>, op7: ResultOperatorFunction<F, ResultError, G, ResultError>, op8: ResultOperatorFunction<G, ResultError, H, ResultError>, op9: ResultOperatorFunction<H, ResultError, I, ResultError>, op10: ResultOperatorFunction<I, ResultError, J, ResultError>): Result<J, ResultError>;
    pipe<A, B, C, D, E, F, G, H, I, J, K>(op1: ResultOperatorFunction<Value, ResultError, A, ResultError>, op2: ResultOperatorFunction<A, ResultError, B, ResultError>, op3: ResultOperatorFunction<B, ResultError, C, ResultError>, op4: ResultOperatorFunction<C, ResultError, D, ResultError>, op5: ResultOperatorFunction<D, ResultError, E, ResultError>, op6: ResultOperatorFunction<E, ResultError, F, ResultError>, op7: ResultOperatorFunction<F, ResultError, G, ResultError>, op8: ResultOperatorFunction<G, ResultError, H, ResultError>, op9: ResultOperatorFunction<H, ResultError, I, ResultError>, op10: ResultOperatorFunction<I, ResultError, J, ResultError>, op11: ResultOperatorFunction<J, ResultError, K, ResultError>): Result<K, ResultError>;
    pipe<A, B, C, D, E, F, G, H, I, J, K, L>(op1: ResultOperatorFunction<Value, ResultError, A, ResultError>, op2: ResultOperatorFunction<A, ResultError, B, ResultError>, op3: ResultOperatorFunction<B, ResultError, C, ResultError>, op4: ResultOperatorFunction<C, ResultError, D, ResultError>, op5: ResultOperatorFunction<D, ResultError, E, ResultError>, op6: ResultOperatorFunction<E, ResultError, F, ResultError>, op7: ResultOperatorFunction<F, ResultError, G, ResultError>, op8: ResultOperatorFunction<G, ResultError, H, ResultError>, op9: ResultOperatorFunction<H, ResultError, I, ResultError>, op10: ResultOperatorFunction<I, ResultError, J, ResultError>, op11: ResultOperatorFunction<J, ResultError, K, ResultError>, op12: ResultOperatorFunction<K, ResultError, L, ResultError>): Result<L, ResultError>;
    pipe<A, B, C, D, E, F, G, H, I, J, K, L, M>(op1: ResultOperatorFunction<Value, ResultError, A, ResultError>, op2: ResultOperatorFunction<A, ResultError, B, ResultError>, op3: ResultOperatorFunction<B, ResultError, C, ResultError>, op4: ResultOperatorFunction<C, ResultError, D, ResultError>, op5: ResultOperatorFunction<D, ResultError, E, ResultError>, op6: ResultOperatorFunction<E, ResultError, F, ResultError>, op7: ResultOperatorFunction<F, ResultError, G, ResultError>, op8: ResultOperatorFunction<G, ResultError, H, ResultError>, op9: ResultOperatorFunction<H, ResultError, I, ResultError>, op10: ResultOperatorFunction<I, ResultError, J, ResultError>, op11: ResultOperatorFunction<J, ResultError, K, ResultError>, op12: ResultOperatorFunction<K, ResultError, L, ResultError>, op13: ResultOperatorFunction<L, ResultError, M, ResultError>): Result<M, ResultError>;
    pipe<A, B, C, D, E, F, G, H, I, J, K, L, M, N>(op1: ResultOperatorFunction<Value, ResultError, A, ResultError>, op2: ResultOperatorFunction<A, ResultError, B, ResultError>, op3: ResultOperatorFunction<B, ResultError, C, ResultError>, op4: ResultOperatorFunction<C, ResultError, D, ResultError>, op5: ResultOperatorFunction<D, ResultError, E, ResultError>, op6: ResultOperatorFunction<E, ResultError, F, ResultError>, op7: ResultOperatorFunction<F, ResultError, G, ResultError>, op8: ResultOperatorFunction<G, ResultError, H, ResultError>, op9: ResultOperatorFunction<H, ResultError, I, ResultError>, op10: ResultOperatorFunction<I, ResultError, J, ResultError>, op11: ResultOperatorFunction<J, ResultError, K, ResultError>, op12: ResultOperatorFunction<K, ResultError, L, ResultError>, op13: ResultOperatorFunction<L, ResultError, M, ResultError>, op14: ResultOperatorFunction<M, ResultError, N, ResultError>): Result<N, ResultError>;
    pipe<A, B, C, D, E, F, G, H, I, J, K, L, M, N, O>(op1: ResultOperatorFunction<Value, ResultError, A, ResultError>, op2: ResultOperatorFunction<A, ResultError, B, ResultError>, op3: ResultOperatorFunction<B, ResultError, C, ResultError>, op4: ResultOperatorFunction<C, ResultError, D, ResultError>, op5: ResultOperatorFunction<D, ResultError, E, ResultError>, op6: ResultOperatorFunction<E, ResultError, F, ResultError>, op7: ResultOperatorFunction<F, ResultError, G, ResultError>, op8: ResultOperatorFunction<G, ResultError, H, ResultError>, op9: ResultOperatorFunction<H, ResultError, I, ResultError>, op10: ResultOperatorFunction<I, ResultError, J, ResultError>, op11: ResultOperatorFunction<J, ResultError, K, ResultError>, op12: ResultOperatorFunction<K, ResultError, L, ResultError>, op13: ResultOperatorFunction<L, ResultError, M, ResultError>, op14: ResultOperatorFunction<M, ResultError, N, ResultError>, op15: ResultOperatorFunction<N, ResultError, O, ResultError>): Result<O, ResultError>;
}

export class ResultImpl<Value, Err extends ResultError> implements Result<Value, Err> {
    private _value: Value;
    private _err: Err;

    private _isFailure = false;

    private constructor(v?: Value, e?: Err) {
        if (v)
            this._value = v;

        if (e) {
            this._err = e;
            this._isFailure = true;
        }
    }

    static succeed<Err extends ResultError>(): Result<any, Err>;
    static succeed<Value, Err extends ResultError>(v: Value): Result<Value, Err>;
    static succeed<Value, Err extends ResultError>(v?: Value): Result<Value, Err> {
        return new ResultImpl(v);
    }

    static fail<Value, Err extends ResultError>(e: Err): Result<Value, Err> {
        return new ResultImpl(null! as Value, e);
    }

    isSuccess = (): boolean => !this._isFailure;

    isFailure = (): boolean => this._isFailure;

    unwrap(obj: { err: (error: Err) => Value }): Value {
        if (this._isFailure) {
            return obj.err(this._err);
        }

        return this._value;
    };

    inspect(): string {
        if (this._isFailure) {
            return `Failure(${this._err.message})`;
        }

        return `Success(${this._value})`;
    }

    value(): Value {
        if (this._isFailure) {
            throw new Error('Cannot get value from Failure');
        }

        return this._value;
    }

    error(): Err | null {
        return this._err;
    }

    pipe(...fns: Array<ResultOperatorFunction<any, ResultError, any, ResultError>>): Result<any, ResultError> {
        return pipeFromArray(fns)(this);
    }
}

export class ResultError extends Error {
    constructor(name: string, message: string) {
        super();
        this.name = name;
        this.message = message;
    }
}

/** Type Guards **/
const isResult = <Value, Err extends ResultError>(result: any): result is Result<Value, Err> => {
    return result && 'type' in result && 'pipe' in result;
};

const isError = <Err extends ResultError>(error: any): error is Err => {
    return error instanceof ResultError;
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
    fn: (arg: Err) => B
) => (result: Result<Value, Err>): Result<Value, B> => {
    if (result.isFailure()) {
        return fail(fn(result.error()!)) as Result<Value, B>;
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
    fn: (arg: Value) => (Result<A, Err> | A)
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
    fn: (arg: Err) => (Result<Value, B> | B)
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

/** Constructors **/

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

type OperatorFunction<A, B> = (a: A) => B;
type ResultOperatorFunction<V, E extends ResultError, V2, E2 extends ResultError> = (a: Result<V, E>) => Result<V2, E2>;

export function identity<T>(x: T): T {
    return x;
}

export interface UnaryFunction<T, R> {
    (source: Result<T, ResultError>): Result<R, ResultError>;
}

export function pipeFromArray<T, R>(fns: Array<UnaryFunction<T, R>>): UnaryFunction<T, R> {
    if (fns.length === 0) {
        return identity as UnaryFunction<any, any>;
    }

    if (fns.length === 1) {
        return fns[0];
    }

    return function piped(input: Result<T, ResultError>): Result<R, ResultError> {
        return fns.reduce((prev: any, fn: UnaryFunction<T, R>) => fn(prev), input as any);
    };
}
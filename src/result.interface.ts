import { ResultError } from "./result.implementation";
import { ResultOperatorFunction } from "./types";

/* Result interface */

export interface Result<Value, Err extends ResultError = ResultError> {
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
    pipe<A>(op1: ResultOperatorFunction<Value, ResultError, A, ResultError>): A extends Promise<infer A$> ? Promise<Result<A$, ResultError>> : Result<A, ResultError>;
    pipe<A, B>(
        op1: ResultOperatorFunction<Value, ResultError, A, ResultError>,
        op2: ResultOperatorFunction<UnwrapPromise<A>, ResultError, B, ResultError>
    ): PipeResult<B, [A, B]>;
    pipe<A, B, C>(
        op1: ResultOperatorFunction<Value, ResultError, A, ResultError>,
        op2: ResultOperatorFunction<UnwrapPromise<A>, ResultError, B, ResultError>,
        op3: ResultOperatorFunction<UnwrapPromise<B>, ResultError, C, ResultError>
    ): PipeResult<C, [A, B, C]>;

    pipe<A, B, C, D>(
        op1: ResultOperatorFunction<Value, ResultError, A, ResultError>,
        op2: ResultOperatorFunction<UnwrapPromise<A>, ResultError, B, ResultError>,
        op3: ResultOperatorFunction<UnwrapPromise<B>, ResultError, C, ResultError>,
        op4: ResultOperatorFunction<UnwrapPromise<C>, ResultError, D, ResultError>
    ): PipeResult<D, [A, B, C, D]>;
    pipe<A, B, C, D, E>(
        op1: ResultOperatorFunction<Value, ResultError, A, ResultError>,
        op2: ResultOperatorFunction<UnwrapPromise<A>, ResultError, B, ResultError>,
        op3: ResultOperatorFunction<UnwrapPromise<B>, ResultError, C, ResultError>,
        op4: ResultOperatorFunction<UnwrapPromise<C>, ResultError, D, ResultError>,
        op5: ResultOperatorFunction<UnwrapPromise<D>, ResultError, E, ResultError>
    ): PipeResult<E, [A, B, C, D, E]>;
    pipe<A, B, C, D, E, F>(
        op1: ResultOperatorFunction<Value, ResultError, A, ResultError>,
        op2: ResultOperatorFunction<UnwrapPromise<A>, ResultError, B, ResultError>,
        op3: ResultOperatorFunction<UnwrapPromise<B>, ResultError, C, ResultError>,
        op4: ResultOperatorFunction<UnwrapPromise<C>, ResultError, D, ResultError>,
        op5: ResultOperatorFunction<UnwrapPromise<D>, ResultError, E, ResultError>,
        op6: ResultOperatorFunction<UnwrapPromise<E>, ResultError, F, ResultError>
    ): PipeResult<F, [A, B, C, D, E, F]>;
    pipe<A, B, C, D, E, F, G>(
        op1: ResultOperatorFunction<Value, ResultError, A, ResultError>,
        op2: ResultOperatorFunction<UnwrapPromise<A>, ResultError, B, ResultError>,
        op3: ResultOperatorFunction<UnwrapPromise<B>, ResultError, C, ResultError>,
        op4: ResultOperatorFunction<UnwrapPromise<C>, ResultError, D, ResultError>,
        op5: ResultOperatorFunction<UnwrapPromise<D>, ResultError, E, ResultError>,
        op6: ResultOperatorFunction<UnwrapPromise<E>, ResultError, F, ResultError>,
        op7: ResultOperatorFunction<UnwrapPromise<F>, ResultError, G, ResultError>
    ): PipeResult<G, [A, B, C, D, E, F, G]>;
    pipe<A, B, C, D, E, F, G, H>(
        op1: ResultOperatorFunction<Value, ResultError, A, ResultError>,
        op2: ResultOperatorFunction<UnwrapPromise<A>, ResultError, B, ResultError>,
        op3: ResultOperatorFunction<UnwrapPromise<B>, ResultError, C, ResultError>,
        op4: ResultOperatorFunction<UnwrapPromise<C>, ResultError, D, ResultError>,
        op5: ResultOperatorFunction<UnwrapPromise<D>, ResultError, E, ResultError>,
        op6: ResultOperatorFunction<UnwrapPromise<E>, ResultError, F, ResultError>,
        op7: ResultOperatorFunction<UnwrapPromise<F>, ResultError, G, ResultError>,
        op8: ResultOperatorFunction<UnwrapPromise<G>, ResultError, H, ResultError>
    ): PipeResult<H, [A, B, C, D, E, F, G, H]>;
    pipe<A, B, C, D, E, F, G, H, I>(
        op1: ResultOperatorFunction<Value, ResultError, A, ResultError>,
        op2: ResultOperatorFunction<UnwrapPromise<A>, ResultError, B, ResultError>,
        op3: ResultOperatorFunction<UnwrapPromise<B>, ResultError, C, ResultError>,
        op4: ResultOperatorFunction<UnwrapPromise<C>, ResultError, D, ResultError>,
        op5: ResultOperatorFunction<UnwrapPromise<D>, ResultError, E, ResultError>,
        op6: ResultOperatorFunction<UnwrapPromise<E>, ResultError, F, ResultError>,
        op7: ResultOperatorFunction<UnwrapPromise<F>, ResultError, G, ResultError>,
        op8: ResultOperatorFunction<UnwrapPromise<G>, ResultError, H, ResultError>,
        op9: ResultOperatorFunction<UnwrapPromise<H>, ResultError, I, ResultError>
    ): PipeResult<I, [A, B, C, D, E, F, G, H, I]>;
    pipe<A, B, C, D, E, F, G, H, I, J>(
        op1: ResultOperatorFunction<Value, ResultError, A, ResultError>,
        op2: ResultOperatorFunction<UnwrapPromise<A>, ResultError, B, ResultError>,
        op3: ResultOperatorFunction<UnwrapPromise<B>, ResultError, C, ResultError>,
        op4: ResultOperatorFunction<UnwrapPromise<C>, ResultError, D, ResultError>,
        op5: ResultOperatorFunction<UnwrapPromise<D>, ResultError, E, ResultError>,
        op6: ResultOperatorFunction<UnwrapPromise<E>, ResultError, F, ResultError>,
        op7: ResultOperatorFunction<UnwrapPromise<F>, ResultError, G, ResultError>,
        op8: ResultOperatorFunction<UnwrapPromise<G>, ResultError, H, ResultError>,
        op9: ResultOperatorFunction<UnwrapPromise<H>, ResultError, I, ResultError>,
        op10: ResultOperatorFunction<UnwrapPromise<I>, ResultError, J, ResultError>
    ): PipeResult<J, [A, B, C, D, E, F, G, H, I, J]>;
    pipe<A, B, C, D, E, F, G, H, I, J, K>(
        op1: ResultOperatorFunction<Value, ResultError, A, ResultError>,
        op2: ResultOperatorFunction<UnwrapPromise<A>, ResultError, B, ResultError>,
        op3: ResultOperatorFunction<UnwrapPromise<B>, ResultError, C, ResultError>,
        op4: ResultOperatorFunction<UnwrapPromise<C>, ResultError, D, ResultError>,
        op5: ResultOperatorFunction<UnwrapPromise<D>, ResultError, E, ResultError>,
        op6: ResultOperatorFunction<UnwrapPromise<E>, ResultError, F, ResultError>,
        op7: ResultOperatorFunction<UnwrapPromise<F>, ResultError, G, ResultError>,
        op8: ResultOperatorFunction<UnwrapPromise<G>, ResultError, H, ResultError>,
        op9: ResultOperatorFunction<UnwrapPromise<H>, ResultError, I, ResultError>,
        op10: ResultOperatorFunction<UnwrapPromise<I>, ResultError, J, ResultError>,
        op11: ResultOperatorFunction<UnwrapPromise<J>, ResultError, K, ResultError>
    ): PipeResult<K, [A, B, C, D, E, F, G, H, I, J, K]>;
    pipe<A, B, C, D, E, F, G, H, I, J, K, L>(
        op1: ResultOperatorFunction<Value, ResultError, A, ResultError>,
        op2: ResultOperatorFunction<UnwrapPromise<A>, ResultError, B, ResultError>,
        op3: ResultOperatorFunction<UnwrapPromise<B>, ResultError, C, ResultError>,
        op4: ResultOperatorFunction<UnwrapPromise<C>, ResultError, D, ResultError>,
        op5: ResultOperatorFunction<UnwrapPromise<D>, ResultError, E, ResultError>,
        op6: ResultOperatorFunction<UnwrapPromise<E>, ResultError, F, ResultError>,
        op7: ResultOperatorFunction<UnwrapPromise<F>, ResultError, G, ResultError>,
        op8: ResultOperatorFunction<UnwrapPromise<G>, ResultError, H, ResultError>,
        op9: ResultOperatorFunction<UnwrapPromise<H>, ResultError, I, ResultError>,
        op10: ResultOperatorFunction<UnwrapPromise<I>, ResultError, J, ResultError>,
        op11: ResultOperatorFunction<UnwrapPromise<J>, ResultError, K, ResultError>,
        op12: ResultOperatorFunction<UnwrapPromise<K>, ResultError, L, ResultError>
    ): PipeResult<L, [A, B, C, D, E, F, G, H, I, J, K, L]>;
    pipe<A, B, C, D, E, F, G, H, I, J, K, L, M>(
        op1: ResultOperatorFunction<Value, ResultError, A, ResultError>,
        op2: ResultOperatorFunction<UnwrapPromise<A>, ResultError, B, ResultError>,
        op3: ResultOperatorFunction<UnwrapPromise<B>, ResultError, C, ResultError>,
        op4: ResultOperatorFunction<UnwrapPromise<C>, ResultError, D, ResultError>,
        op5: ResultOperatorFunction<UnwrapPromise<D>, ResultError, E, ResultError>,
        op6: ResultOperatorFunction<UnwrapPromise<E>, ResultError, F, ResultError>,
        op7: ResultOperatorFunction<UnwrapPromise<F>, ResultError, G, ResultError>,
        op8: ResultOperatorFunction<UnwrapPromise<G>, ResultError, H, ResultError>,
        op9: ResultOperatorFunction<UnwrapPromise<H>, ResultError, I, ResultError>,
        op10: ResultOperatorFunction<UnwrapPromise<I>, ResultError, J, ResultError>,
        op11: ResultOperatorFunction<UnwrapPromise<J>, ResultError, K, ResultError>,
        op12: ResultOperatorFunction<UnwrapPromise<K>, ResultError, L, ResultError>,
        op13: ResultOperatorFunction<UnwrapPromise<L>, ResultError, M, ResultError>
    ): PipeResult<M, [A, B, C, D, E, F, G, H, I, J, K, L, M]>;
    pipe<A, B, C, D, E, F, G, H, I, J, K, L, M, N>(
        op1: ResultOperatorFunction<Value, ResultError, A, ResultError>,
        op2: ResultOperatorFunction<UnwrapPromise<A>, ResultError, B, ResultError>,
        op3: ResultOperatorFunction<UnwrapPromise<B>, ResultError, C, ResultError>,
        op4: ResultOperatorFunction<UnwrapPromise<C>, ResultError, D, ResultError>,
        op5: ResultOperatorFunction<UnwrapPromise<D>, ResultError, E, ResultError>,
        op6: ResultOperatorFunction<UnwrapPromise<E>, ResultError, F, ResultError>,
        op7: ResultOperatorFunction<UnwrapPromise<F>, ResultError, G, ResultError>,
        op8: ResultOperatorFunction<UnwrapPromise<G>, ResultError, H, ResultError>,
        op9: ResultOperatorFunction<UnwrapPromise<H>, ResultError, I, ResultError>,
        op10: ResultOperatorFunction<UnwrapPromise<I>, ResultError, J, ResultError>,
        op11: ResultOperatorFunction<UnwrapPromise<J>, ResultError, K, ResultError>,
        op12: ResultOperatorFunction<UnwrapPromise<K>, ResultError, L, ResultError>,
        op13: ResultOperatorFunction<UnwrapPromise<L>, ResultError, M, ResultError>,
        op14: ResultOperatorFunction<UnwrapPromise<M>, ResultError, N, ResultError>
    ): PipeResult<N, [A, B, C, D, E, F, G, H, I, J, K, L, M, N]>;
    pipe<A, B, C, D, E, F, G, H, I, J, K, L, M, N, O>(
        op1: ResultOperatorFunction<Value, ResultError, A, ResultError>,
        op2: ResultOperatorFunction<UnwrapPromise<A>, ResultError, B, ResultError>,
        op3: ResultOperatorFunction<UnwrapPromise<B>, ResultError, C, ResultError>,
        op4: ResultOperatorFunction<UnwrapPromise<C>, ResultError, D, ResultError>,
        op5: ResultOperatorFunction<UnwrapPromise<D>, ResultError, E, ResultError>,
        op6: ResultOperatorFunction<UnwrapPromise<E>, ResultError, F, ResultError>,
        op7: ResultOperatorFunction<UnwrapPromise<F>, ResultError, G, ResultError>,
        op8: ResultOperatorFunction<UnwrapPromise<G>, ResultError, H, ResultError>,
        op9: ResultOperatorFunction<UnwrapPromise<H>, ResultError, I, ResultError>,
        op10: ResultOperatorFunction<UnwrapPromise<I>, ResultError, J, ResultError>,
        op11: ResultOperatorFunction<UnwrapPromise<J>, ResultError, K, ResultError>,
        op12: ResultOperatorFunction<UnwrapPromise<K>, ResultError, L, ResultError>,
        op13: ResultOperatorFunction<UnwrapPromise<L>, ResultError, M, ResultError>,
        op14: ResultOperatorFunction<UnwrapPromise<M>, ResultError, N, ResultError>,
        op15: ResultOperatorFunction<UnwrapPromise<N>, ResultError, O, ResultError>
    ): PipeResult<O, [A, B, C, D, E, F, G, H, I, J, K, L, M, N, O]>;
}

type UnwrapPromise<T> = T extends Promise<infer U> ? U : T;
type UnwrapPromiseInResult<T> = T extends Promise<Result<infer U, ResultError>> ? U : T;

type AnyPromise<Types extends any[]> = Types extends [infer First, ...infer Rest]
    ? First extends Promise<any>
        ? true
        : AnyPromise<Rest>
    : false;

type PipeResult<Output, All extends any[]> = AnyPromise<All> extends true
    ? Promise<Result<UnwrapPromise<Output>, ResultError>>
    : Result<Output, ResultError>;
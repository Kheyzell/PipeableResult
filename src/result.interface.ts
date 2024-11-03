import { ResultError } from "./result.implementation";
import { ResultOperatorFunction } from "./types";

/* Result interface */

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
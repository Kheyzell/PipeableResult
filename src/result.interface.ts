import { AnyPromise, ErrorCaseReturns, ErrorCases, ErrorTag, MatchCases, MatchCasesReturns, MaybeAsync, ResultOperator, UnwrapPromise } from './types';

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
     * Safely get the value inside the Result by providing a matching structure for handling the error cases.
     * 
     * @example
     * const result = unsafeCalculation();
     * const value = result.unwrap({
     *   HttpResponseError: (error) => 0,
     *   NetworkError: (error) => doMoreCalculation(),
     * });
     *
     * @description
     * Can also be used to unwrap the value by providing a single handler for all errors.
     * 
     * @example
     * const result = unsafeCalculation();
     * const value = result.unwrap(error => 0);
     */
    unwrap(errorCases: ErrorCases<Err, Value>): Value;
    /**
     * Safely get the value inside the Result by providing a single handler for all errors.
     * 
     * * @example
     * const result = unsafeCalculation();
     * const value = result.unwrap(error => 0);
     */
    unwrap(errorHandler: (error: Err) => Value): Value;

    /**
     * Returns a string representation of the `Result`. If the `Result` is a `Failure`,
     * the string representation is `Failure(<error>): { <error properties> }`. If the `Result` is a `Success`,
     * the string representation is `Success(<value>)`.
     *
     * @example
     * succeed("Hello").inspect(); // "Success(Hello)"
     * defect({ [ErrorTag]: "TestError", message: "Failed process", code: 40 })
     *     .inspect(); // "Failure(TestError): { message: "Failed process", code: 40 }"
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
     * Provides a matching structure on the `Result` `Success` case
     * and all `Failure` cases (meaning all possible errors).
     * 
     * @example
     * const result: Result<number, ErrorType1 | ErrorType2> = unsafeCalculation();
     * const value = result.match({
     *     Success: (value: number) => value % 2,
     *     ErrorType1: (error: ErrorType1) => "A_VALUE",
     *     ErrorType2: (error: ErrorType2) => someOtherCalculation(error),
     * });
     * 
     * @description
     * You might want to force a specific return type,
     * in which case specify the return type you expect as follows:
     * 
     * @example
     * const result: Result<number, NetworkError | HttpResponseError> = succeed(5);
     * const value = result.match<string>({ // => enforce a string return type
     *     Success: (value: number) => (value % 2).toString(), // => forced to return a string
     *     NetworkError: (error) => "A_VALUE",
     *     HttpResponseError: (error) => someOtherCalculation(error),
     * });
     */
    match<Cases extends MatchCases<Value, Err, any>>(cases: Cases): MatchCasesReturns<Cases>;
    /**
     * Provides a matching structure on the `Result` `Success` case
     * and all `Failure` cases (meaning all possible errors).
     * Forces a specific return type on each cases specified by the generic type of the operator.
     * 
     * @example
     * const result: Result<number, NetworkError | HttpResponseError> = succeed(5);
     * const value = result.match<string>({ // => enforce a string return type
     *     Success: (value: number) => (value % 2).toString(), // => forced to return a string
     *     NetworkError: (error) => "A_VALUE",
     *     HttpResponseError: (error) => someOtherCalculation(error),
     * });
     */
    match<O>(cases: MatchCases<Value, Err, O>): O;
    
    /**
    * Provides a matching structure on all `Failure` cases
    * (meaning all possible errors).
    *
    * @example
    * const result: Result<number, ErrorType1 | ErrorType2> = unsafeCalculation();
    * const value = result.matchErrors({
    *     ErrorType1: (error: ErrorType1) => 0,
    *     ErrorType2: (error: ErrorType2) => someOtherCalculation(error),
    * });
    */
   matchErrors<Cases extends ErrorCases<Err, any>>(errorCases: Cases): Value | ErrorCaseReturns<Cases, MaybeAsync<any>>;

    /**
     * Chains multiple operations that take a `Result` and return a new `Result`. The `pipe`
     * method allows transformations to be applied sequentially on the `Result`.
     * 
     * @example
     * const result = succeed('hello');
     * result.pipe(
     *     map(x => x.toUpperCase()),
     *     tapErr(e => console.log(e))
     * );
     */
    pipe(): Result<Value, Err>;
    pipe<R1 extends AnyResultOrAsync>(
        op1: ResultOperator<Value, Err, R1>,
    ): PipeResult<
        UnwrapResultValue<R1>,
        [UnwrapResultValue<R1>, UnwrapResultError<R1>, R1],
        UnwrapResultError<R1>
    >;
    pipe<R1 extends AnyResultOrAsync, R2 extends AnyResultOrAsync>(
        op1: ResultOperator<Value, Err, R1>,
        op2: ResultOperator<UnwrapResultValue<R1>, UnwrapResultError<R1>, R2>,
    ): PipeResult<
        UnwrapResultValue<R2>,
        [UnwrapResultValue<R1>, UnwrapResultError<R1>, UnwrapResultValue<R2>, UnwrapResultError<R2>, R1, R2],
        UnwrapResultError<R2>
    >;
    pipe<R1 extends AnyResultOrAsync, R2 extends AnyResultOrAsync, R3 extends AnyResultOrAsync>(
        op1: ResultOperator<Value, Err, R1>,
        op2: ResultOperator<UnwrapResultValue<R1>, UnwrapResultError<R1>, R2>,
        op3: ResultOperator<UnwrapResultValue<R2>, UnwrapResultError<R2>, R3>,
    ): PipeResult<
        UnwrapResultValue<R3>,
        [UnwrapResultValue<R1>, UnwrapResultError<R1>, UnwrapResultValue<R2>, UnwrapResultError<R2>, UnwrapResultValue<R3>, UnwrapResultError<R3>, R1, R2, R3],
        UnwrapResultError<R3>
    >;
    pipe<R1 extends AnyResultOrAsync, R2 extends AnyResultOrAsync, R3 extends AnyResultOrAsync, R4 extends AnyResultOrAsync>(
        op1: ResultOperator<Value, Err, R1>,
        op2: ResultOperator<UnwrapResultValue<R1>, UnwrapResultError<R1>, R2>,
        op3: ResultOperator<UnwrapResultValue<R2>, UnwrapResultError<R2>, R3>,
        op4: ResultOperator<UnwrapResultValue<R3>, UnwrapResultError<R3>, R4>,
    ): PipeResult<
        UnwrapResultValue<R4>,
        [UnwrapResultValue<R1>, UnwrapResultError<R1>, UnwrapResultValue<R2>, UnwrapResultError<R2>, UnwrapResultValue<R3>, UnwrapResultError<R3>, UnwrapResultValue<R4>, UnwrapResultError<R4>, R1, R2, R3, R4],
        UnwrapResultError<R4>
    >;
    pipe<R1 extends AnyResultOrAsync, R2 extends AnyResultOrAsync, R3 extends AnyResultOrAsync, R4 extends AnyResultOrAsync, R5 extends AnyResultOrAsync>(
        op1: ResultOperator<Value, Err, R1>,
        op2: ResultOperator<UnwrapResultValue<R1>, UnwrapResultError<R1>, R2>,
        op3: ResultOperator<UnwrapResultValue<R2>, UnwrapResultError<R2>, R3>,
        op4: ResultOperator<UnwrapResultValue<R3>, UnwrapResultError<R3>, R4>,
        op5: ResultOperator<UnwrapResultValue<R4>, UnwrapResultError<R4>, R5>,
    ): PipeResult<
        UnwrapResultValue<R5>,
        [UnwrapResultValue<R1>, UnwrapResultError<R1>, UnwrapResultValue<R2>, UnwrapResultError<R2>, UnwrapResultValue<R3>, UnwrapResultError<R3>, UnwrapResultValue<R4>, UnwrapResultError<R4>, UnwrapResultValue<R5>, UnwrapResultError<R5>, R1, R2, R3, R4, R5],
        UnwrapResultError<R5>
    >;
    pipe<R1 extends AnyResultOrAsync, R2 extends AnyResultOrAsync, R3 extends AnyResultOrAsync, R4 extends AnyResultOrAsync, R5 extends AnyResultOrAsync, R6 extends AnyResultOrAsync>(
        op1: ResultOperator<Value, Err, R1>,
        op2: ResultOperator<UnwrapResultValue<R1>, UnwrapResultError<R1>, R2>,
        op3: ResultOperator<UnwrapResultValue<R2>, UnwrapResultError<R2>, R3>,
        op4: ResultOperator<UnwrapResultValue<R3>, UnwrapResultError<R3>, R4>,
        op5: ResultOperator<UnwrapResultValue<R4>, UnwrapResultError<R4>, R5>,
        op6: ResultOperator<UnwrapResultValue<R5>, UnwrapResultError<R5>, R6>,
    ): PipeResult<
        UnwrapResultValue<R6>,
        [UnwrapResultValue<R1>, UnwrapResultError<R1>, UnwrapResultValue<R2>, UnwrapResultError<R2>, UnwrapResultValue<R3>, UnwrapResultError<R3>, UnwrapResultValue<R4>, UnwrapResultError<R4>, UnwrapResultValue<R5>, UnwrapResultError<R5>, UnwrapResultValue<R6>, UnwrapResultError<R6>, R1, R2, R3, R4, R5, R6],
        UnwrapResultError<R6>
    >;
    pipe<R1 extends AnyResultOrAsync, R2 extends AnyResultOrAsync, R3 extends AnyResultOrAsync, R4 extends AnyResultOrAsync, R5 extends AnyResultOrAsync, R6 extends AnyResultOrAsync, R7 extends AnyResultOrAsync>(
        op1: ResultOperator<Value, Err, R1>,
        op2: ResultOperator<UnwrapResultValue<R1>, UnwrapResultError<R1>, R2>,
        op3: ResultOperator<UnwrapResultValue<R2>, UnwrapResultError<R2>, R3>,
        op4: ResultOperator<UnwrapResultValue<R3>, UnwrapResultError<R3>, R4>,
        op5: ResultOperator<UnwrapResultValue<R4>, UnwrapResultError<R4>, R5>,
        op6: ResultOperator<UnwrapResultValue<R5>, UnwrapResultError<R5>, R6>,
        op7: ResultOperator<UnwrapResultValue<R6>, UnwrapResultError<R6>, R7>,
    ): PipeResult<
        UnwrapResultValue<R7>,
        [UnwrapResultValue<R1>, UnwrapResultError<R1>, UnwrapResultValue<R2>, UnwrapResultError<R2>, UnwrapResultValue<R3>, UnwrapResultError<R3>, UnwrapResultValue<R4>, UnwrapResultError<R4>, UnwrapResultValue<R5>, UnwrapResultError<R5>, UnwrapResultValue<R6>, UnwrapResultError<R6>, UnwrapResultValue<R7>, UnwrapResultError<R7>, R1, R2, R3, R4, R5, R6, R7],
        UnwrapResultError<R7>
    >;
    pipe<R1 extends AnyResultOrAsync, R2 extends AnyResultOrAsync, R3 extends AnyResultOrAsync, R4 extends AnyResultOrAsync, R5 extends AnyResultOrAsync, R6 extends AnyResultOrAsync, R7 extends AnyResultOrAsync, R8 extends AnyResultOrAsync>(
        op1: ResultOperator<Value, Err, R1>,
        op2: ResultOperator<UnwrapResultValue<R1>, UnwrapResultError<R1>, R2>,
        op3: ResultOperator<UnwrapResultValue<R2>, UnwrapResultError<R2>, R3>,
        op4: ResultOperator<UnwrapResultValue<R3>, UnwrapResultError<R3>, R4>,
        op5: ResultOperator<UnwrapResultValue<R4>, UnwrapResultError<R4>, R5>,
        op6: ResultOperator<UnwrapResultValue<R5>, UnwrapResultError<R5>, R6>,
        op7: ResultOperator<UnwrapResultValue<R6>, UnwrapResultError<R6>, R7>,
        op8: ResultOperator<UnwrapResultValue<R7>, UnwrapResultError<R7>, R8>,
    ): PipeResult<
        UnwrapResultValue<R8>,
        [UnwrapResultValue<R1>, UnwrapResultError<R1>, UnwrapResultValue<R2>, UnwrapResultError<R2>, UnwrapResultValue<R3>, UnwrapResultError<R3>, UnwrapResultValue<R4>, UnwrapResultError<R4>, UnwrapResultValue<R5>, UnwrapResultError<R5>, UnwrapResultValue<R6>, UnwrapResultError<R6>, UnwrapResultValue<R7>, UnwrapResultError<R7>, UnwrapResultValue<R8>, UnwrapResultError<R8>, R1, R2, R3, R4, R5, R6, R7, R8],
        UnwrapResultError<R8>
    >;
    pipe<R1 extends AnyResultOrAsync, R2 extends AnyResultOrAsync, R3 extends AnyResultOrAsync, R4 extends AnyResultOrAsync, R5 extends AnyResultOrAsync, R6 extends AnyResultOrAsync, R7 extends AnyResultOrAsync, R8 extends AnyResultOrAsync, R9 extends AnyResultOrAsync>(
        op1: ResultOperator<Value, Err, R1>,
        op2: ResultOperator<UnwrapResultValue<R1>, UnwrapResultError<R1>, R2>,
        op3: ResultOperator<UnwrapResultValue<R2>, UnwrapResultError<R2>, R3>,
        op4: ResultOperator<UnwrapResultValue<R3>, UnwrapResultError<R3>, R4>,
        op5: ResultOperator<UnwrapResultValue<R4>, UnwrapResultError<R4>, R5>,
        op6: ResultOperator<UnwrapResultValue<R5>, UnwrapResultError<R5>, R6>,
        op7: ResultOperator<UnwrapResultValue<R6>, UnwrapResultError<R6>, R7>,
        op8: ResultOperator<UnwrapResultValue<R7>, UnwrapResultError<R7>, R8>,
        op9: ResultOperator<UnwrapResultValue<R8>, UnwrapResultError<R8>, R9>,
    ): PipeResult<
        UnwrapResultValue<R9>,
        [UnwrapResultValue<R1>, UnwrapResultError<R1>, UnwrapResultValue<R2>, UnwrapResultError<R2>, UnwrapResultValue<R3>, UnwrapResultError<R3>, UnwrapResultValue<R4>, UnwrapResultError<R4>, UnwrapResultValue<R5>, UnwrapResultError<R5>, UnwrapResultValue<R6>, UnwrapResultError<R6>, UnwrapResultValue<R7>, UnwrapResultError<R7>, UnwrapResultValue<R8>, UnwrapResultError<R8>, UnwrapResultValue<R9>, UnwrapResultError<R9>, R1, R2, R3, R4, R5, R6, R7, R8, R9],
        UnwrapResultError<R9>
    >;
    pipe<R1 extends AnyResultOrAsync, R2 extends AnyResultOrAsync, R3 extends AnyResultOrAsync, R4 extends AnyResultOrAsync, R5 extends AnyResultOrAsync, R6 extends AnyResultOrAsync, R7 extends AnyResultOrAsync, R8 extends AnyResultOrAsync, R9 extends AnyResultOrAsync, R10 extends AnyResultOrAsync>(
        op1: ResultOperator<Value, Err, R1>,
        op2: ResultOperator<UnwrapResultValue<R1>, UnwrapResultError<R1>, R2>,
        op3: ResultOperator<UnwrapResultValue<R2>, UnwrapResultError<R2>, R3>,
        op4: ResultOperator<UnwrapResultValue<R3>, UnwrapResultError<R3>, R4>,
        op5: ResultOperator<UnwrapResultValue<R4>, UnwrapResultError<R4>, R5>,
        op6: ResultOperator<UnwrapResultValue<R5>, UnwrapResultError<R5>, R6>,
        op7: ResultOperator<UnwrapResultValue<R6>, UnwrapResultError<R6>, R7>,
        op8: ResultOperator<UnwrapResultValue<R7>, UnwrapResultError<R7>, R8>,
        op9: ResultOperator<UnwrapResultValue<R8>, UnwrapResultError<R8>, R9>,
        op10: ResultOperator<UnwrapResultValue<R9>, UnwrapResultError<R9>, R10>,
    ): PipeResult<
        UnwrapResultValue<R10>,
        [UnwrapResultValue<R1>, UnwrapResultError<R1>, UnwrapResultValue<R2>, UnwrapResultError<R2>, UnwrapResultValue<R3>, UnwrapResultError<R3>, UnwrapResultValue<R4>, UnwrapResultError<R4>, UnwrapResultValue<R5>, UnwrapResultError<R5>, UnwrapResultValue<R6>, UnwrapResultError<R6>, UnwrapResultValue<R7>, UnwrapResultError<R7>, UnwrapResultValue<R8>, UnwrapResultError<R8>, UnwrapResultValue<R9>, UnwrapResultError<R9>, UnwrapResultValue<R10>, UnwrapResultError<R10>, R1, R2, R3, R4, R5, R6, R7, R8, R9, R10],
        UnwrapResultError<R10>
    >;
    pipe<R1 extends AnyResultOrAsync, R2 extends AnyResultOrAsync, R3 extends AnyResultOrAsync, R4 extends AnyResultOrAsync, R5 extends AnyResultOrAsync, R6 extends AnyResultOrAsync, R7 extends AnyResultOrAsync, R8 extends AnyResultOrAsync, R9 extends AnyResultOrAsync, R10 extends AnyResultOrAsync, R11 extends AnyResultOrAsync>(
        op1: ResultOperator<Value, Err, R1>,
        op2: ResultOperator<UnwrapResultValue<R1>, UnwrapResultError<R1>, R2>,
        op3: ResultOperator<UnwrapResultValue<R2>, UnwrapResultError<R2>, R3>,
        op4: ResultOperator<UnwrapResultValue<R3>, UnwrapResultError<R3>, R4>,
        op5: ResultOperator<UnwrapResultValue<R4>, UnwrapResultError<R4>, R5>,
        op6: ResultOperator<UnwrapResultValue<R5>, UnwrapResultError<R5>, R6>,
        op7: ResultOperator<UnwrapResultValue<R6>, UnwrapResultError<R6>, R7>,
        op8: ResultOperator<UnwrapResultValue<R7>, UnwrapResultError<R7>, R8>,
        op9: ResultOperator<UnwrapResultValue<R8>, UnwrapResultError<R8>, R9>,
        op10: ResultOperator<UnwrapResultValue<R9>, UnwrapResultError<R9>, R10>,
        op11: ResultOperator<UnwrapResultValue<R10>, UnwrapResultError<R10>, R11>,
    ): PipeResult<
        UnwrapResultValue<R11>,
        [UnwrapResultValue<R1>, UnwrapResultError<R1>, UnwrapResultValue<R2>, UnwrapResultError<R2>, UnwrapResultValue<R3>, UnwrapResultError<R3>, UnwrapResultValue<R4>, UnwrapResultError<R4>, UnwrapResultValue<R5>, UnwrapResultError<R5>, UnwrapResultValue<R6>, UnwrapResultError<R6>, UnwrapResultValue<R7>, UnwrapResultError<R7>, UnwrapResultValue<R8>, UnwrapResultError<R8>, UnwrapResultValue<R9>, UnwrapResultError<R9>, UnwrapResultValue<R10>, UnwrapResultError<R10>, UnwrapResultValue<R11>, UnwrapResultError<R11>, R1, R2, R3, R4, R5, R6, R7, R8, R9, R10, R11],
        UnwrapResultError<R11>
    >;
    pipe<R1 extends AnyResultOrAsync, R2 extends AnyResultOrAsync, R3 extends AnyResultOrAsync, R4 extends AnyResultOrAsync, R5 extends AnyResultOrAsync, R6 extends AnyResultOrAsync, R7 extends AnyResultOrAsync, R8 extends AnyResultOrAsync, R9 extends AnyResultOrAsync, R10 extends AnyResultOrAsync, R11 extends AnyResultOrAsync, R12 extends AnyResultOrAsync>(
        op1: ResultOperator<Value, Err, R1>,
        op2: ResultOperator<UnwrapResultValue<R1>, UnwrapResultError<R1>, R2>,
        op3: ResultOperator<UnwrapResultValue<R2>, UnwrapResultError<R2>, R3>,
        op4: ResultOperator<UnwrapResultValue<R3>, UnwrapResultError<R3>, R4>,
        op5: ResultOperator<UnwrapResultValue<R4>, UnwrapResultError<R4>, R5>,
        op6: ResultOperator<UnwrapResultValue<R5>, UnwrapResultError<R5>, R6>,
        op7: ResultOperator<UnwrapResultValue<R6>, UnwrapResultError<R6>, R7>,
        op8: ResultOperator<UnwrapResultValue<R7>, UnwrapResultError<R7>, R8>,
        op9: ResultOperator<UnwrapResultValue<R8>, UnwrapResultError<R8>, R9>,
        op10: ResultOperator<UnwrapResultValue<R9>, UnwrapResultError<R9>, R10>,
        op11: ResultOperator<UnwrapResultValue<R10>, UnwrapResultError<R10>, R11>,
        op12: ResultOperator<UnwrapResultValue<R11>, UnwrapResultError<R11>, R12>,
    ): PipeResult<
        UnwrapResultValue<R12>,
        [UnwrapResultValue<R1>, UnwrapResultError<R1>, UnwrapResultValue<R2>, UnwrapResultError<R2>, UnwrapResultValue<R3>, UnwrapResultError<R3>, UnwrapResultValue<R4>, UnwrapResultError<R4>, UnwrapResultValue<R5>, UnwrapResultError<R5>, UnwrapResultValue<R6>, UnwrapResultError<R6>, UnwrapResultValue<R7>, UnwrapResultError<R7>, UnwrapResultValue<R8>, UnwrapResultError<R8>, UnwrapResultValue<R9>, UnwrapResultError<R9>, UnwrapResultValue<R10>, UnwrapResultError<R10>, UnwrapResultValue<R11>, UnwrapResultError<R11>, UnwrapResultValue<R12>, UnwrapResultError<R12>, R1, R2, R3, R4, R5, R6, R7, R8, R9, R10, R11, R12],
        UnwrapResultError<R12>
    >;
    pipe<R1 extends AnyResultOrAsync, R2 extends AnyResultOrAsync, R3 extends AnyResultOrAsync, R4 extends AnyResultOrAsync, R5 extends AnyResultOrAsync, R6 extends AnyResultOrAsync, R7 extends AnyResultOrAsync, R8 extends AnyResultOrAsync, R9 extends AnyResultOrAsync, R10 extends AnyResultOrAsync, R11 extends AnyResultOrAsync, R12 extends AnyResultOrAsync, R13 extends AnyResultOrAsync>(
        op1: ResultOperator<Value, Err, R1>,
        op2: ResultOperator<UnwrapResultValue<R1>, UnwrapResultError<R1>, R2>,
        op3: ResultOperator<UnwrapResultValue<R2>, UnwrapResultError<R2>, R3>,
        op4: ResultOperator<UnwrapResultValue<R3>, UnwrapResultError<R3>, R4>,
        op5: ResultOperator<UnwrapResultValue<R4>, UnwrapResultError<R4>, R5>,
        op6: ResultOperator<UnwrapResultValue<R5>, UnwrapResultError<R5>, R6>,
        op7: ResultOperator<UnwrapResultValue<R6>, UnwrapResultError<R6>, R7>,
        op8: ResultOperator<UnwrapResultValue<R7>, UnwrapResultError<R7>, R8>,
        op9: ResultOperator<UnwrapResultValue<R8>, UnwrapResultError<R8>, R9>,
        op10: ResultOperator<UnwrapResultValue<R9>, UnwrapResultError<R9>, R10>,
        op11: ResultOperator<UnwrapResultValue<R10>, UnwrapResultError<R10>, R11>,
        op12: ResultOperator<UnwrapResultValue<R11>, UnwrapResultError<R11>, R12>,
        op13: ResultOperator<UnwrapResultValue<R12>, UnwrapResultError<R12>, R13>,
    ): PipeResult<
        UnwrapResultValue<R13>,
        [UnwrapResultValue<R1>, UnwrapResultError<R1>, UnwrapResultValue<R2>, UnwrapResultError<R2>, UnwrapResultValue<R3>, UnwrapResultError<R3>, UnwrapResultValue<R4>, UnwrapResultError<R4>, UnwrapResultValue<R5>, UnwrapResultError<R5>, UnwrapResultValue<R6>, UnwrapResultError<R6>, UnwrapResultValue<R7>, UnwrapResultError<R7>, UnwrapResultValue<R8>, UnwrapResultError<R8>, UnwrapResultValue<R9>, UnwrapResultError<R9>, UnwrapResultValue<R10>, UnwrapResultError<R10>, UnwrapResultValue<R11>, UnwrapResultError<R11>, UnwrapResultValue<R12>, UnwrapResultError<R12>, UnwrapResultValue<R13>, UnwrapResultError<R13>, R1, R2, R3, R4, R5, R6, R7, R8, R9, R10, R11, R12, R13],
        UnwrapResultError<R13>
    >;
    pipe<R1 extends AnyResultOrAsync, R2 extends AnyResultOrAsync, R3 extends AnyResultOrAsync, R4 extends AnyResultOrAsync, R5 extends AnyResultOrAsync, R6 extends AnyResultOrAsync, R7 extends AnyResultOrAsync, R8 extends AnyResultOrAsync, R9 extends AnyResultOrAsync, R10 extends AnyResultOrAsync, R11 extends AnyResultOrAsync, R12 extends AnyResultOrAsync, R13 extends AnyResultOrAsync, R14 extends AnyResultOrAsync>(
        op1: ResultOperator<Value, Err, R1>,
        op2: ResultOperator<UnwrapResultValue<R1>, UnwrapResultError<R1>, R2>,
        op3: ResultOperator<UnwrapResultValue<R2>, UnwrapResultError<R2>, R3>,
        op4: ResultOperator<UnwrapResultValue<R3>, UnwrapResultError<R3>, R4>,
        op5: ResultOperator<UnwrapResultValue<R4>, UnwrapResultError<R4>, R5>,
        op6: ResultOperator<UnwrapResultValue<R5>, UnwrapResultError<R5>, R6>,
        op7: ResultOperator<UnwrapResultValue<R6>, UnwrapResultError<R6>, R7>,
        op8: ResultOperator<UnwrapResultValue<R7>, UnwrapResultError<R7>, R8>,
        op9: ResultOperator<UnwrapResultValue<R8>, UnwrapResultError<R8>, R9>,
        op10: ResultOperator<UnwrapResultValue<R9>, UnwrapResultError<R9>, R10>,
        op11: ResultOperator<UnwrapResultValue<R10>, UnwrapResultError<R10>, R11>,
        op12: ResultOperator<UnwrapResultValue<R11>, UnwrapResultError<R11>, R12>,
        op13: ResultOperator<UnwrapResultValue<R12>, UnwrapResultError<R12>, R13>,
        op14: ResultOperator<UnwrapResultValue<R13>, UnwrapResultError<R13>, R14>,
    ): PipeResult<
        UnwrapResultValue<R14>,
        [UnwrapResultValue<R1>, UnwrapResultError<R1>, UnwrapResultValue<R2>, UnwrapResultError<R2>, UnwrapResultValue<R3>, UnwrapResultError<R3>, UnwrapResultValue<R4>, UnwrapResultError<R4>, UnwrapResultValue<R5>, UnwrapResultError<R5>, UnwrapResultValue<R6>, UnwrapResultError<R6>, UnwrapResultValue<R7>, UnwrapResultError<R7>, UnwrapResultValue<R8>, UnwrapResultError<R8>, UnwrapResultValue<R9>, UnwrapResultError<R9>, UnwrapResultValue<R10>, UnwrapResultError<R10>, UnwrapResultValue<R11>, UnwrapResultError<R11>, UnwrapResultValue<R12>, UnwrapResultError<R12>, UnwrapResultValue<R13>, UnwrapResultError<R13>, UnwrapResultValue<R14>, UnwrapResultError<R14>, R1, R2, R3, R4, R5, R6, R7, R8, R9, R10, R11, R12, R13, R14],
        UnwrapResultError<R14>
    >;
    pipe<R1 extends AnyResultOrAsync, R2 extends AnyResultOrAsync, R3 extends AnyResultOrAsync, R4 extends AnyResultOrAsync, R5 extends AnyResultOrAsync, R6 extends AnyResultOrAsync, R7 extends AnyResultOrAsync, R8 extends AnyResultOrAsync, R9 extends AnyResultOrAsync, R10 extends AnyResultOrAsync, R11 extends AnyResultOrAsync, R12 extends AnyResultOrAsync, R13 extends AnyResultOrAsync, R14 extends AnyResultOrAsync, R15 extends AnyResultOrAsync>(
        op1: ResultOperator<Value, Err, R1>,
        op2: ResultOperator<UnwrapResultValue<R1>, UnwrapResultError<R1>, R2>,
        op3: ResultOperator<UnwrapResultValue<R2>, UnwrapResultError<R2>, R3>,
        op4: ResultOperator<UnwrapResultValue<R3>, UnwrapResultError<R3>, R4>,
        op5: ResultOperator<UnwrapResultValue<R4>, UnwrapResultError<R4>, R5>,
        op6: ResultOperator<UnwrapResultValue<R5>, UnwrapResultError<R5>, R6>,
        op7: ResultOperator<UnwrapResultValue<R6>, UnwrapResultError<R6>, R7>,
        op8: ResultOperator<UnwrapResultValue<R7>, UnwrapResultError<R7>, R8>,
        op9: ResultOperator<UnwrapResultValue<R8>, UnwrapResultError<R8>, R9>,
        op10: ResultOperator<UnwrapResultValue<R9>, UnwrapResultError<R9>, R10>,
        op11: ResultOperator<UnwrapResultValue<R10>, UnwrapResultError<R10>, R11>,
        op12: ResultOperator<UnwrapResultValue<R11>, UnwrapResultError<R11>, R12>,
        op13: ResultOperator<UnwrapResultValue<R12>, UnwrapResultError<R12>, R13>,
        op14: ResultOperator<UnwrapResultValue<R13>, UnwrapResultError<R13>, R14>,
        op15: ResultOperator<UnwrapResultValue<R14>, UnwrapResultError<R14>, R15>,
    ): PipeResult<
        UnwrapResultValue<R15>,
        [UnwrapResultValue<R1>, UnwrapResultError<R1>, UnwrapResultValue<R2>, UnwrapResultError<R2>, UnwrapResultValue<R3>, UnwrapResultError<R3>, UnwrapResultValue<R4>, UnwrapResultError<R4>, UnwrapResultValue<R5>, UnwrapResultError<R5>, UnwrapResultValue<R6>, UnwrapResultError<R6>, UnwrapResultValue<R7>, UnwrapResultError<R7>, UnwrapResultValue<R8>, UnwrapResultError<R8>, UnwrapResultValue<R9>, UnwrapResultError<R9>, UnwrapResultValue<R10>, UnwrapResultError<R10>, UnwrapResultValue<R11>, UnwrapResultError<R11>, UnwrapResultValue<R12>, UnwrapResultError<R12>, UnwrapResultValue<R13>, UnwrapResultError<R13>, UnwrapResultValue<R14>, UnwrapResultError<R14>, UnwrapResultValue<R15>, UnwrapResultError<R15>, R1, R2, R3, R4, R5, R6, R7, R8, R9, R10, R11, R12, R13, R14, R15],
        UnwrapResultError<R15>
    >;
    pipe<R1 extends AnyResultOrAsync, R2 extends AnyResultOrAsync, R3 extends AnyResultOrAsync, R4 extends AnyResultOrAsync, R5 extends AnyResultOrAsync, R6 extends AnyResultOrAsync, R7 extends AnyResultOrAsync, R8 extends AnyResultOrAsync, R9 extends AnyResultOrAsync, R10 extends AnyResultOrAsync, R11 extends AnyResultOrAsync, R12 extends AnyResultOrAsync, R13 extends AnyResultOrAsync, R14 extends AnyResultOrAsync, R15 extends AnyResultOrAsync, R16 extends AnyResultOrAsync>(
        op1: ResultOperator<Value, Err, R1>,
        op2: ResultOperator<UnwrapResultValue<R1>, UnwrapResultError<R1>, R2>,
        op3: ResultOperator<UnwrapResultValue<R2>, UnwrapResultError<R2>, R3>,
        op4: ResultOperator<UnwrapResultValue<R3>, UnwrapResultError<R3>, R4>,
        op5: ResultOperator<UnwrapResultValue<R4>, UnwrapResultError<R4>, R5>,
        op6: ResultOperator<UnwrapResultValue<R5>, UnwrapResultError<R5>, R6>,
        op7: ResultOperator<UnwrapResultValue<R6>, UnwrapResultError<R6>, R7>,
        op8: ResultOperator<UnwrapResultValue<R7>, UnwrapResultError<R7>, R8>,
        op9: ResultOperator<UnwrapResultValue<R8>, UnwrapResultError<R8>, R9>,
        op10: ResultOperator<UnwrapResultValue<R9>, UnwrapResultError<R9>, R10>,
        op11: ResultOperator<UnwrapResultValue<R10>, UnwrapResultError<R10>, R11>,
        op12: ResultOperator<UnwrapResultValue<R11>, UnwrapResultError<R11>, R12>,
        op13: ResultOperator<UnwrapResultValue<R12>, UnwrapResultError<R12>, R13>,
        op14: ResultOperator<UnwrapResultValue<R13>, UnwrapResultError<R13>, R14>,
        op15: ResultOperator<UnwrapResultValue<R14>, UnwrapResultError<R14>, R15>,
        op16: ResultOperator<UnwrapResultValue<R15>, UnwrapResultError<R15>, R16>,
    ): PipeResult<
        UnwrapResultValue<R16>,
        [UnwrapResultValue<R1>, UnwrapResultError<R1>, UnwrapResultValue<R2>, UnwrapResultError<R2>, UnwrapResultValue<R3>, UnwrapResultError<R3>, UnwrapResultValue<R4>, UnwrapResultError<R4>, UnwrapResultValue<R5>, UnwrapResultError<R5>, UnwrapResultValue<R6>, UnwrapResultError<R6>, UnwrapResultValue<R7>, UnwrapResultError<R7>, UnwrapResultValue<R8>, UnwrapResultError<R8>, UnwrapResultValue<R9>, UnwrapResultError<R9>, UnwrapResultValue<R10>, UnwrapResultError<R10>, UnwrapResultValue<R11>, UnwrapResultError<R11>, UnwrapResultValue<R12>, UnwrapResultError<R12>, UnwrapResultValue<R13>, UnwrapResultError<R13>, UnwrapResultValue<R14>, UnwrapResultError<R14>, UnwrapResultValue<R15>, UnwrapResultError<R15>, UnwrapResultValue<R16>, UnwrapResultError<R16>, R1, R2, R3, R4, R5, R6, R7, R8, R9, R10, R11, R12, R13, R14, R15, R16],
        UnwrapResultError<R16>
    >;
}

export interface ResultError {
    readonly [ErrorTag]: string;
    [key: string]: any;
}

export type PipeResult<OutputValue, AllOutputs extends any[], OutputErr extends ResultError> = AnyPromise<AllOutputs> extends true
    ? Promise<Result<UnwrapPromise<OutputValue>, OutputErr>>
    : Result<OutputValue, OutputErr>;

export type ResultAsync<Value, Err extends ResultError> = Promise<Result<Value, Err>>
export type ResultOrAsync<Value, Err extends ResultError> = Result<Value, Err> | ResultAsync<Value, Err>

export type AnyResultOrAsync = ResultOrAsync<any, ResultError>;

export type UnwrapResultValue<T extends AnyResultOrAsync> = 
    T extends ResultOrAsync<infer V, ResultError> ? V : never;

export type UnwrapResultError<T extends AnyResultOrAsync> = 
    T extends ResultOrAsync<any, infer E> ? E : never;
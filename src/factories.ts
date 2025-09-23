import { MaybeAsync } from '../out/src/types';
import { PipeFactoryResult1, PipeFactoryResult2 } from './factories.types';
import { map, tap } from './operators';
import { ResultImpl } from './result.implementation';
import {
    AnyResultOrAsync,
    PipeResult,
    Result,
    ResultAsync,
    ResultError,
    ResultOrAsync,
    UnwrapResultError,
    UnwrapResultValue,
} from './result.interface';
import { ErrorTag, ResultOperator } from './types';

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
export function defect<Err extends ResultError = never, Value = never>(
    error: Err,
): Result<Value, Err> {
    return ResultImpl.defect(error);
}

/** Error type created when a `safe` method catches an exception and no error handler is provided. */
export type UnknownError = { [ErrorTag]: 'UnknownError'; error: unknown };

/**
 * Used to safely wrap up an exception and turn it into a `ResultError`.
 * Creates a `Result` containing the value returned by the provided function or a error if the function throws.
 *
 * @example
 * const result = safe(() => 8); // Returns a `Success` with value 8
 * const result = safe(() => 8/0); // Returns a `Failure` with a `UnknownError`
 * const result = safe<DivisionByZeroError>(() => 8/0, { [ErrorTag]: "DivisionByZeroError" }); // Returns a `Failure` with a `DivisionByZeroError`
 * const result = safe<DivisionByZeroError>(() => 8/0, (ex) => ({ [ErrorTag]: "DivisionByZeroError", ex })); // Returns a `Failure` with a `DivisionByZeroError`
 * const result = await safe<DivisionByZeroError>(() => Promise.resolve(8/0)); // Returns a `ResultAsync<number, DivisionByZeroError>`
 */
export function safe<Value, Err extends ResultError>(
    fn: () => Promise<Value>,
    error: Err,
): ResultAsync<Value, Err>;
export function safe<Value, Err extends ResultError>(
    fn: () => Value,
    error: Err,
): Result<Value, Err>;
export function safe<Value, Err extends ResultError>(
    fn: () => Promise<Value>,
    errorHandler: (ex: unknown) => Err,
): ResultAsync<Value, Err>;
export function safe<Value, Err extends ResultError>(
    fn: () => Value,
    errorHandler: (ex: unknown) => Err,
): Result<Value, Err>;
export function safe<Value>(fn: () => Promise<Value>): ResultAsync<Value, UnknownError>;
export function safe<Value>(fn: () => Value): Result<Value, UnknownError>;
export function safe<Err extends ResultError, Value>(
    fn: () => MaybeAsync<Value>,
    errorHandler?: ((ex: unknown) => Err) | Err,
): ResultOrAsync<Value, ResultError> {
    try {
        const value = fn();
        if (value instanceof Promise) {
            return value
                .then((value) => succeed(value))
                .catch((ex) => {
                    return handleExceptionDuringSafe(ex, errorHandler);
                });
        }

        return succeed(value);
    } catch (ex) {
        return handleExceptionDuringSafe(ex, errorHandler);
    }
}

function handleExceptionDuringSafe(
    ex: unknown,
    errorHandler?: ((ex: unknown) => ResultError) | ResultError,
) {
    if (!errorHandler) {
        return defect({ [ErrorTag]: 'UnknownError', error: ex });
    }

    if (typeof errorHandler === 'function') {
        const errorFactory = errorHandler;
        return defect(errorFactory(ex));
    }

    const error = errorHandler;
    return defect(error);
}

export function pipe<
    R0 extends AnyResultOrAsync,
    R1 extends AnyResultOrAsync,
    R2 extends AnyResultOrAsync,
>(
    op1: ResultOperator<UnwrapResultValue<R0>, UnwrapResultError<R0>, R1>,
    op2: ResultOperator<UnwrapResultValue<R1>, UnwrapResultError<R1>, R2>,
): PipeResult<
    UnwrapResultValue<R2>,
    [
        UnwrapResultValue<R1>,
        UnwrapResultError<R1>,
        UnwrapResultValue<R2>,
        UnwrapResultError<R2>,
        R1,
        R2,
    ],
    UnwrapResultError<R2>
>;
export function pipe<
    R0 extends AnyResultOrAsync,
    R1 extends AnyResultOrAsync,
    R2 extends AnyResultOrAsync,
    R3 extends AnyResultOrAsync,
    R4 extends AnyResultOrAsync,
    R5 extends AnyResultOrAsync,
    R6 extends AnyResultOrAsync,
    R7 extends AnyResultOrAsync,
    R8 extends AnyResultOrAsync,
    R9 extends AnyResultOrAsync,
    R10 extends AnyResultOrAsync,
    R11 extends AnyResultOrAsync,
    R12 extends AnyResultOrAsync,
    R13 extends AnyResultOrAsync,
    R14 extends AnyResultOrAsync,
    R15 extends AnyResultOrAsync,
    R16 extends AnyResultOrAsync,
>(
    op1: ResultOperator<UnwrapResultValue<R0>, UnwrapResultError<R0>, R1>,
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
    [
        UnwrapResultValue<R1>,
        UnwrapResultError<R1>,
        UnwrapResultValue<R2>,
        UnwrapResultError<R2>,
        UnwrapResultValue<R3>,
        UnwrapResultError<R3>,
        UnwrapResultValue<R4>,
        UnwrapResultError<R4>,
        UnwrapResultValue<R5>,
        UnwrapResultError<R5>,
        UnwrapResultValue<R6>,
        UnwrapResultError<R6>,
        UnwrapResultValue<R7>,
        UnwrapResultError<R7>,
        UnwrapResultValue<R8>,
        UnwrapResultError<R8>,
        UnwrapResultValue<R9>,
        UnwrapResultError<R9>,
        UnwrapResultValue<R10>,
        UnwrapResultError<R10>,
        UnwrapResultValue<R11>,
        UnwrapResultError<R11>,
        UnwrapResultValue<R12>,
        UnwrapResultError<R12>,
        UnwrapResultValue<R13>,
        UnwrapResultError<R13>,
        UnwrapResultValue<R14>,
        UnwrapResultError<R14>,
        UnwrapResultValue<R15>,
        UnwrapResultError<R15>,
        UnwrapResultValue<R16>,
        UnwrapResultError<R16>,
        R1,
        R2,
        R3,
        R4,
        R5,
        R6,
        R7,
        R8,
        R9,
        R10,
        R11,
        R12,
        R13,
        R14,
        R15,
        R16,
    ],
    UnwrapResultError<R16>
>;
export function pipe<R0 extends Result<any, ResultError>>(
    ...operators: ResultOperator<UnwrapResultValue<R0>, UnwrapResultError<R0>, AnyResultOrAsync>[]
) {
    return (result: R0) => {
        const operatorTuple = [operators[0]] as const;
        return result.pipe(...operatorTuple);
    };
    // return pipeFromArray(operators)(this as Result<Value, Err>);
}


export function createPipe<R0 extends Result<any, ResultError>, R1 extends AnyResultOrAsync>(
    op1: ResultOperator<UnwrapResultValue<R0>, UnwrapResultError<R0>, R1>,
): PipeFactoryResult1<R0, R1>;
export function createPipe<
    Value,
    Err extends ResultError,
    R1 extends AnyResultOrAsync,
    R2 extends AnyResultOrAsync,
>(
    op1: ResultOperator<Value, Err, R1>,
    op2: ResultOperator<UnwrapResultValue<R1>, UnwrapResultError<R1>, R2>,
): PipeFactoryResult2<Result<Value, Err>, R1, R2>;
export function createPipe(...args: ResultOperator<any, ResultError, Result<any, ResultError>>[]) {
    return (result: Result<any, ResultError>) => result.pipe(...[args[0], args[1], args[2]]);
}

const processor = (val: number) =>
    createPipe<number, ResultError, Result<string, ResultError>, Result<string, ResultError>>(
        map((x) => x.toString()),
        map((x) => x + val),
    );

const result = succeed(5);
const processed = result.pipe(processor(5));




export function createPipe2<
    Value,
    Err extends ResultError
>() {
    // This outer function captures Value and Err.
    // It returns another function that will infer the rest.

    function pipe<
        R1 extends AnyResultOrAsync,
        R2 extends AnyResultOrAsync,
    >(
        op1: ResultOperator<Value, Err, R1>,
        op2: ResultOperator<UnwrapResultValue<R1>, UnwrapResultError<R1>, R2>,
    ): PipeFactoryResult2<Result<Value, Err>, R1, R2>;
    function pipe(...operators: ResultOperator<any, any, any>[]) {
        return (initialResult: Result<Value, Err>) => {
            // This is a simplified representation of a pipe's execution logic
            let resultPromise = Promise.resolve(initialResult);
            for (const op of operators) {
                resultPromise = resultPromise.then(res => {
                    if (res.error) return res;
                    return op(res.value);
                });
            }
            return resultPromise;
        };
    }

    return pipe;
}

export function compose<Value, Err extends ResultError>(op: ResultOperator<Value, Err, Result<any, ResultError>>) {
    return (result: Result<Value, Err>) => result.pipe(op);
}

const processNumbers = () => <E extends ResultError>(result: Result<number, E>) => result.pipe(
    map(x => x * 2),
    map(x => x % 3),
    map(x => x + 1),
    tap(x => console.log(x)),
)

const rrr = succeed(7);
rrr.pipe(processNumbers())
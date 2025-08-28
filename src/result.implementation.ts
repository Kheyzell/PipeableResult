import { defect, succeed } from './factories';
import {
    AnyResultOrAsync,
    PipeResult,
    Result,
    ResultError,
    ResultOrAsync,
    UnwrapResultError,
    UnwrapResultValue,
} from './result.interface';
import { isError } from './type-guards';
import {
    ErrorCaseReturns,
    ErrorCases,
    ErrorTag,
    MatchCases,
    MatchCasesReturns,
    MaybeAsync,
    ResultOperator,
} from './types';

/* Result implementation */

export class ResultImpl<Value, Err extends ResultError> implements Result<Value, Err> {
    private _value: Value = null!;
    private _err: Err | null = null;

    private _isFailure = false;

    private constructor(v?: Value, e?: Err) {
        if (v) this._value = v;

        if (e) {
            this._err = e;
            this._isFailure = true;
        }
    }

    static succeed(): Result<void, never>;
    static succeed<Value>(v: Value): Result<Value, never>;
    static succeed<Value>(v?: Value): Result<Value, never> {
        return new ResultImpl(v);
    }

    static defect<Err extends ResultError, Value = void>(e: Err): Result<Value, Err> {
        return new ResultImpl(null as any, e);
    }

    isSuccess = (): boolean => !this._isFailure;

    isFailure = (): boolean => this._isFailure;

    unwrap(handler: ErrorCases<Err, Value> | ((error: Err) => Value)): Value {
        if (!this._isFailure) {
            return this._value;
        }

        if (typeof handler === 'function') {
            return handler(this._err!);
        }

        return handleErrorCase(this._err!, handler);
    }

    inspect(): string {
        if (this._isFailure) {
            const values = Object.entries(this._err!).map(
                ([key, value]) => `${key}: ${JSON.stringify(value)}`,
            );

            return `Failure(${this._err![ErrorTag]}): { ${values.join(', ')} }`;
        }

        return `Success(${JSON.stringify(this._value)})`;
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

    match<Cases extends MatchCases<Value, Err, any>>(cases: Cases): MatchCasesReturns<Cases> {
        if (this.isSuccess()) {
            return cases.Success(this.value());
        }

        const error = this.error()!;
        return handleErrorCase(error, cases);
    }

    matchErrors<Cases extends ErrorCases<Err, any>>(
        errorCases: Cases,
    ): Value | ErrorCaseReturns<Cases, MaybeAsync<any>> {
        if (this.isSuccess()) {
            return this.value();
        }

        const error = this.error()!;
        return handleErrorCase(error, errorCases);
    }

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
    pipe<R1 extends AnyResultOrAsync, R2 extends AnyResultOrAsync, R3 extends AnyResultOrAsync>(
        op1: ResultOperator<Value, Err, R1>,
        op2: ResultOperator<UnwrapResultValue<R1>, UnwrapResultError<R1>, R2>,
        op3: ResultOperator<UnwrapResultValue<R2>, UnwrapResultError<R2>, R3>,
    ): PipeResult<
        UnwrapResultValue<R3>,
        [
            UnwrapResultValue<R1>,
            UnwrapResultError<R1>,
            UnwrapResultValue<R2>,
            UnwrapResultError<R2>,
            UnwrapResultValue<R3>,
            UnwrapResultError<R3>,
            R1,
            R2,
            R3,
        ],
        UnwrapResultError<R3>
    >;
    pipe<
        R1 extends AnyResultOrAsync,
        R2 extends AnyResultOrAsync,
        R3 extends AnyResultOrAsync,
        R4 extends AnyResultOrAsync,
    >(
        op1: ResultOperator<Value, Err, R1>,
        op2: ResultOperator<UnwrapResultValue<R1>, UnwrapResultError<R1>, R2>,
        op3: ResultOperator<UnwrapResultValue<R2>, UnwrapResultError<R2>, R3>,
        op4: ResultOperator<UnwrapResultValue<R3>, UnwrapResultError<R3>, R4>,
    ): PipeResult<
        UnwrapResultValue<R4>,
        [
            UnwrapResultValue<R1>,
            UnwrapResultError<R1>,
            UnwrapResultValue<R2>,
            UnwrapResultError<R2>,
            UnwrapResultValue<R3>,
            UnwrapResultError<R3>,
            UnwrapResultValue<R4>,
            UnwrapResultError<R4>,
            R1,
            R2,
            R3,
            R4,
        ],
        UnwrapResultError<R4>
    >;
    pipe<
        R1 extends AnyResultOrAsync,
        R2 extends AnyResultOrAsync,
        R3 extends AnyResultOrAsync,
        R4 extends AnyResultOrAsync,
        R5 extends AnyResultOrAsync,
    >(
        op1: ResultOperator<Value, Err, R1>,
        op2: ResultOperator<UnwrapResultValue<R1>, UnwrapResultError<R1>, R2>,
        op3: ResultOperator<UnwrapResultValue<R2>, UnwrapResultError<R2>, R3>,
        op4: ResultOperator<UnwrapResultValue<R3>, UnwrapResultError<R3>, R4>,
        op5: ResultOperator<UnwrapResultValue<R4>, UnwrapResultError<R4>, R5>,
    ): PipeResult<
        UnwrapResultValue<R5>,
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
            R1,
            R2,
            R3,
            R4,
            R5,
        ],
        UnwrapResultError<R5>
    >;
    pipe<
        R1 extends AnyResultOrAsync,
        R2 extends AnyResultOrAsync,
        R3 extends AnyResultOrAsync,
        R4 extends AnyResultOrAsync,
        R5 extends AnyResultOrAsync,
        R6 extends AnyResultOrAsync,
    >(
        op1: ResultOperator<Value, Err, R1>,
        op2: ResultOperator<UnwrapResultValue<R1>, UnwrapResultError<R1>, R2>,
        op3: ResultOperator<UnwrapResultValue<R2>, UnwrapResultError<R2>, R3>,
        op4: ResultOperator<UnwrapResultValue<R3>, UnwrapResultError<R3>, R4>,
        op5: ResultOperator<UnwrapResultValue<R4>, UnwrapResultError<R4>, R5>,
        op6: ResultOperator<UnwrapResultValue<R5>, UnwrapResultError<R5>, R6>,
    ): PipeResult<
        UnwrapResultValue<R6>,
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
            R1,
            R2,
            R3,
            R4,
            R5,
            R6,
        ],
        UnwrapResultError<R6>
    >;
    pipe<
        R1 extends AnyResultOrAsync,
        R2 extends AnyResultOrAsync,
        R3 extends AnyResultOrAsync,
        R4 extends AnyResultOrAsync,
        R5 extends AnyResultOrAsync,
        R6 extends AnyResultOrAsync,
        R7 extends AnyResultOrAsync,
    >(
        op1: ResultOperator<Value, Err, R1>,
        op2: ResultOperator<UnwrapResultValue<R1>, UnwrapResultError<R1>, R2>,
        op3: ResultOperator<UnwrapResultValue<R2>, UnwrapResultError<R2>, R3>,
        op4: ResultOperator<UnwrapResultValue<R3>, UnwrapResultError<R3>, R4>,
        op5: ResultOperator<UnwrapResultValue<R4>, UnwrapResultError<R4>, R5>,
        op6: ResultOperator<UnwrapResultValue<R5>, UnwrapResultError<R5>, R6>,
        op7: ResultOperator<UnwrapResultValue<R6>, UnwrapResultError<R6>, R7>,
    ): PipeResult<
        UnwrapResultValue<R7>,
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
            R1,
            R2,
            R3,
            R4,
            R5,
            R6,
            R7,
        ],
        UnwrapResultError<R7>
    >;
    pipe<
        R1 extends AnyResultOrAsync,
        R2 extends AnyResultOrAsync,
        R3 extends AnyResultOrAsync,
        R4 extends AnyResultOrAsync,
        R5 extends AnyResultOrAsync,
        R6 extends AnyResultOrAsync,
        R7 extends AnyResultOrAsync,
        R8 extends AnyResultOrAsync,
    >(
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
            R1,
            R2,
            R3,
            R4,
            R5,
            R6,
            R7,
            R8,
        ],
        UnwrapResultError<R8>
    >;
    pipe<
        R1 extends AnyResultOrAsync,
        R2 extends AnyResultOrAsync,
        R3 extends AnyResultOrAsync,
        R4 extends AnyResultOrAsync,
        R5 extends AnyResultOrAsync,
        R6 extends AnyResultOrAsync,
        R7 extends AnyResultOrAsync,
        R8 extends AnyResultOrAsync,
        R9 extends AnyResultOrAsync,
    >(
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
            R1,
            R2,
            R3,
            R4,
            R5,
            R6,
            R7,
            R8,
            R9,
        ],
        UnwrapResultError<R9>
    >;
    pipe<
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
    >(
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
        ],
        UnwrapResultError<R10>
    >;
    pipe<
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
    >(
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
        ],
        UnwrapResultError<R11>
    >;
    pipe<
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
    >(
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
        ],
        UnwrapResultError<R12>
    >;
    pipe<
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
    >(
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
        ],
        UnwrapResultError<R13>
    >;
    pipe<
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
    >(
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
        ],
        UnwrapResultError<R14>
    >;
    pipe<
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
    >(
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
        ],
        UnwrapResultError<R15>
    >;
    pipe<
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
    pipe(...operators: ResultOperator<Value, Err, AnyResultOrAsync>[]) {
        return pipeFromArray(operators)(this as Result<Value, Err>);
    }
}

function identity<T>(x: T): T {
    return x;
}

function handleErrorCase<O, E extends ResultError, C extends ErrorCases<E, O>>(
    error: E,
    errorCases: C,
): O {
    const errorHandler = errorCases[error[ErrorTag] as keyof typeof errorCases];

    if (errorHandler) {
        return errorHandler(error as any);
    }

    throw new Error(`Unhandled error: ${error[ErrorTag]}`);
}

function pipeFromArray<Input, Output, ErrInput extends ResultError, ErrOutput extends ResultError>(
    operators: ResultOperator<Input, ErrInput, AnyResultOrAsync>[],
): ResultOperator<Input, ErrInput, ResultOrAsync<Output, ErrOutput>> {
    if (operators.length === 0) {
        return identity as ResultOperator<Input, ErrInput, ResultOrAsync<Output, ErrOutput>>;
    }

    return function piped(input: ResultOrAsync<Input, ErrInput>): ResultOrAsync<Output, ErrOutput> {
        return operators.reduce<ResultOrAsync<Output, ErrOutput>>(
            (
                prev: ResultOrAsync<any, ResultError>,
                operator: ResultOperator<any, any, AnyResultOrAsync>,
            ) => {
                const res =
                    prev instanceof Promise ? prev.then((v) => operator(v)) : operator(prev);

                if (res instanceof Promise) {
                    return res.then(
                        (resV) => unwrapPromiseInResult(resV) as Result<Output, ErrOutput>,
                    );
                } else {
                    return unwrapPromiseInResult(res) as Result<Output, ErrOutput>;
                }
            },
            input as any,
        );
    };
}

function unwrapPromiseInResult<Value, Err extends ResultError>(
    result: Result<Value, Err>,
): ResultOrAsync<Value, Err> {
    if (result.isSuccess() && result.value() instanceof Promise) {
        return (result.value() as Promise<Value | Result<Value, Err>>).then((value) => {
            if (value instanceof ResultImpl) {
                return value;
            }
            return succeed(value);
        }) as any;
    } else if (result.isFailure() && result.error() instanceof Promise) {
        return (result.error() as any as Promise<Err | Result<Value, Err>>).then((error) => {
            if (error instanceof ResultImpl) {
                return error;
            } else if (isError(error)) {
                return defect(error);
            }
        }) as any;
    }
    return result;
}

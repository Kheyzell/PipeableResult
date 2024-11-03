import { Result } from "./result.interface";
import { ResultOperatorFunction } from "./types";

/* Result implementation */

export class ResultImpl<Value, Err extends ResultError> implements Result<Value, Err> {
    private _value: Value;
    private _err: Err | null = null;

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
            return obj.err(this._err!);
        }

        return this._value;
    };

    inspect(): string {
        if (this._isFailure) {
            return `Failure(${this._err!.message})`;
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

    static create(name: string, message: string): ResultError {
        return new ResultError(name, message);
    }
}

function identity<T>(x: T): T {
    return x;
}

interface UnaryFunction<T, R> {
    (source: Result<T, ResultError>): Result<R, ResultError>;
}

function pipeFromArray<T, R>(fns: Array<UnaryFunction<T, R>>): UnaryFunction<T, R> {
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
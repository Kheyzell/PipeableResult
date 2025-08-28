import { Result, ResultError, ResultOrAsync } from './result.interface';

/** Types **/

/* Utils */

export type ResultOperator<
    InputValue,
    InputErr extends ResultError,
    R extends ResultOrAsync<any, ResultError>,
> = (r: Result<InputValue, InputErr>) => R;

export type OneOf<T extends { [key: string]: any }> = T[keyof T];

/** Test wether at least one type of a union is a Promise */
type IsPromise<T> = Extract<T, Promise<any>> extends never ? false : true;

export type AnyPromise<Types extends any[]> = Types extends [infer First, ...infer Rest]
    ? IsPromise<First> extends true
        ? true
        : AnyPromise<Rest>
    : false;

export type MaybeAsync<T> = T | Promise<T>;
export type UnwrapPromise<T> = T extends Promise<infer U> ? U : T;

type ValueOf<T> = T[keyof T];

/* Match Cases */

export const ErrorTag: unique symbol = Symbol('ErrorTag');

export type SuccessCase<T, U> = {
    Success: (value: T) => U;
};

export type ErrorCases<E extends ResultError, O> = {
    [K in E[typeof ErrorTag]]: (error: Extract<E, { [ErrorTag]: K }>) => O;
};

export type ErrorCaseReturns<T extends ErrorCases<any, O>, O = any> = ReturnType<
    ValueOf<{ [K in keyof T]: T[K] }>
>;

export type MatchCases<InputValue, Err extends ResultError, OutputValue> = SuccessCase<
    InputValue,
    OutputValue
> &
    ErrorCases<Err, OutputValue>;

export type MatchCasesReturns<T extends MatchCases<any, any, any>> = ReturnType<
    ValueOf<{ [K in keyof T]: T[K] }>
>;

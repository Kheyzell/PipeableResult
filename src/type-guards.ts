import { ResultImpl } from "./result.implementation";
import { Result, ResultError } from "./result.interface";
import { ErrorTag } from './types';

/** Type Guards **/

export const isResult = <Value, Err extends ResultError>(resultCandidate: any): resultCandidate is Result<Value, Err> => {
    return resultCandidate instanceof ResultImpl;
};

export const isError = (errorCandidate: any): errorCandidate is ResultError => {
    return typeof (errorCandidate as ResultError)[ErrorTag] === 'string';
};

export const isErrorType = <E extends ResultError>(errorCandidate: any, tag: E[typeof ErrorTag]): errorCandidate is E => {
    return (errorCandidate as ResultError)[ErrorTag] === tag;
}
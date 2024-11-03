import { ResultError, ResultImpl } from "./result.implementation";
import { Result } from "./result.interface";

/** Type Guards **/

export const isResult = <Value, Err extends ResultError>(resultCandidate: any): resultCandidate is Result<Value, Err> => {
    return resultCandidate instanceof ResultImpl;
};

export const isError = <Err extends ResultError>(errorCandidate: any): errorCandidate is Err => {
    return errorCandidate instanceof ResultError;
};
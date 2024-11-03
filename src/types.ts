import { ResultError } from "./result.implementation";
import { Result } from "./result.interface";

/* Types */

export type ResultOperatorFunction<V, E extends ResultError, V2, E2 extends ResultError> = (a: Result<V, E>) => Result<V2, E2>;
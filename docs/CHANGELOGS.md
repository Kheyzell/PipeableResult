# Changelogs

#### 0.4.3 26/08/2025

- add `safe` factory to create a Result from an operation that might throw, encapsulating the exception with a `ResultError`

#### 0.4.2 15/08/2025

- Rename `catchErr` operator to `tapErr` to better represent its behaviour and use

#### 0.4.1 15/08/2025

- Rename `fail` factory function to `defect` to avoid naming collision with popular testing solutions

## 0.4.0 - 15/08/2025

- Introduction of matching structures to distinguish between `Success` case and all different types of `error` cases
    - rework on the ResultError type system to allow for better supported distinction between types of errors
    - add methods `match` and `matchErrors`
    - add operators `match` and `matchErrors`
    - `unwrap` now support the matching structure
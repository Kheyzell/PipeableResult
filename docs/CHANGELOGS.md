# Changelogs

## 0.3.0 - 15/08/2025

- Introduction of matching structures to distinguish between `Success` case and all different types of `error` cases
    - rework on the ResultError type system to allow for better supported distinction between types of errors
    - adds methods `match` and `matchErrors`
    - adds operators `match` and `matchErrors`
    - unwrap now support the matching structure
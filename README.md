# PipeableResult

Small and simple pipeable Result library in TypeScript to handle errors in a more functional way.

The pipe of operators allows to compose processes on Results

<details>
  <summary> Motivation </summary>

  > I wanted to create a simple library to handle errors following the Result pattern and saw it as a challenge to make it pipeable and supporting asynchronous operations.
  > 
  > I was inspired by the [rxjs.dev](https://rxjs.dev/) library for adding the pipeable operators.
</details>

## Table of Contents

* [Usage](#usage)
  * [Purpose](#purpose)
  * [Some example](#some-example)
* [Creating Results](#creating-results)
  * [succeed Function](#succeed-function)
  * [fail Function](#fail-function)
* [Interface](#interface)
  * [isSuccess](#issuccess)
  * [isFailure](#isfailure)
  * [unwrap](#unwrap)
  * [inspect](#inspect)
  * [value](#value)
  * [error](#error)
* [Pipe](#pipe)
* [Pipe Operators](#pipe-operators)
  * [map](#map)
  * [mapErr](#maperr)
  * [chain](#chain)
  * [chainErr](#chainerr)
  * [tap](#tap)
  * [catchErr](#catcherr)
  * [match](#match)
* [Error Handling](#error-handling)

## Usage

### Purpose

Result is a functionnal approach to handling error.
In most cases it can be used in place of the traditionnal `try/catch` method.

#### Advantages:
- Compile time error check (meaning you cannot forget to handle the error before accessing the value).
- Explicit and predictable.
- No uncaught exceptions.
- Improved type safety (with TypeScript).
- Composability (functional chaining (map, flatMap)).
- Easier testing.

### Some examples

#### A simple example: division by zero

With `try/catch`
```typescript
function divideBy(dividend: number, divisor: number) : number {
    if (divisor == 0) {
        throw new Error("Cannot divide by zero.");
    }

    return dividend / divisor;
}

---------------

let divisionValue: number;
try {
    divisionValue = divideBy(10, 0);
    console.log(divisionValue);
} catch (error) {
    console.error(error);
}

if (divisionValue === null) {
    return;
}
const someOtherCalculation = someFunction(divisionValue);
```

With `Result`
```typescript
function divideBy(dividend: number, divisor: number) : Result<number> {
    if (divisor == 0) {
        fail(new ResultError("DivisionByZero", "Cannot divide by zero."));
    }

    return succeed(dividend / divisor);
}

---------------

const divisionResult = divideBy(10, 0).pipe(
    tap(console.log),
    catchErr(console.error)
);

if (divisionResult.isFailure()) {
    return;
}
const someOtherCalculation = someFunction(divisionResult.value());
```

While the `divideBy` implementation is not simpler with `Result`, error handling is implicit with try/catch in the first example, increasing the risk of bugs. On the other hand, the `Result` approach enforces explicit error handling when accessing the returned value.
Checking if the `Result` is a `Success` or a `Failure` is a common way to determine what action perform and then safely access the data with `value()`.

#### Another example: reading a file

With `try/catch`
```typescript
try {
    const content = readFileSync("example.txt");
    console.log("File content:", content);
} catch (error) {
    console.error("Error:", error.message);
}
```

With `Result`: using `try/catch` to return `Result`
```typescript
function readFile(path: string): Result<string> {
    try {
        return succeed(readFileSync(path));
    } catch (error) {
        return fail(new ResultError("FileReading", `Failed to read file: ${error.message}`));
    }
}

---------------

readFile("example.txt").pipe(
    tap(console.log),
    catchErr(console.error)
);
```

In the second example, the function catches the Error thrown by readFileSync and converts it into a Result containing either the file content or the error. Most libraries handle errors by throwing them.
Now, we can safely use the `readFile` function to access the content of a file.

#### A more complex example: multiple async calls chained together

With `try/catch`
```typescript
async function getData<T>(url: string): Promise<T> {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }

        return await response.json() as T;
    } catch (error) {
        throw new Error(`Error fetching data: ${error}`);
    }
}

async function getUser(userId: string): Promise<User> {
    const url = `${window.location.origin}/api/users/${userId}`;
    return await getData<User>(url);
}

async function getDocuments(documentIds: string[]): Promise<Document[]> {
    const url = `${window.location.origin}/api/documents/${documentIds.join(',')}`;
    return await getData<Document[]>(url);
}

function checkDocumentHasBeenValidated(document: Document): boolean {
    return document.status === 'VALIDATED';
}

---------------

const userId = 'user123';

let validDocuments: Document[] = [];
try {
    const user = await getUser(userId);
    const documents = await getDocuments(user.documents);
    validDocuments = documents.filter(checkDocumentHasBeenValidated);
} catch (error) {
    console.error(error);
    validDocuments = [];
}

console.log(`All valid document found: ${validDocuments.map(doc => doc.name.join(', '))}`);
```

With `Result`
```typescript
async function getData<T>(url: string): Promise<Result<T>> {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }

        const data = await response.json() as T;
        return succeed(data);
    } catch (error) {
        return fail(new ResultError('FetchError', `Error fetching data: ${error}`));
    }
}

async function getUserAsync(userId: string): Promise<Result<User>> {
    const url = `${"window.location.origin"}/api/users/${userId}`;
    return await getData<User>(url);
}

async function getDocumentsAsync(documentIds: string[]): Promise<Result<Document[]>> {
    const url = `${"window.location.origin"}/api/documents/${documentIds.join(',')}`;
    return await getData<Document[]>(url);
}

function checkDocumentHasBeenValidated(document: Document): boolean {
    return document.status === 'VALIDATED';
}

---------------

const userId = 'user123';

(await getUserAsync(userId)).pipe(
    map(user => getDocumentsAsync(user.documents)),
    map(documents => documents.filter(checkDocumentHasBeenValidated)),
    tap(validDocuments => console.log(`All valid document found: ${validDocuments.map(doc => doc.name).join(', ')}`)),
    catchErr(err => console.error(err))
);
```

## Creating Results

The library offers two factory functions to create `Result` instances: `succeed` and `fail`.

### `succeed` Function

Creates a `Success`, a result containing optionnaly a value and no error.

```typescript
import { succeed } from "pipeable-result";

const result1 = succeed(5);             // Successful Result with value 5
const result2 = succeed("Success!");    // Successful Result with value "Success!"
const result3 = succeed();              // Successful Result with no value
```

### `fail` Function

Creates a `Failure`, a result containing an error.

```typescript
import { fail, ResultError } from "pipeable-result";

const error = new ResultError("Error", "Something went wrong");
const result = fail(error); // Result with an error
```

## Interface

Each `Result` object offers a set of methods for handling and inspecting its state. Below are the core methods provided.

### `isSuccess`

Returns true if the Result is a Success, false otherwise.

```typescript
if (result.isSuccess()) {
    console.log("Operation succeeded.");
}
```

### `isFailure`

Returns true if the Result is a Failure, false otherwise.

```typescript
if (result.isFailure()) {
    console.log("Operation failed.");
}
```

### `unwrap`

Safely retrieves the value inside the `Result`. If the `Result` is a `Failure`, it calls the provided error handler to return a value.

```typescript
const value = result.unwrap({
    err: (error) => {
        console.error("Error:", error.message);
        return "Default Value"; // Provide a default or handle error here
    },
});
```

### `inspect`

Returns a string representation of the `Result`.

```typescript
console.log(result.inspect()); // "Success(5)" or "Failure(Error name: Error message)"
```

### `value`

Unsafely retrieves the value inside the `Result`. Throws an error if the `Result` is a `Failure`.

```typescript
try {
    const value = result.value();
} catch (error) {
    console.error("Failed to retrieve value:", error);
}
```

### `error`

Returns the error inside a `Failure` result or null if the `Result` is a `Success`.

```typescript
const error = result.error();
if (error) {
    console.error("Error:", error.message);
}
```

## Pipe

The `pipe` method allows chaining of transformations and side-effects on the `Result`. Each transformation function receives the `Result` and returns a new one.

### Example
```typescript
const result = succeed("hello")
    .pipe(
        map((x) => x.toUpperCase()),    // Transform value
        catchErr((e) => console.log(e)) // Handle error if occurs
    );
```

## Pipe Operators

Below are some of the provided operators that can be used within the `pipe`.

### `map`

Transforms a `Success` result value and wraps the output in a new `Success`. If the `Result` is a `Failure`, it returns the original `Failure`.

```typescript
const result = succeed(5)
    .pipe(map((x) => x * 2)); // Result with value 10
```

### `mapErr`

Transforms a `Failure` result error and wraps it in a new `Failure`. If the `Result` is a `Success`, it returns the original `Success`.

```typescript
const result = fail(new ResultError("Error", "Something went wrong"))
    .pipe(mapErr((e) => new ResultError(e.name, "Handled: " + e.message))); // Result with the new ResultError
```

### `chain`

Chains another operation on a `Success` result that returns a new `Result`. If the `Result` is a `Failure`, it returns the original `Failure`.

```typescript
const result = succeed(5)
    .pipe(chain((x) => succeed(x * 2))); // Result with value 10
```

### `chainErr`

Chains an operation on a `Failure` result that returns a new `Result`. If the `Result` is a `Success`, it returns the original `Success`.

```typescript
const result = fail(new ResultError("Error", "Something went wrong"))
    .pipe(chainErr(() => succeed("Default value")));
```

### `tap`

Performs a side-effect on a `Success` result value. Returns the original `Result`.

```typescript
succeed("Task completed").pipe(
    tap((value) => console.log("Success:", value)) // Logs "Success: Task completed"
);
```

### `catchErr`

Performs a side-effect on a `Failure` result error. Returns the original `Result`.

```typescript
fail(new ResultError("Error", "Task failed")).pipe(
    catchErr((err) => console.error("Failure:", err.message)) // Logs "Failure: Task failed"
);
```

### `match`

Matches the `Result` against success and error handlers, executing the appropriate one based on the state of the `Result`.

```typescript
const result = succeed("Task completed");

result.pipe(
    match({
        ok: (value) => console.log("Success:", value),
        err: (error) => console.error("Failure:", error.message),
    })
);
```

## Error Handling

The `ResultError` class is used to encapsulate errors within Failure results.

```typescript
const error = new ResultError("CustomError", "An error occurred");
const result = fail(error);

console.log(result.inspect()); // "Failure(An error occurred)"
```
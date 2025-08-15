# PipeableResult

Small and simple pipeable Result library in TypeScript to handle errors in a more functional way.

The pipe of operators allows to compose processes on Results

<details>
  <summary> Motivation </summary>

  > I wanted to create a simple library to handle errors following the Result pattern and saw it as a challenge to make it pipeable and supporting asynchronous operations.
  > 
  > I was inspired by the [rxjs.dev](https://rxjs.dev/) library for adding the pipeable operators.
</details>

## Changelogs

> [=> see CHANGELOGS.md](docs/CHANGELOGS.md)

## Table of Contents

* [Installation](#installation)
* [Usage](#usage)
  * [Purpose](#purpose)
  * [Some examples](#some-examples)
* [Creating Results](#creating-results)
  * [succeed Factory](#succeed-factory)
  * [defect Factory](#defect-factory)
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
  * [tapErr](#taperr)
  * [match](#match)
* [Error Handling](#error-handling)

## Installation

### Via npm
```bash
npm install pipeable-result
```

## Usage

### Purpose

Result is a functionnal approach to handling error.
In most cases it can be used in place of the traditionnal `try/catch` method.

#### Benefits:
- Compile time error check (meaning you cannot forget to handle the error before accessing the value).
- Explicit and predictable.
- No uncaught exceptions.
- Improved type safety (with TypeScript).
- Composability (functional chaining (map, tap, chain, ...)).
- Easier testing.

#### drawbacks:
- Adds verbosity (needs to explicitly wraps values and errors in a `Result`)
- Complexify debugging (when having multiple layers of function calls, debuggers can have a harder time following the flow)

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
        defect(new ResultError("DivisionByZero", "Cannot divide by zero."));
    }

    return succeed(dividend / divisor);
}

---------------

const divisionResult = divideBy(10, 0).pipe(
    tap(console.log),
    tapErr(console.error)
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
        return defect(new ResultError("FileReading", `Failed to read file: ${error.message}`));
    }
}

---------------

readFile("example.txt").pipe(
    tap(console.log),
    tapErr(console.error)
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
        return defect(new ResultError('FetchError', `Error fetching data: ${error}`));
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
    map(user => getDocumentsAsync(user.documentIds)),
    map(documents => documents.filter(checkDocumentHasBeenValidated)),
    tap(validDocuments => console.log(`All valid document found: ${validDocuments.map(doc => doc.name).join(', ')}`)),
    tapErr(err => console.error(err))
);
```

## Creating Results

The library offers two factory functions to create `Result` instances: `succeed` and `defect`.

### `succeed` Factory

Creates a `Success`, a result containing optionnaly a value and no error.

```typescript
import { succeed } from "pipeable-result";

const result1 = succeed(5);             // Successful Result with value 5
const result2 = succeed("Success!");    // Successful Result with value "Success!"
const result3 = succeed();              // Successful Result with no value
```

### `defect` Factory

Creates a `Failure`, a result containing an error.

> **Note**: the idiomatic way is to provide a specific type for a specific error so that an action can be performed depending on what went wrong.

```typescript
import { defect, ResultError } from "pipeable-result";

type HttpNotFoundError = { [ErrorTag]: "HttpNotFoundError", code: 404, ressourceType: string };
...
const result = defect<HttpNotFoundError>({ [ErrorTag]: "HttpNotFoundError", code: 404, ressourceType: "MediaFile" });
// => Result with an error of type HttpNotFoundError
```

## Interface

The `Result` object offers a set of methods for handling and inspecting its state. Below are the core methods provided.

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
const result = unsafeCalculation(); // some Result<number, ResultError> to handle
const value = result.unwrap(error => 0); // safely unwrap the value by handling the error case
```

`unwrap` also provides a matching structure to handle each error exhaustively.

```typescript
const result = unsafeCalculation();
const value = result.unwrap({
    HttpResponseError: (error) => 0, // handle HttpResponseError in a certain way
    NetworkError: (error) => doMoreCalculation(), // handle NetworkError in a different way
});
```

### `inspect`

Returns a string representation of the `Result`.

```typescript
succeed("Hello").inspect(); // => `Success("Hello")`
defect({ [ErrorTag]: "TestError", message: "Failed process", code: 40 })
    .inspect(); // => `Failure(TestError): { message: "Failed process", code: 40 }`
```

### ⚠️ `value` ⚠️

**Unsafely** retrieves the value inside the `Result`. **Throws an error** if the `Result` is a `Failure`.

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

The `pipe` method allows chaining of transformations and side-effects on the `Result`. Each transformation function receives the `Result`, do some operation on it and returns it.

### Example
```typescript
const result = succeed("hello")
    .pipe(
        map((x) => x.toUpperCase()),    // Transform the value
        tap((x) => console.log(x))      // Logs the value
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
const result = defect<SomeLowLevelError>({ [ErrorTag]: "SomeLowLevelError", code: 16 })
    .pipe(
        mapErr((e) => ({ [ErrorTag]: "SomeOtherError", message: `An error occurred during operation with code ${e.code}` }) as SomeOtherError)
    ); // Result with the new error
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
const result = defect(new ResultError("Error", "Something went wrong"))
    .pipe(chainErr(() => succeed("Default value")));
```

### `tap`

Performs a side-effect on a `Success` result value. Returns the original `Result`.

```typescript
succeed("Task completed").pipe(
    tap((value) => console.log("Success:", value)) // Logs "Success: Task completed"
);
```

### `tapErr`

Performs a side-effect on a `Failure` result error. Returns the original `Result`.

```typescript
defect<TaskFailedError>({ [ErrorTag]: "TaskFailedError" }).pipe(
    tapErr((err) => console.error("Failure:", err.message)) // Logs "Failure: Task failed"
);
```

### `match`

Matches the `Result` against success and error handlers, executing the appropriate one based on the state of the `Result`.

```typescript
const result: Result<number, ErrorType1 | ErrorType2> = await unsafeCalculation();
result.pipe(
    match({
        Success: value => succeed(value * 2),
        ErrorType1: error => succeed(error.code === 500 ? true : false),
        ErrorType2: error => someOtherCalculation(error),
    })
);
```

## Error Handling

Errors are represented by the type `ResultError`.
They must use the symbol `ErrorTag` with string so they can be distinguished from each other at runtime in the *matching structures* (see methods `match`, `matchErrors`, `unwrap`, etc...) and any number of other keys.

The prefered way to create an error is to first create an error with the correct shape
```typescript
type ExampleError = { [ErrorTag]: "ExampleError", someKey: number };
```

Or extends `ResultError`
```typescript
interface AnotherError extends ResultError {
    [ErrorTag]: "AnotherError";
    message: string;
}
```

And then create a `Failure` using the `defect` factory
```typescript
const result = defect<ExampleError>({ [ErrorTag]: "ExampleError", someKey: 0 });
```
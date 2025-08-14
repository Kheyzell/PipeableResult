import { fail, succeed } from '../src/factories';
import { catchErr, chain, map, tap } from '../src/operators/operators';
import { Result } from '../src/result.interface';
import { ErrorTag } from '../src/types';

describe("Examples", () => {
    describe("More complex example", () => {
      type User = {
        name: string;
        documentIds: string[];
      };
      
      type Document = {
        name: string;
        status: "VALIDATED" | "NOT_VALIDATED";
      };
      
      type HttpResponseError = {
        [ErrorTag]: "HttpResponseError";
        status: number;
      };
      
      type NetworkError = { [ErrorTag]: "NetworkError"; message: string };

      it("should handle a successful flow", async () => {
        // Arrange
        async function getUserAsync(_userId: string): Promise<Result<User, NetworkError | HttpResponseError>> {
          return Promise.resolve(succeed<User>({ name: "UserName", documentIds: ["1", "2", "3"] }));
        }
        
        const getDocumentsAsync = jest.fn(
            (_documentIds: string[]) => Promise.resolve(succeed<Document[]>([
              { name: "Document 1", status: "VALIDATED" },
              { name: "Document 2", status: "NOT_VALIDATED" },
              { name: "Document 3", status: "VALIDATED" },
            ])));
  
        const checkDocumentHasBeenValidated = jest.fn((document: Document) => document.status === "VALIDATED");

        const logValidDocuments = jest.fn();
        const logError = jest.fn();
  
        const userId = "user123";
        
        // Act
        const result = await (await getUserAsync(userId)).pipe(
          chain((user) => getDocumentsAsync(user.documentIds)),
          map((documents) => documents.filter(checkDocumentHasBeenValidated)),
          tap((validDocuments) => logValidDocuments(validDocuments)),
          catchErr((err) => logError(err)),
        );
  
        // Assert
        expect(result.isSuccess()).toBe(true);
        expect(result.value()).toEqual([{ name: "Document 1", status: "VALIDATED" }, { name: "Document 3", status: "VALIDATED" }]);
  
        expect(getDocumentsAsync).toHaveBeenCalledWith(["1", "2", "3"]);
        expect(checkDocumentHasBeenValidated).toHaveBeenCalledTimes(3);
        expect(logValidDocuments).toHaveBeenCalledWith([{ name: "Document 1", status: "VALIDATED" }, { name: "Document 3", status: "VALIDATED" }]);
        expect(logError).not.toHaveBeenCalled();
      });
  
      it("should handle an error", async () => {
        // Arrange
        async function getUserAsync(_userId: string): Promise<Result<User, NetworkError | HttpResponseError>> {
          return Promise.resolve(succeed<User>({ name: "UserName", documentIds: ["1", "2", "3"] }));
        }
  
        const getDocumentsAsync = jest.fn(
            (_documentIds: string[]) => Promise.resolve(
                fail<HttpResponseError, Document[]>({ [ErrorTag]: "HttpResponseError", status: 500 })));
  
        const checkDocumentHasBeenValidated = jest.fn((document: Document) => document.status === "VALIDATED");

        const logValidDocuments = jest.fn();
        const logError = jest.fn();
  
        const userId = "user123";
        
        // Act
        const result = await (await getUserAsync(userId)).pipe(
          chain((user) => getDocumentsAsync(user.documentIds)),
          map((documents) => documents.filter(checkDocumentHasBeenValidated)),
          tap((validDocuments) => logValidDocuments(validDocuments)),
          catchErr((err) => logError(err)),
        );
  
        // Assert
        expect(result.isFailure()).toBe(true);
        expect(result.error()).toEqual({ [ErrorTag]: "HttpResponseError", status: 500 });

        expect(getDocumentsAsync).toHaveBeenCalledWith(["1", "2", "3"]);
        expect(checkDocumentHasBeenValidated).not.toHaveBeenCalled();
        expect(logValidDocuments).not.toHaveBeenCalled();
        expect(logError).toHaveBeenCalledWith({ [ErrorTag]: "HttpResponseError", status: 500 });
      });
    });
});

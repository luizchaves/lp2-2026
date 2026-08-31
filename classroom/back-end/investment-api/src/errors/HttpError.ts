export type HttpErrorIssues = Record<string, string[]>;

class HttpError extends Error {
  code: number;
  issues?: HttpErrorIssues;

  constructor(message: string, code: number = 400, issues?: HttpErrorIssues) {
    super(message);
    this.name = 'HttpError';
    this.code = code;
    this.issues = issues;
  }
}

export default HttpError;

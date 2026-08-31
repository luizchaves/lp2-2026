import type { NextFunction, Request, Response } from 'express';
import type { ZodError, ZodType } from 'zod';

import HttpError from '@/errors/HttpError.ts';

type RequestData = {
  body?: unknown;
  query?: unknown;
  params?: unknown;
};

function formatIssues(error: ZodError): Record<string, string[]> {
  return error.issues.reduce<Record<string, string[]>>((issues, issue) => {
    const path = issue.path.join('.') || 'request';

    issues[path] ??= [];
    issues[path].push(issue.message);

    return issues;
  }, {});
}

export function validate(schema: ZodType<RequestData>) {
  return (req: Request, _res: Response, next: NextFunction) => {
    const result = schema.safeParse({
      body: req.body,
      query: req.query,
      params: req.params,
    });

    if (!result.success) {
      throw new HttpError('Invalid request data', 400, formatIssues(result.error));
    }

    if ('body' in result.data) {
      req.body = result.data.body;
    }

    if ('query' in result.data) {
      req.query = result.data.query as Request['query'];
    }

    if ('params' in result.data) {
      req.params = result.data.params as Request['params'];
    }

    next();
  };
}

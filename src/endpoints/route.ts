import { ZodIssue, ZodIssueCode } from "zod";
import { KnownErrorCode, UnprocessableEntityError } from "@utils/error";
import { OpenAPIRoute } from "chanfana";

export type CustomZodError = ZodIssue & {
  code: typeof ZodIssueCode.custom;
  params: {
    code: KnownErrorCode;
  };
};

function isCustomZodError(issue: ZodIssue): issue is CustomZodError {
  return issue.code === ZodIssueCode.custom && issue.params && issue.params.code;
}

export class AppRoute extends OpenAPIRoute {
  handleValidationError(errors: ZodIssue[]): Response {
    const issue = errors[0];

    if (isCustomZodError(issue)) {
      throw new UnprocessableEntityError(issue.params.code);
    } else {
      return super.handleValidationError(errors);
    }
  }
}

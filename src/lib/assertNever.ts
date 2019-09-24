import { ErrorFactory } from "./errors";

export const assertNever = (x: never): never => {
  throw ErrorFactory.newInternalError("Unexpected object: " + x);
}

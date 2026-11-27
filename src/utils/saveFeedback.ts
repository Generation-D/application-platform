import { SAVE_FAILED_MESSAGE } from "@/actions/answers/saveErrors";

export class UserFacingError extends Error {}

export function alertSaveFailed(error: unknown) {
  console.error(error);
  alert(error instanceof UserFacingError ? error.message : SAVE_FAILED_MESSAGE);
}

export function withSaveFeedback<T>(promise: Promise<T>) {
  return promise.catch(alertSaveFailed);
}

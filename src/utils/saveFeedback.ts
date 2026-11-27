import { SAVE_FAILED_MESSAGE } from "@/actions/answers/saveErrors";

/** An error whose message is safe and meant to be shown to the applicant. */
export class UserFacingError extends Error {}

/**
 * Tells the applicant that their answer was not saved. Server action errors
 * are sanitised by Next.js in production, so only client-side
 * UserFacingErrors keep their own message.
 */
export function alertSaveFailed(error: unknown) {
  console.error(error);
  alert(error instanceof UserFacingError ? error.message : SAVE_FAILED_MESSAGE);
}

/** Wraps a fire-and-forget save so failures are shown instead of swallowed. */
export function withSaveFeedback<T>(promise: Promise<T>) {
  return promise.catch(alertSaveFailed);
}

// Not a "use server" module on purpose: exports here must not become callable server actions.
export const SAVE_FAILED_MESSAGE =
  "Deine Antwort konnte nicht gespeichert werden. Bitte prüfe deine Verbindung und versuche es erneut.";

interface ErrorLogger {
  error: (message: string) => void;
}

export function throwIfSaveFailed(
  error: { message: string } | null | undefined,
  log: ErrorLogger,
): asserts error is null | undefined {
  if (error) {
    log.error(JSON.stringify(error));
    throw new Error(SAVE_FAILED_MESSAGE);
  }
}

/**
 * Utility function to safely extract error information from unknown error types
 * @param error - The caught error of unknown type
 * @returns An object with message and optional status code
 */
export function extractError(error: unknown): {
  message: string;
  status?: number;
} {
  if (typeof error === 'object' && error !== null) {
    const e = error as any;
    return {
      message: e.message ?? 'Unknown error',
      status: e.status ?? undefined,
    };
  }

  return {
    message: String(error),
  };
}

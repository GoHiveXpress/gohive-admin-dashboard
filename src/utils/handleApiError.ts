// src/utils/handleApiError.ts

import type { AxiosError } from "axios";

function isAxiosErrorWithMessage<T>(
  error: unknown,
): error is AxiosError<{ message?: string }, T> {
  return (
    typeof error === "object" &&
    error !== null &&
    "isAxiosError" in error &&
    (error as AxiosError).isAxiosError === true
  );
}

export default function handleApiError<T = unknown>(
  error: unknown,
  defaultMessage: string,
): never {
  if (isAxiosErrorWithMessage<T>(error)) {
    const responseMessage =
      error.response?.data?.message || error.message || defaultMessage;

    throw new Error(responseMessage);
  }

  if (error instanceof Error) {
    throw new Error(error.message || defaultMessage);
  }

  throw new Error(defaultMessage);
}

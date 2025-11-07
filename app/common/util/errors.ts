// Type for API error responses
interface ApiErrorResponse {
  message?: string | string[];
  error?: string;
  statusCode?: number;
}

/**
 * Extracts and formats error message from API response
 * @param response - The error response from the API
 * @returns Formatted error message
 */
export const getErrorMessage = (response: unknown): string => {
  // Handle null/undefined
  if (!response) {
    return "An unknown error occurred.";
  }

  // Type guard for object responses
  if (typeof response === "object" && response !== null) {
    const errorResponse = response as ApiErrorResponse;

    // Handle message field
    if (errorResponse.message) {
      if (Array.isArray(errorResponse.message)) {
        return formatErrorMessage(errorResponse.message[0] || "Validation error");
      }
      return formatErrorMessage(errorResponse.message);
    }

    // Handle error field
    if (errorResponse.error) {
      return formatErrorMessage(errorResponse.error);
    }
  }

  // Handle string responses
  if (typeof response === "string") {
    return formatErrorMessage(response);
  }

  return "An unknown error occurred.";
};

/**
 * Capitalizes the first letter of a message
 * @param message - The error message to format
 * @returns Formatted message with capitalized first letter
 */
const formatErrorMessage = (message: string): string => {
  if (!message || message.length === 0) {
    return "An error occurred.";
  }
  return message.charAt(0).toUpperCase() + message.slice(1);
};

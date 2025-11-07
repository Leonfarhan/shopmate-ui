import { cookies } from "next/headers";
import { API_URL } from "../constants/api";
import { getErrorMessage } from "./error-handler";

/**
 * Generic API response type
 */
export interface ApiResponse<T = unknown> {
  error: string;
  data?: T;
}

/**
 * Gets authentication headers with cookies
 * @returns Headers object with cookie string
 */
export const getHeaders = (): Record<string, string> => ({
  Cookie: cookies().toString(),
});

/**
 * Makes a POST request to the API
 * @param path - API endpoint path (without base URL)
 * @param data - Request payload (FormData or object)
 * @returns Promise with error message and optional data
 */
export const post = async <T = unknown>(
  path: string,
  data: FormData | object
): Promise<ApiResponse<T>> => {
  try {
    const body = data instanceof FormData ? Object.fromEntries(data) : data;

    const res = await fetch(`${API_URL}/${path}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...getHeaders()
      },
      body: JSON.stringify(body),
    });

    // Handle non-JSON responses
    const contentType = res.headers.get("content-type");
    if (!contentType?.includes("application/json")) {
      if (!res.ok) {
        return { error: `Server error: ${res.status} ${res.statusText}` };
      }
      return { error: "Invalid response format from server" };
    }

    const parsedRes = await res.json();

    if (!res.ok) {
      return { error: getErrorMessage(parsedRes) };
    }

    return { error: "", data: parsedRes as T };
  } catch (error) {
    // Handle network errors, timeout, etc.
    if (error instanceof Error) {
      return { error: `Network error: ${error.message}` };
    }
    return { error: "Failed to connect to server" };
  }
};

/**
 * Makes a GET request to the API
 * @param path - API endpoint path (without base URL)
 * @param tags - Next.js cache tags for revalidation
 * @param params - URL search parameters
 * @returns Promise with typed response data
 * @throws Error if request fails
 */
export const get = async <T>(
  path: string,
  tags?: string[],
  params?: URLSearchParams
): Promise<T> => {
  try {
    const url = params
      ? `${API_URL}/${path}?${params.toString()}`
      : `${API_URL}/${path}`;

    const res = await fetch(url, {
      headers: { ...getHeaders() },
      next: { tags },
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(getErrorMessage(errorData) || `HTTP ${res.status}`);
    }

    return res.json() as Promise<T>;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Failed to fetch data");
  }
};

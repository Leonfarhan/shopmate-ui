/**
 * Generic form response interface with optional data
 */
export interface FormResponse<T = unknown> {
  error: string;
  data?: T;
}

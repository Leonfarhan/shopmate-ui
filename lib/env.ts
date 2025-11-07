/**
 * Environment Variable Validation
 * Type-safe access to environment variables
 */

/**
 * Validates that a required environment variable exists
 * @param key - The environment variable key
 * @param value - The environment variable value
 * @throws Error if the variable is not defined
 */
function validateEnvVar(key: string, value: string | undefined): string {
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
}

/**
 * Validated environment variables
 */
export const env = {
  /**
   * Backend API URL (required)
   */
  apiUrl: validateEnvVar("NEXT_PUBLIC_API_URL", process.env.NEXT_PUBLIC_API_URL),

  /**
   * Stripe public key (required for checkout)
   */
  stripePublicKey: validateEnvVar(
    "NEXT_PUBLIC_STRIPE_PUBLIC_KEY",
    process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY
  ),

  /**
   * Node environment
   */
  nodeEnv: process.env.NODE_ENV || "development",

  /**
   * Is production environment
   */
  isProd: process.env.NODE_ENV === "production",

  /**
   * Is development environment
   */
  isDev: process.env.NODE_ENV === "development",
} as const;

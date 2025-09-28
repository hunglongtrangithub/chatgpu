import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

const isString = z.string().min(1);
const isBoolean = z.string().transform((s) => s !== "false" && s !== "0");
const isNumber = z.coerce.number();

/**
 * Centralized environment variables for the application.
 */
export const env = createEnv({
  server: {
    // general
    NODE_ENV: z.enum(["development", "production"]).default("development"),
    NEXT_MANUAL_SIG_HANDLE: isBoolean.default(true),
    NEXT_TELEMETRY_DISABLED: isBoolean.default(true),
    NEXT_RUNTIME: z.enum(["nodejs"]).default("nodejs"),
    PROTOCOL: z.enum(["http", "https"]).default("http"),
    HOSTNAME: isString.default("localhost"),
    APP_PORT: isNumber.default(3000),

    // logging
    LOG_LEVEL: z
      .enum(["fatal", "error", "warn", "info", "debug", "trace", "silent"])
      .default("info"),

    // rate limiting
    ENABLE_RATE_LIMIT: isBoolean.default(false),

    // authentication
    BETTER_AUTH_SECRET: isString,
    BETTER_AUTH_LOG_LEVEL: z
      .enum(["info", "warn", "error", "debug"])
      .default("info"),
    GOOGLE_CLIENT_ID: isString,
    GOOGLE_CLIENT_SECRET: isString,
    GITHUB_CLIENT_ID: isString,
    GITHUB_CLIENT_SECRET: isString,

    // database
    DATABASE_LOGGING: isBoolean.default(true),
  },
  experimental__runtimeEnv: {},
  createFinalSchema: (shape) =>
    z.object(shape).transform((env) => {
      return {
        ...env,
        // derived properties
        BASE_URL: `${env.PROTOCOL}://${env.HOSTNAME}:${env.APP_PORT}`,
      };
    }),
});

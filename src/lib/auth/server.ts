import "server-only";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { nextCookies } from "better-auth/next-js";
import { siteConfig } from "@/config";
import { env } from "@/env";
import { db } from "@/infra";
import { logger } from "@/lib/logger";

const log = logger.child({ module: "lib/auth/server" });

export const auth = betterAuth({
  telemetry: {
    enabled: false,
  },
  appName: siteConfig.name,
  secret: env.BETTER_AUTH_SECRET,
  database: drizzleAdapter(db, {
    provider: "pg",
  }),
  rateLimit: {
    enabled: env.ENABLE_RATE_LIMIT,
    storage: "database",
    modelName: "rate_limit",
  },
  session: {
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60, // 5 minutes
    },
  },
  account: {
    accountLinking: {
      enabled: true,
      updateUserInfoOnLink: true,
      allowUnlinkingAll: true,
    },
  },
  user: {
    deleteUser: {
      enabled: true,
    },
  },
  socialProviders: {
    github: {
      clientId: env.GITHUB_CLIENT_ID,
      clientSecret: env.GITHUB_CLIENT_SECRET,
      overrideUserInfoOnSignIn: true,
    },
    google: {
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
      overrideUserInfoOnSignIn: true,
    },
  },
  plugins: [nextCookies()],
  logger: {
    level: env.BETTER_AUTH_LOG_LEVEL,
    log: (level, message, ...args) => {
      // route through our logger
      switch (level) {
        case "error":
          log.error(args, message);
          break;
        case "warn":
          log.warn(args, message);
          break;
        case "info":
          log.info(args, message);
          break;
        case "debug":
          log.debug(args, message);
          break;
      }
    },
  },
});

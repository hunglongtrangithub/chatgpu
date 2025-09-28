/// <reference path="./.sst/platform/config.d.ts" />
export default $config({
  app(input) {
    return {
      name: "chatgpu",
      removal: input?.stage === "production" ? "retain" : "remove",
      protect: ["production"].includes(input?.stage),
      home: "aws",
      providers: {
        aws: {
          profile:
            input.stage === "production" ? "chatgpu-production" : "chatgpu-dev",
        },
        cloudflare: "6.9.1",
      },
    };
  },
  async run() {
    const vpc = new sst.aws.Vpc("Vpc", { bastion: true, nat: "ec2" });
    const rds = new sst.aws.Postgres("Postgres", {
      vpc,
      proxy: true,
      dev: {
        username: "postgres",
        password: "password",
        database: "local",
        port: 5432,
      },
    });

    new sst.x.DevCommand("Studio", {
      link: [rds],
      dev: {
        command: "pnpm drizzle-kit studio",
      },
    });

    const bucket = new sst.aws.Bucket("Bucket", {
      access: "public",
    });

    const domain = "chatgpu.app";
    const betterAuthSecret = new sst.Secret("BetterAuthSecret");
    // TODO:
    const googleClientId = new sst.Secret("GoogleClientId");
    // TODO:
    const googleClientSecret = new sst.Secret("GoogleClientSecret");
    // TODO:
    const githubClientId = new sst.Secret("GithubClientId");
    // TODO:
    const githubClientSecret = new sst.Secret("GithubClientSecret");

    const web = new sst.aws.Nextjs("Web", {
      vpc,
      link: [rds, bucket],
      domain: {
        name: domain,
        redirects: [`www.${domain}`],
        dns: sst.cloudflare.dns(),
      },
      environment: {
        // general
        PROTOCOL: $dev ? "http" : "https",
        HOSTNAME: $dev ? "localhost" : domain,
        APP_PORT: $dev ? "3000" : "443",

        // authentication
        BETTER_AUTH_SECRET: betterAuthSecret.value,
        GOOGLE_CLIENT_ID: googleClientId.value,
        GOOGLE_CLIENT_SECRET: googleClientSecret.value,
        GITHUB_CLIENT_ID: githubClientId.value,
        GITHUB_CLIENT_SECRET: githubClientSecret.value,

        // rate limiting
        ENABLE_RATE_LIMIT: (!$dev).toString(),

        // database
        DATABASE_LOGGING: $dev.toString(),
      },
    });

    return {
      vpc: vpc.id,
      rds: rds.id,
      rdsProxy: rds.proxyId,
      bucket: bucket.name,
      web: web.url,
    };
  },
});

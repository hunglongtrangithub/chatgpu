# ChatGPU

AI agent for finding good GPU deals for you

## TODO

- [ ] Set up [DBGPU](https://github.com/painebenjamin/dbgpu)
- [ ] Set up MCP for the agent to talk to DBGPU
- [ ] Web server to serve agent responses
- [ ] Deploy to AWS
- [ ] Set Cloudflare env vars in SST auto-deploy CI env

## Development

```shell
# ~/.aws/config
[sso-session chatgpu]
sso_start_url = https://hunglongtran.awsapps.com/start/
sso_region = us-east-2

[profile chatgpu-dev]
sso_session = chatgpu
sso_account_id = 615368094501
sso_role_name = AdministratorAccess
region = us-east-1

[profile chatgpu-production]
sso_session = chatgpu
sso_account_id = 009537862289
sso_role_name = AdministratorAccess
region = us-east-1
```

`sudo pnpm sst tunnel install` (once)

`pnpm sst secret load .env.dev` (once)

`pnpm sso` (once every 12 hours)

`docker compose up -d`

`pnpm sst dev`

`pnpm sst deploy --stage production`

`pnpm db:push` (force apply Drizzle schema to DB, no migrations, use this for
now until we stabilize schema)

`pnpm db:generate` (when changes made to Drizzle schema)

`pnpm db:migrate` (apply Drizzle migrations)

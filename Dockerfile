FROM node:22 AS builder
# Used in the build command to upload source maps to Sentry.
ARG SENTRY_AUTH_TOKEN

WORKDIR /app

COPY package.json pnpm-lock.yaml ./
RUN corepack enable && corepack prepare pnpm@latest --activate
RUN pnpm install --frozen-lockfile

COPY . .

RUN pnpm generate
RUN pnpm build

# Production image
FROM node:22
WORKDIR /app
COPY --from=builder /app /app

# Add EntryPoint script
COPY entrypoint.sh /app/entrypoint.sh
RUN chmod +x /app/entrypoint.sh

EXPOSE 8787

ENTRYPOINT ["/app/entrypoint.sh"]
CMD ["node", "dist/index.js"]

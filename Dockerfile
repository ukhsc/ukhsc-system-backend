FROM node:22 AS builder

WORKDIR /app

COPY package.json pnpm-lock.yaml ./
RUN corepack enable && corepack prepare pnpm@latest --activate
RUN pnpm install --frozen-lockfile

COPY . .

RUN pnpm generate

# Used in the build command to upload source maps to Sentry.
ARG SENTRY_AUTH_TOKEN
RUN --mount=type=secret,id=sentry_token \
    export SENTRY_AUTH_TOKEN=$(cat /run/secrets/sentry_token) && \
    pnpm build && \
    unset SENTRY_AUTH_TOKEN

# Production image
FROM node:22
WORKDIR /app
COPY --from=builder /app/dist /app/dist
COPY --from=builder /app/node_modules /app/node_modules

# Add EntryPoint script
COPY entrypoint.sh /app/entrypoint.sh
RUN chmod +x /app/entrypoint.sh

EXPOSE 8787

ENTRYPOINT ["/app/entrypoint.sh"]
CMD ["node", "dist/index.js"]

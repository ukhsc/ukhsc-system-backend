FROM node:22 AS builder

# For Sentry
ARG GIT_COMMIT
ENV GIT_COMMIT=${GIT_COMMIT}

WORKDIR /app

COPY package.json pnpm-lock.yaml ./
RUN corepack enable && corepack prepare pnpm@latest --activate
RUN pnpm install --frozen-lockfile

COPY . .

RUN pnpm generate

RUN chmod +x ./scripts/build.sh
RUN --mount=type=secret,id=sentry_token,target=/sentry_token ./scripts/build.sh

# Production image
FROM node:22
WORKDIR /app
COPY --from=builder /app /app

RUN corepack enable && corepack prepare pnpm@latest --activate

# Add EntryPoint script
COPY entrypoint.sh /app/entrypoint.sh
RUN chmod +x /app/entrypoint.sh

EXPOSE 8787

ENTRYPOINT ["/app/entrypoint.sh"]
CMD ["node", "dist/index.js"]

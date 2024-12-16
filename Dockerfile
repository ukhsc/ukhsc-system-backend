FROM oven/bun:latest as builder

WORKDIR /build

COPY . .

RUN bun install --production
RUN bun add -d prisma --frozen-lockfile
RUN bun run prisma generate
RUN bun build --compile --minify --sourcemap --bytecode src/index.ts --outfile ukhsc-system-api

FROM debian:bookworm-slim

WORKDIR /app

RUN apt-get update -y && \
    apt-get install -y openssl && \
    rm -rf /var/lib/apt/lists/*

COPY --from=builder /build/ukhsc-system-api ./

EXPOSE 8787

CMD ["./ukhsc-system-api"]

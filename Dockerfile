FROM oven/bun:latest

WORKDIR /app

COPY . .

RUN bun install --production
RUN bun add -d prisma --frozen-lockfile # Use version from bun.lockb
RUN bun run prisma generate
RUN bun build --compile --minify --sourcemap --bytecode src/index.ts --outfile ukhsc-system-api

EXPOSE 8787

CMD ["./ukhsc-system-api"]

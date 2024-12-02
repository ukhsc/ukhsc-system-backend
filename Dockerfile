FROM oven/bun:latest

WORKDIR /app

COPY . .

RUN bun install --production
RUN bun build --compile --minify --sourcemap --bytecode src/index.ts --outfile ukhsc-system-api

EXPOSE 8787

CMD ["./ukhsc-system-api"]

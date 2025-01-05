FROM node:20-slim

WORKDIR /app

COPY package.json pnpm-lock.yaml ./
RUN corepack enable && corepack prepare pnpm@latest --activate

COPY . .

RUN pnpm install --frozen-lockfile
RUN pnpm prisma generate
RUN pnpm build

EXPOSE 8787

CMD ["node", "dist/index.js"]

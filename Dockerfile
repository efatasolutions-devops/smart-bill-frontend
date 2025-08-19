# Tahap instalasi dependency
FROM node:20-alpine AS deps
WORKDIR /app
RUN corepack enable && corepack prepare pnpm@latest --activate
RUN apk add --no-cache chromium
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --no-frozen-lockfile

# Tahap build
FROM node:20-alpine AS builder
WORKDIR /app
RUN corepack enable && corepack prepare pnpm@latest --activate
RUN apk add --no-cache chromium
ENV PUPPETEER_SKIP_DOWNLOAD=false
ENV CHROME_EXECUTABLE_PATH=/usr/bin/chromium-browser
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN pnpm build

# Final image (production)
FROM node:20-alpine AS runner
WORKDIR /app
RUN corepack enable && corepack prepare pnpm@latest --activate
RUN apk add --no-cache chromium
ENV CHROME_EXECUTABLE_PATH=/usr/bin/chromium-browser
ENV PUPPETEER_SKIP_DOWNLOAD=false
ENV PORT=3030

# 🔽 Ini yang perlu DITAMBAHKAN:
COPY .env .env

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

EXPOSE 3030
CMD ["pnpm", "start"]
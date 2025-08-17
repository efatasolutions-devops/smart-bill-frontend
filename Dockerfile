# Tahap instalasi dependency
FROM node:20-alpine AS deps
WORKDIR /app

# Aktifkan pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

# Install chromium (dibutuhkan oleh puppeteer & html-to-image)
RUN apk add --no-cache chromium

# Copy & install
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --no-frozen-lockfile

# Tahap build
FROM node:20-alpine AS builder
WORKDIR /app

# Aktifkan pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

# Install chromium juga di builder (untuk build time)
RUN apk add --no-cache chromium

# Set environment untuk puppeteer
ENV PUPPETEER_SKIP_DOWNLOAD=false
ENV CHROME_EXECUTABLE_PATH=/usr/bin/chromium-browser

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Jalankan build
RUN pnpm build

# Final image (production)
FROM node:20-alpine AS runner
WORKDIR /app

# Aktifkan pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

# Install chromium di final image
RUN apk add --no-cache chromium

# Set environment
ENV CHROME_EXECUTABLE_PATH=/usr/bin/chromium-browser
ENV PUPPETEER_SKIP_DOWNLOAD=false
ENV PORT=3030

# Copy hasil build
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

EXPOSE 3030

CMD ["pnpm", "start"]
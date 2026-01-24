# ---- build stage ----
FROM node:22-slim AS build
WORKDIR /repo

# Copy root manifests first (better caching for workspaces)
COPY package.json package-lock.json ./

# Copy workspace package.json files (so npm can resolve workspaces)
COPY apps/api/package.json apps/api/package.json
COPY libs/shared/package.json libs/shared/package.json
COPY libs/shared/tsconfig.json libs/shared/tsconfig.json

# Install all deps (including dev) to build TypeScript
RUN npm ci

# Copy sources
COPY libs/shared libs/shared
COPY apps/api apps/api

# Build shared then API
RUN npm -w @papadata/shared run build
RUN npm -w @papadata/api run build

# ---- runtime stage ----
FROM node:22-slim AS runtime
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=8080

# Copy manifests for production install
COPY package.json package-lock.json ./
COPY apps/api/package.json apps/api/package.json
COPY libs/shared/package.json libs/shared/package.json

# IMPORTANT: copy built shared dist so workspace file: dependency resolves
COPY --from=build /repo/libs/shared/dist ./libs/shared/dist

# Install production deps
RUN npm ci --omit=dev

# Copy API build output
COPY --from=build /repo/apps/api/dist ./dist

EXPOSE 8080
CMD ["node", "dist/main.js"]

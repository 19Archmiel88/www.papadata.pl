# ---- base ----
FROM node:22-slim AS base
WORKDIR /repo
ENV CI=true \
    HUSKY=0 \
    npm_config_ignore_scripts=true
RUN corepack enable
ENV CI=1
ENV HUSKY=0

# ---- deps ----
FROM base AS deps
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/api/package.json apps/api/package.json
COPY libs/shared/package.json libs/shared/package.json
COPY libs/shared/tsconfig.json libs/shared/tsconfig.json
ENV HUSKY=0
ENV CI=true
RUN pnpm install --frozen-lockfile

# ---- build ----
FROM deps AS build
COPY libs/shared libs/shared
COPY apps/api apps/api
RUN pnpm --filter @papadata/shared build
RUN pnpm --filter @papadata/api build \
 && test -f apps/api/dist/main.js

# ---- runtime ----
FROM base AS runtime
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=8080

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/api/package.json apps/api/package.json
COPY libs/shared/package.json libs/shared/package.json
ENV HUSKY=0
ENV CI=true
RUN pnpm install --frozen-lockfile --prod --filter @papadata/api...

COPY --from=build /repo/libs/shared/dist ./libs/shared/dist
COPY --from=build /repo/apps/api/dist ./dist

EXPOSE 8080
CMD ["node", "dist/main.js"]

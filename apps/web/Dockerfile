# ---- build ----
FROM node:22-slim AS build
WORKDIR /repo
RUN corepack enable

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/web/package.json apps/web/package.json
COPY libs/shared/package.json libs/shared/package.json
COPY libs/shared/tsconfig.json libs/shared/tsconfig.json
RUN pnpm install --frozen-lockfile --filter @papadata/web...

ARG VITE_APP_ENV=stg
ARG VITE_API_BASE_URL=/api
ARG VITE_LEGAL_DOCS_BASE_URL=
ARG VITE_OBSERVABILITY_PROVIDER=none
ARG VITE_OBSERVABILITY_DSN=

ENV VITE_APP_ENV=$VITE_APP_ENV
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL
ENV VITE_LEGAL_DOCS_BASE_URL=$VITE_LEGAL_DOCS_BASE_URL
ENV VITE_OBSERVABILITY_PROVIDER=$VITE_OBSERVABILITY_PROVIDER
ENV VITE_OBSERVABILITY_DSN=$VITE_OBSERVABILITY_DSN

COPY apps/web apps/web
COPY libs/shared libs/shared
RUN pnpm --filter @papadata/web build

# ---- runtime ----
FROM nginx:1.27-alpine AS runtime
COPY apps/web/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /repo/apps/web/dist /usr/share/nginx/html
EXPOSE 8080

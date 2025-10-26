FROM node:22-bullseye AS builder
WORKDIR /app
COPY package*.json ./
COPY frontend/package*.json ./frontend/
RUN npm ci && cd frontend && npm ci
COPY . .
RUN npm run build

FROM node:22-alpine AS runtime
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=5174
COPY package*.json ./
RUN npm ci --omit=dev
COPY --from=builder /app/frontend/dist ./frontend/dist
COPY --from=builder /app/frontend/dist-ssr ./frontend/dist-ssr
COPY ./server.js ./server.js
COPY ./app ./app
COPY ./openapi.yaml ./openapi.yaml
EXPOSE 5174
CMD ["node", "server.js"]

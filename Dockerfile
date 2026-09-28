FROM node:22-bookworm-slim AS build
WORKDIR /app
RUN apt-get update && apt-get install -y --no-install-recommends openssl && rm -rf /var/lib/apt/lists/*
COPY package*.json ./
RUN npm ci
COPY backend/package*.json ./backend/
RUN cd backend && npm ci
COPY . .
RUN npm run build && cd backend && npm run build
FROM node:22-bookworm-slim AS runtime
RUN apt-get update && apt-get install -y --no-install-recommends openssl && rm -rf /var/lib/apt/lists/*
WORKDIR /app
COPY --from=build /app/dist ./dist
COPY --from=build --chown=node:node /app/backend ./backend
RUN mkdir -p /app/data && chown node:node /app/data
USER node
WORKDIR /app/backend
ENV NODE_ENV=production PORT=3000 DATABASE_URL=file:/app/data/profile.db
EXPOSE 3000
CMD ["npm", "start"]

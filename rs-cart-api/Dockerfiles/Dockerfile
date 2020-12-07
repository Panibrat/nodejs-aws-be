FROM node:12-alpine as builder
ENV PORT=8080
WORKDIR /app
COPY package*.json ./
RUN npm ci && npm cache clear --force
COPY . .
RUN npm run build
RUN npm prune --production

FROM node:12-alpine
WORKDIR /app
COPY --from=builder /app/node_modules ./node_modules/
COPY --from=builder /app/dist ./
USER node
EXPOSE 8080
ENTRYPOINT ["node", "main.js"]

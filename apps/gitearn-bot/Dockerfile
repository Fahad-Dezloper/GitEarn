FROM node:20-slim
WORKDIR /usr/src/app
COPY package.json package-lock.json ./
RUN pnpm ci --production
RUN pnpm cache clean --force
ENV NODE_ENV="production"
COPY . .
CMD [ "pnpm", "start" ]

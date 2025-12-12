# Dockerfile
FROM node:22

WORKDIR /app

# install dependencies
COPY package*.json ./
RUN npm install

# copy ALL source code (including routes with OpenAPI docs)
COPY . .

# generate prisma client
RUN npx prisma generate

# expose port 4000 (port di dalam container)
EXPOSE 4000

# start API directly from TypeScript source using tsx
CMD ["npx", "tsx", "src/server.ts"]

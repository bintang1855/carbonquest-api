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

# build TypeScript to JavaScript
RUN npm run build

# expose port 4000 (port di dalam container)
EXPOSE 4000

# start API from compiled dist folder
CMD ["node", "dist/server.js"]

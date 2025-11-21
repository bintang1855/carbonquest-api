# Dockerfile
FROM node:22

WORKDIR /app

# install dependencies
COPY package*.json ./
RUN npm install

# copy source code & prisma schema
COPY prisma ./prisma
COPY src ./src

# generate prisma client
RUN npx prisma generate

# expose port 4000 (port di dalam container)
EXPOSE 4000

# start API
CMD ["node", "src/server.js"]

FROM node:22

ENV TZ=Asia/Jakarta
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

WORKDIR /app

COPY package*.json ./
RUN npm install

# Install PM2
RUN npm install -g pm2

COPY . .

RUN npx prisma generate
RUN npm run build

EXPOSE 4000

CMD ["pm2-runtime", "dist/server.js", "-i", "max"]
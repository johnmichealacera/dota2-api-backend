FROM node:lts-alpine

WORKDIR /usr/src/app

COPY package.* .

RUN npm install

COPY . .

ENV REDIS_STRING_URL=redis://redis:6379
ENV OPEN_DOTA_API_URL=https://api.opendota.com/api
ENV DOTA_SITE=http://localhost:8080
ENV PORT=3000

RUN npm run build

EXPOSE 3000

CMD ["npm", "run", "prod"]


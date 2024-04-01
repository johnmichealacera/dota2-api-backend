FROM node:lts-alpine

WORKDIR /usr/src/app

COPY . .

# ARG MY_ENV_VARIABLE
# ENV DOTA_SITE=$MY_ENV_VARIABLE
ENV REDIS_STRING_URL=redis://redis:6379
ENV OPEN_DOTA_API_URL=https://api.opendota.com/api
ENV DOTA_SITE=http://localhost:8080
ENV PORT=3000

RUN npm install && npm run build

EXPOSE 3000

CMD ["npm", "run", "start"]


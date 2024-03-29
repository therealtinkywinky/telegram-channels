FROM node

ARG API_ID
ARG API_HASH

RUN mkdir /app
WORKDIR /app

COPY . .

RUN echo VUE_APP_API_ID=$API_ID > .env
RUN echo VUE_APP_API_HASH=$API_HASH >> .env

RUN npm install -g http-server
RUN npm install
RUN npm run build

EXPOSE 8080

CMD ["http-server", "dist"]

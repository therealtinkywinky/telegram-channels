# Telegram-Channels

## Create application

Log in at [https://my.telegram.org](https://my.telegram.org) and create an application, you will get the api_id and api_hash

## Project setup
```
docker build -t <image> --build-arg API_ID=<api_id> --build-arg API_HASH=<api_hash> https://github.com/therealtinkywinky/telegram-channels.git

docker run -d -p <port>:8080 <image>
```

## Go for it!

Point your browser to localhost:<port>

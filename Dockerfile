FROM node:18
RUN mkdir /app
WORKDIR /app
COPY . /app/
RUN yarn install && yarn cache clean

ENTRYPOINT ["yarn", "start"]

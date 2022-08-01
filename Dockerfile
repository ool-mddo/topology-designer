FROM node:18
RUN mkdir /app
WORKDIR /app
COPY package.json /app
COPY yarn.lock /app
RUN yarn install
ENTRYPOINT ["yarn", "start"]

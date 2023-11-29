FROM node:16-alpine

WORKDIR /usr/src/app

COPY package*.json ./

RUN apk --no-cache add curl

RUN npm install

RUN npm run tsc

COPY . .

EXPOSE 3000

CMD ["npm", "run", "start:docker-prod"]

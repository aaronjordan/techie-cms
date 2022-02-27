FROM node:16-alpine

WORKDIR /nest

COPY tsconf*.json .
COPY nest-cli.json .
COPY package.json .
RUN npm install

COPY src src
RUN npm run build

EXPOSE 3000

CMD ["npm", "run", "start:prod"]
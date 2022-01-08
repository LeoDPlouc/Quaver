FROM node:16-alpine
WORKDIR /app

RUN apt install libchromaprint-tools 

COPY package.json .
RUN npm install --only=prod

COPY ./dist .

ENV PORT 3000
EXPOSE $PORT
CMD ["node", "index.js"]
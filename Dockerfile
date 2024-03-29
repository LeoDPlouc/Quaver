FROM node:17
WORKDIR /app

RUN apt update && apt -y install libchromaprint-tools 

COPY package.json .
RUN npm install --only=prod

COPY ./dist .

ENV PORT 8080
EXPOSE $PORT
CMD ["node", "index.js"]
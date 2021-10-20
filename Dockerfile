FROM node:16-alpine
WORKDIR /app

RUN npm install -g typescript

COPY package.json .
RUN npm install

COPY tsconfig.json .
COPY src ./src

RUN tsc
RUN mv build/* .

RUN rm -r build
RUN rm -r src/

COPY res ./res

ENV PORT 3000
EXPOSE $PORT
CMD ["node", "index.js"]
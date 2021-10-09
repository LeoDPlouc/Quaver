FROM node:16-alpine
WORKDIR /app

COPY package.json .
#RUN npm install
COPY node_modules ./node_modules

#RUN "npm install -g typescript"

#COPY src/ ./src
COPY tsconfig.json .
COPY build .

#RUN "tsc"

ENV PORT 3000
EXPOSE $PORT
CMD ["node", "index.js"]
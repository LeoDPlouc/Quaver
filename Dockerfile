FROM node:16-alpine
WORKDIR /app
COPY package.json .

ARG DEV_ENV
RUN if [ "$DEV_ENV" = "1" ]; \
    then npm install; \
    else npm install --only=production; \
    fi

COPY . ./
ENV PORT 3000
EXPOSE $PORT
CMD ["node", "index.js"]
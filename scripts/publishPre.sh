npm run build &&\
\
docker build -t dplouc/quaver:$1 -t dplouc/quaver:pre:latest . &&\
\
docker push dplouc/quaver:pre:latest
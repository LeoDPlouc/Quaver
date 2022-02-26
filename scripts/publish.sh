npm run build &&\
\
rm -vr publish &&\
\
mkdir -v publish &&\
mkdir -v publish/src &&\
\
cp -vr dist/* publish/src &&\
\
tar -cvzf ./publish/quaver-$1.tar.gz  --transform='s,publish/src,dist/,' ./publish/src/ &&\
\
rm -vr publish/src/src &&\
tar -cvzf ./publish/quaver-$1-hl.tar.gz  --transform='s,publish/src,dist/,' ./publish/src/ &&\
\
rm -vr publish/src &&\
\
cp -vr dist publish &&\
\
docker build -t dplouc/quaver:$1 -t dplouc/quaver:latest . &&\
\
rm -vr dist/src &&\
docker build -t dplouc/quaver:$1-hl . &&\
\
rm -vr dist &&\
mv publish/dist dist &&\
\
docker push dplouc/quaver:latest &&\
docker push dplouc/quaver:$1 &&\
docker push dplouc/quaver:$1-hl
npm run build &&\
\
rm -vfr publish &&\
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
sudo docker build -t dplouc/quaver:$1 -t dplouc/quaver:latest . &&\
\
rm -vr dist/src &&\
sudo docker build -t dplouc/quaver:$1-hl . &&\
\
rm -vr dist &&\
mv publish/dist dist &&\
\
sudo docker push dplouc/quaver:latest &&\
sudo docker push dplouc/quaver:$1 &&\
sudo docker push dplouc/quaver:$1-hl
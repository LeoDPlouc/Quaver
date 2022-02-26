rm -vr build &&\
rm -vr dist &&\
\
mkdir -v build &&\
mkdir -v dist &&\
\
tsc -b --verbose &&\
\
mv -v ./build/* dist/ &&\
\
npx webpack --config webpack.config.js && \
mkdir -v dist/src &&\
mv -v ./build/ dist/src/js &&\
cp -v ./front/index.html ./dist/src &&\
cp -vr ./front/img ./dist/src &&\
cp -v ./changelog.txt ./dist/changelog.txt &&\
cp -v ./LICENSE ./dist/LICENCE
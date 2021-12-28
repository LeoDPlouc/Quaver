rm -vr build
rm -vr dist

mkdir -v build
mkdir -v dist

tsc -b --verbose

mv -v ./build/* dist/

npx webpack --config webpack.config.js 
mv -v ./build/ dist/src
cp -v ./front/index.html ./dist/src
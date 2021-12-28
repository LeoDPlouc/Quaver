const path = require("path")
const { VueLoaderPlugin } = require("vue-loader")

module.exports = {
    entry: "./front/src/app.ts",
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                loader: 'ts-loader',
                options: {
                    appendTsSuffixTo: [/\.vue$/]
                },
                // exclude: /node_modules/
            },
            {
                test: /\.vue$/,
                loader: 'vue-loader'
            },
            {
                test: /\.css$/,
                use: ["vue-style-loader", "css-loader"]
            }
        ]
    },
    plugins: [
        new VueLoaderPlugin()
    ],
    resolve: {
        extensions: ['.tsx', '.ts', '.js', '.vue']
    },
    output: {
        filename: "app.js",
        path: path.resolve(__dirname, "build")
    }
}
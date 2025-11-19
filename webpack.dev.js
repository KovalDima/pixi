const { merge } = require("webpack-merge");
const common = require("./webpack.common.js");
const path = require("path");
const webpack = require("webpack");

module.exports = merge(common, {
    mode: "development",
    devtool: "inline-source-map",
    devServer: {
        static: {
            directory: path.join(__dirname, "dist"),
        },
        compress: true,
        port: 3000,
        open: true,
        hot: true,
        watchFiles: ["src/**/*"],
    },
    plugins: [
        new webpack.DefinePlugin({
            "__DEV__": true
        }),
    ],
});
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");

module.exports = {
    entry: "./src/ts/index.ts",
    output: {
        filename: "js/[name].[contenthash].js",
        path: path.resolve(__dirname, "dist"),
        clean: true,
    },
    module: {
        rules: [
            {
                test: /\.ts$/,
                use: "ts-loader",
                include: path.resolve(__dirname, "src/ts"),
                exclude: /node_modules/,
            },
        ],
    },
    resolve: {
        extensions: [".ts", ".js"],
        alias: {
            "res": path.resolve(__dirname, "../resources")
        }
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: "./src/index.html",
            filename: "index.html",
        }),
        new CopyPlugin({
            patterns: [
                {
                    context: path.resolve(__dirname, "src"),
                    from: "**/*",
                    to: "[path][name][ext]",
                    globOptions: {
                        ignore: ["**/ts/**", "**/index.html"],
                    },
                },
                {
                    from: path.resolve(__dirname, "../resources"),
                    to: "resources"
                }
            ],
        }),
    ],
};

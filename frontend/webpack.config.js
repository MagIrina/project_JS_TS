const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require("copy-webpack-plugin");

module.exports = {
    entry: './src/app.js',
    mode: 'development',
    output: {
        filename: 'app.js',
        path: path.resolve(__dirname, 'dist'),
        publicPath: '/',
    },
    devServer: {
        static: {
            directory: path.join(__dirname, 'public'),
        },
        compress: true,
        port: 9002,
        historyApiFallback: true,
    },
    module: {
        rules: [
            {
                test: /\.s[ac]ss$/i,
                use: [
                    "style-loader",
                    "css-loader",
                    "sass-loader",
                ],
            },
        ],
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: "./index.html",
            baseUrl: '/'
        }),

        new CopyPlugin({
            patterns: [
                {from: "./src/templates", to: "templates"},
                {from: "./src/static/images", to: "images"},
                {from: "./src/plugins/fontawesome-free/webfonts", to: "webfonts"},

                {from: "./src/plugins/fontawesome-free/css/all.min.css", to: "css"},
                {from: "./src/plugins/bootstrap-slider/bootstrap-slider.min.css", to: "css"},
                {from: "./src/plugins/chart.js/Chart.min.css", to: "css"},
                {from: "./src/plugins/bootstrap/bootstrap.min.css", to: "css"},
                {from: "./src/plugins/bootstrap/bootstrap-icons.css", to: "css"},
                {from: "./src/plugins/icheck-bootstrap/icheck-bootstrap.min.css", to: "css"},

                {from: "./src/plugins/jquery/jquery.min.js", to: "js"},
                {from: "./src/plugins/bootstrap/bootstrap.min.js", to: "js"},
                {from: "./src/plugins/bootstrap/bootstrap.bundle.min.js", to: "js"},
                {from: "./src/plugins/bootstrap/collapse.js", to: "js"},
                {from: "./src/plugins/bootstrap/popper.min.js", to: "js"},
                {from: "./src/plugins/chart.js/Chart.min.js", to: "js"},
                {from: "./src/plugins/chart.js/Chart.bundle.min.js", to: "js"},
                {from: "./src/plugins/bootstrap-slider/bootstrap-slider.min.js", to: "js"}
            ],
        }),
    ],
};
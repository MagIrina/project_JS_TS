const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require("copy-webpack-plugin");

module.exports = {
    entry: './src/app.ts',
    devtool: 'inline-source-map',
    mode: "development",
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
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
    resolve: {
        extensions: ['.tsx', '.ts', '.js'],
    },
    output: {
        filename: 'app.js',
        path: path.resolve(__dirname, 'dist'),
        publicPath: '/',
        clean: true,
    },
    devServer: {
        static: path.join(__dirname, 'dist'),
        compress: true,
        port: 9002,
        // historyApiFallback: true,
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: "./index.html"
        }),

        new CopyPlugin({
            patterns: [
                {from: "./src/templates", to: "templates"},
                {from: "./src/styles", to: "styles"},
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
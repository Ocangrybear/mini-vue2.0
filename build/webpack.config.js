const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
module.exports = {
    entry: "./src/index.js",  // 入口文件
    output: {
        filename: "main.js"  // 出口文 件
    },
    resolve: {
        extensions: ['.ts', '.tsx', '.js']  // 自动解析文件拓展
    },
    module: {
        rules: [{
            test: /\.exec\.js$/,
            use: [ 'script-loader' ],
            exclude: /node_modules/
        }]
    },
    devtool: process.env.NODE_ENV === 'production' ? false : 'inline-source-map',
    devServer: {
        contentBase: './dist',
        stats: 'errors-only',
        compress: false,  //不启动压缩
        host: 'localhost',
        port: 8090
    },
    plugins: [
        new CleanWebpackPlugin(),
        new HtmlWebpackPlugin({
            template: './src/index.html'
        })
    ]
}
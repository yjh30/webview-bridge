const path = require("path");
const HtmlWebpackPlugin = require('html-webpack-plugin');

function getIPAdress() {
    var interfaces = require('os').networkInterfaces();
    for (var devName in interfaces) {
        var iface = interfaces[devName];
        for (var i = 0; i < iface.length; i++) {
            var alias = iface[i];
            if (alias.family === 'IPv4' && alias.address !== '127.0.0.1' && !alias.internal) {
                return alias.address;
            }
        }
    }
}

module.exports = {
    entry: './example/index.js',
    output: {
        path: path.resolve(__dirname, './dist'),
        filename: 'index.js'
    },
    module: {
        rules: [
            {
                test: /\.css$/,
                loader: ['style-loader', 'css-loader']
            },
            {
                test: /\.js$/,
                loader: ['babel-loader']
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            filename: `../dist/example/index.html`,
            template: `./example/index.html`
        })
    ],
    devServer: {
        host: getIPAdress()
    }
};
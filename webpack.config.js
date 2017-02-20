var webpack = require('webpack');
var path = require('path');

module.exports = {
    entry: {
        app: "./public/app/app.js"
    },
    output: {
        filename: "public/build/bundle.js",
        sourceMapFilename: "public/build/bundle.map"
    },
    devtool: "#source-map",
    module: {
        loaders: [
            {
                test: /\.jsx?$/,
                exclude: '/(node_modules|bower_components)/',
                loader: 'babel',
                query: {
                    presets: ['react', 'es2015'],
                    plugins: ['babel-plugin-transform-decorators-legacy']
                }
            },
            {
                test: /\.json$/,
                loader: 'json'
            }
        ]
    }
};
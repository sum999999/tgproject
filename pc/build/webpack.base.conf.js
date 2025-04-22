'use strict'
const path = require('path')
const utils = require('./utils')
const config = require('../config')
const vueLoaderConfig = require('./vue-loader.conf')

function resolve(dir) {
    return path.join(__dirname, '..', dir)
}
// 查看打包性能
// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer')
//     .BundleAnalyzerPlugin

module.exports = {
    // 查看打包性能
    // plugins: [new BundleAnalyzerPlugin()],
    context: path.resolve(__dirname, '../'),
    entry: {
        // app: './src/main.js'
        app: ['babel-polyfill', './src/main.js']
    },
    output: {
        path: config.build.assetsRoot,
        filename: '[name].js',
        publicPath:
            process.env.NODE_ENV === 'production'
                ? config.build.assetsPublicPath
                : config.dev.assetsPublicPath
    },
    resolve: {
        extensions: ['.js', '.vue', '.json', '.css', '.less'],
        alias: {
            vue$: 'vue/dist/vue.esm.js',
            '@': resolve('src'),
            ryEmoji: resolve('/static/js/RongEmoji-2.2.7.min.js'),
            ryVoice: resolve('/static/js/RongIMVoice-2.2.6.js'),
            RCS: resolve('/static/js/qiniu-upload.js')
        }
    },
    module: {
        rules: [
            {
                // 5.28增加
                test: /\.less$/,
                loader: 'style-loader!css-loader!less-loader'
            },

            {
                test: /\.vue$/,
                loader: 'vue-loader',
                options: vueLoaderConfig
            },
            {
                test: /\.js$/,
                loader: 'babel-loader',
                exclude: /node_modules/,
                include: [resolve('src'), resolve('test')]
            },
            {
                test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
                loader: 'url-loader',
                options: {
                    limit: 10000,
                    name: utils.assetsPath('img/[name].[hash:7].[ext]')
                }
            },
            {
                test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
                loader: 'url-loader',
                options: {
                    limit: 10000,
                    name: utils.assetsPath('media/[name].[hash:7].[ext]')
                }
            },
            {
                test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
                loader: 'url-loader',
                options: {
                    limit: 10000,
                    name: utils.assetsPath('fonts/[name].[hash:7].[ext]')
                }
            },
            {
                test: /iview.src.*?js$/,
                loader: 'babel-loader'
            }
        ]
    }
}

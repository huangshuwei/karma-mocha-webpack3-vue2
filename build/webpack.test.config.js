var path = require("path");
const autoprefixer = require('autoprefixer')
const px2rem = require('postcss-px2rem')
var webpack = require("webpack");

var ExtractTextPlugin = require('extract-text-webpack-plugin');

function resolve (dir) {

    return path.join(__dirname, '..', dir)
}

var webpackConfig  = {

    module: {

        rules:[

         /*   {
                test: /\.(js|vue)$/,
                use:{
                    loader: 'eslint-loader',
                    options: {
                        formatter: require('eslint-friendly-formatter')
                    }
                }
            },*/

            // babel-loader
            {
                test: /\.js$/,
                use: 'babel-loader',
                include: [resolve('src'), resolve('test')]
            },

            // 为了统计代码覆盖率，对 js 文件加入 istanbul-instrumenter-loader
            {
                test: /\.(js)$/,
                loader: 'istanbul-instrumenter-loader',
                exclude: /node_modules/,
                include: /src|packages/,
                enforce: 'post',
                options: {
                    esModules: true
                }
            },

            // vue loader
            {
                test: /\.vue$/,
                loaders: [{
                    loader: 'vue-loader',
                    options: {
                        postcss: [autoprefixer({browsers: ['> 1%', 'ie >= 9', 'iOS >= 6', 'Android >= 2.1']}), px2rem({remUnit: 75})],
                        // 为了统计代码覆盖率，对 vue 文件加入 istanbul-instrumenter-loader
                        preLoaders: {
                            js: 'istanbul-instrumenter-loader?esModules=true'
                        }
                    }
                }]
            },

            // css loader
            {
                test: /\.css$/,
              /*  use: [
                    'style-loader',
                    'css-loader'
                ],*/
                use:ExtractTextPlugin.extract({
                    use: 'css-loader',
                    fallback: 'vue-style-loader'
                })
            },

            // img loader
            {
                test: /\.(png|gif|jpe?g)(\?\S*)?$/,
                use: [{
                    loader: 'url-loader',
                    options: {
                        /*
                         *  limit=10000 ： 10kb
                         *  图片小于10kb 采用内联的形式，否则输出图片
                         * */
                        limit: 10000,
                        name: 'images/[name]-[hash:8].[ext]'
                    }
                }]
            },

            // font loader
            {
                test: /\.(eot|woff|woff2|ttf|svg)(\?\S*)?$/,
                use: [{
                    loader: 'url-loader',
                    options: {
                        limit: 5000,
                        name: 'font/[name]-[hash:8].[ext]'
                    }
                }]

            },
        ]
    },

    resolve:{
        extensions: ['.js', '.vue', '.json'],
        alias: {
            'vue$': 'vue/dist/vue.esm.js', // 'vue/dist/vue'
            '@': resolve('src'),
        }

    },

    plugins: [
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: '"production"'
            }
        })
    ]

}

module.exports = webpackConfig
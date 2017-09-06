var path = require("path");
var webpack = require("webpack");
var WebpackNotifierPlugin = require("webpack-notifier");
var HtmlWebpackPlugin = require('html-webpack-plugin');
var CleanWebpackPlugin = require('clean-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var WebpackLoggerPlugin = require('webpack-logger-plugin');
var ParallelUglifyPlugin = require('webpack-parallel-uglify-plugin');

var config = {
    "app": path.join(__dirname, "/app"),
    "host": (process.env.HOST || "localhost"),
    "port": (process.env.PORT || 3000),
    "apiHost": (process.env.APIHOST || "/src"),
    "apiPort": (process.env.APIPORT || 3030),
    "web": path.join(__dirname, '/web/build')
};

module.exports = {
    context: config.app,
    entry: {
        app: "index.js",
        vendor: "vendors/index.js"
    },
    devServer: {
        contentBase: config.web,
        historyApiFallback: true,
        headers: {'Access-Control-Allow-Origin': '*'},
        host: config.host,
        port: config.port
    },
    output: {
        path: config.web + '/src',
        publicPath: config.apiHost + "/",
        filename: '[name].[hash].js',
        chunkFilename: '[name].[chunkhash:8].chunk.js'
    },
    module: {
        loaders: [
            {test: /\.js$/, loader: 'react-hot!babel', exclude: /node_modules/, include: __dirname},
            {test: /\.js$/, loader: 'babel', include: config.app},
            //{test:/\.jsx?$/, loader:'babel', exclude: /node_modules/},
            // {test: /(\.css|\.scss)$/, loaders: ['style', 'css', 'sass']},
            {test: /(\.css|\.scss)$/, loader: ExtractTextPlugin.extract('style', 'css!sass')},
            {test: /\.(png|gif|jpe?g|svg)$/, loader: "url?limit=10000&name=[name].[ext]"},
            {test: /\.(ttf|eot|woff|woff2|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: "url"},
            {test: /\.html$/, loader: 'html'},
            {test: /\.json$/, loader: "json"}
        ],
        preLoaders: [
            //{test: /\.jsx/, loader: 'babel!baggage?[file].html=template&[file].scss', exclude:/node_modules/}
        ]
    },
    resolve: {
        root: __dirname,
        modulesDirectories: [
            'app',
            'node_modules'
        ],
        extensions: ['', '.json', '.js', '.jsx']
    },
    plugins: [
        new CleanWebpackPlugin(config.web, {
            exclude: ['editServer.js', 'start.sh', 'package.json', 'node_modules', 'logs']
        }),
        new ExtractTextPlugin("[name].[hash].css", {allChunks: true}),
        new WebpackNotifierPlugin(),
        new HtmlWebpackPlugin({
            title: "内容管理系统 - VCG © 视觉中国",
            favicon: "favicon.ico",
            template: config.app + '/assets/index.template.html',
            filename: "../index.html"
        }),
        //new webpack.BannerPlugin('test vcg')

        // optimizations
        // new webpack.optimize.DedupePlugin(),
        new webpack.optimize.OccurrenceOrderPlugin(),
        // new webpack.optimize.UglifyJsPlugin({
        //     compressor: {
        //         warnings: false,
        //         drop_debugger: true,
        //         drop_console: true
        //     }
        // }),

        new ParallelUglifyPlugin({
            cacheDir: '.cache/',
            uglifyJS:{
                output: {
                    comments: false
                },
                compress: {
                    warnings: false
                }
            }
        }),

        new webpack.optimize.CommonsChunkPlugin({name: 'vendor'}),

        new webpack.NoErrorsPlugin(),
        new webpack.HotModuleReplacementPlugin(),
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
        }),

        new WebpackLoggerPlugin(),

        new webpack.ProgressPlugin(function handler(percentage, msg) {
            const percent = Math.round(percentage * 10000)/100;
            console.log(percent+'% -- '+msg);
        })
    ]
};

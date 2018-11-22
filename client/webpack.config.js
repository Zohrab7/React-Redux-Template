const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const WebpackMd5Hash = require('webpack-md5-hash');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const WebpackBar = require('webpackbar');

require('dotenv').config();

console.log('PORT', process.env.PORT);

module.exports = (env = {}, argv) => {
    const isProduction = argv.mode === 'production';

    const config = {
        mode: argv.mode,
        entry: {
            main: './src/web/index'
        },
        output: {
            path: path.resolve(__dirname, '../client-build'),
            publicPath: '/',
            filename: 'js/[name].[hash].js'
        },
        devServer: {
            contentBase: path.join(__dirname, "src"),
            compress: true,
            historyApiFallback: true,
            overlay: true,
            disableHostCheck: true, // TODO: Это не безопасно сделать по нормальному когда не будет припекать
            headers: {
                'Access-Control-Allow-Origin': '*'
            },

            public: process.env.APP_URL,
            port: process.env.PORT,
            watchOptions: {
                aggregateTimeout: 500,
                ignored: /node_modules/,
                poll: 2000,
            }
        },
        resolve: {
            alias: {
                // CORE
                hocs: path.resolve(__dirname, 'src/hocs/'),
                utils: path.resolve(__dirname, 'src/utils/'),
                fonts: path.resolve(__dirname, 'src/fonts/'),
                store: path.resolve(__dirname, 'src/store/'),
                actions: path.resolve(__dirname, 'src/actions/'),
                reducers: path.resolve(__dirname, 'src/reducers/'),
                requester: path.resolve(__dirname, 'src/requester/'),
                middlewares: path.resolve(__dirname, 'src/middlewares/'),

                //WEB
                containers: path.resolve(__dirname, 'src/web/containers/'),
                components: path.resolve(__dirname, 'src/web/components/'),
                routes: path.resolve(__dirname, 'src/web/routes/'),
                images: path.resolve(__dirname, 'src/web/images/'),
                styles: path.resolve(__dirname, 'src/web/styles/'),
                pages: path.resolve(__dirname, 'src/web/pages/'),
                // configs: path.resolve(__dirname, 'src/configs/'),
            },
            extensions: ['.js', '.json', '.scss']
        },
        module: {
            rules: [
                {
                    test: /\.(css)$/,
                    // exclude: [/node_modules/, /public/],
                    use: [
                        'style-loader', {
                            loader: 'css-loader',
                            options: {
                                modules: true,
                                sourceMap: !isProduction,
                                importLoaders: 1,
                                localIdentName: '[local]'
                            }
                        }
                    ]
                }, {
                    test: /\.(s[ac]ss)$/,
                    use: ExtractTextPlugin.extract({
                        use: [
                            {
                                loader: 'css-loader',
                                options: {
                                    sourceMap: !isProduction
                                }
                            }, {
                                loader: 'sass-loader',
                                options: {
                                    outputStyle: 'expanded',
                                    sourceMap: !isProduction
                                }
                            }
                        ]
                    })
                }, {
                    test: /\.(js)$/,
                    exclude: [
                        /node_modules/, /public/
                    ],
                    use: {
                        loader: 'babel-loader',
                        options: {
                            presets: ['react', 'stage-2']
                        }
                    }
                },
                // {
                //     test: /\.(base64.gif|base64.png|base64.jpe?g|base64.svg|base64.webp)$/i,
                //     use: 'base64-inline-loader?limit=1000&name=[name].[ext]'
                // },
                {
                    test: /\.(gif|png|jpg|svg)$/i,
                    // exclude: /fonts|\.(base64.gif|base64.png|base64.jpe?g|base64.svg|base64.webp)/,
                    use: [
                        {
                            loader: 'file-loader',
                            options: {
                                name: '[path][name].[ext]',
                                // publicPath: './', // use relative urls
                                outputPath: 'images/'
                            }
                        },
                        {
                            loader: 'image-webpack-loader',
                            options: {
                                bypassOnDebug: !isProduction,
                                mozjpeg: {
                                    progressive: true,
                                    quality: 65
                                },
                                optipng: {
                                    enabled: false
                                },
                                pngquant: {
                                    quality: '65-90',
                                    speed: 4
                                },
                                gifsicle: {
                                    interlaced: false
                                },
                            }
                        }
                    ]
                },
                {
                    test: /.(ttf|otf|eot|svg|woff(2)?)(\?[a-z0-9]+)?$/,
                    exclude: /images/,
                    use: [{
                        loader: 'file-loader',
                        options: {
                            name: '[name].[ext]',
                            outputPath: 'fonts/',
                        }
                    }],
                },
            ]
        },
        externals: {
            // 'configs/index.conf.js': 'index_config',
        },
        optimization: {
            minimize: isProduction,
            minimizer: [
                new UglifyJsPlugin({
                    exclude: [
                        /\.conf.js/, /node_modules/
                    ],
                    sourceMap: !isProduction,
                    parallel: true,
                    uglifyOptions: {
                        parse: {
                            ecma: 6
                        },
                        compress: {
                            ecma: 5,
                            warnings: false,
                            comparisons: false
                        },
                        mangle: {
                            safari10: false
                        },
                        output: {
                            ecma: 5,
                            comments: false,
                            ascii_only: true
                        }
                    }
                }),
            ],
            splitChunks: {
                chunks: 'async',
                minSize: 30000,
                // maxSize: 0,
                minChunks: 1,
                maxAsyncRequests: 5,
                maxInitialRequests: 3,
                automaticNameDelimiter: '~',
                name: 'bundle',
                cacheGroups: {
                    default: false
                }
            }
        },
        plugins: (() => {
            const common = [
                new WebpackBar({color: '#5C95EE'}),
                new webpack.DefinePlugin({
                    'process.env': {
                        'PLANFORM_ENV': JSON.stringify(process.env.PLANFORM_ENV),
                        'NODE_ENV': JSON.stringify(argv.mode),
                        'APP_URL': JSON.stringify(process.env.APP_URL),
                        'API_URL': JSON.stringify(process.env.API_URL),
                        'PORT': JSON.stringify(process.env.PORT)
                    }
                }),
                new WebpackMd5Hash(),
                new ExtractTextPlugin({filename: 'css/style.[hash].css', disable: false, allChunks: true}),
                new HtmlWebpackPlugin({
                    inject: false,
                    hash: true,
                    template: path.resolve(__dirname, 'public/index.html'),
                    // favicon: './src/web/images/favicon.ico',
                    filename: 'index.html'
                }),
            ];

            const production = [
                new CleanWebpackPlugin('../client-build', {}),
            ];

            return isProduction
                ? common.concat(production)
                : common
        })(),

        devtool: (() => {
            return isProduction
                ? '' // 'hidden-source-map'
                : 'source-map'
        })()
    };

    return config
}

const path = require('path');
const HtmlWebPackPlugin = require("html-webpack-plugin");

module.exports = {
    mode: 'development',
    devtool: 'inline-source-map',
    entry: {
        polyfills: [
            'babel-polyfill'
        ],
        app: [
            './src/index.js'
        ]
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: 'babel-loader',
                options: {
                    babelrc: false,
                    presets: [
                        require.resolve('babel-preset-flow'),
                        require.resolve('babel-preset-react'),
                        [require.resolve('babel-preset-env'), { targets: { browsers: ['last 2 versions', 'ie >= 11', 'safari >= 9'] }, modules: false }]
                    ],
                    plugins: [
                        require.resolve('babel-plugin-syntax-dynamic-import'),
                        require.resolve('babel-plugin-syntax-object-rest-spread'),
                        require.resolve('babel-plugin-transform-object-rest-spread'),
                        require.resolve('babel-plugin-syntax-class-properties'),
                        require.resolve('babel-plugin-transform-class-properties'),
                        require.resolve('babel-plugin-syntax-export-extensions'),
                        require.resolve('babel-plugin-transform-export-extensions')
                    ]
                }
            },
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader?modules=true']
            },
            {
                test: /\.css$/,
                include: ['src'],
                use: [
                    'style-loader',
                    {
                        loader: 'css-loader',
                        options: {
                            importLoaders: 1,
                            modules: true,
                            localIdentName: '[name]-[local]-[hash:base64:4]'
                        }
                    },
                    {
                        loader: 'postcss-loader',
                        options: {
                            // Necessary for external CSS imports to work
                            // https://github.com/facebookincubator/create-react-app/issues/2677
                            ident: 'postcss',
                            plugins: [
                                require('autoprefixer')
                            ]
                        }
                    }
                ]
            },
            // {
            //     test: /\.(png|jpg|gif|svg|woff|woff2)$/,
            //     include: source,
            //     loader: 'url-loader',
            //     options: {
            //         limit: 100000
            //     }
            // }
            // {
            //     test: /\.html$/,
            //     use: [
            //         {
            //             loader: "html-loader"
            //         }
            //     ]
            // }
        ]
    },
    plugins: [
        new HtmlWebPackPlugin({
            template: "./src/index.html",
            minify: {
                removeComments: true,
                collapseWhitespace: true,
                removeRedundantAttributes: true,
                useShortDoctype: true,
                removeEmptyAttributes: true,
                removeStyleLinkTypeAttributes: true,
                keepClosingSlash: true,
                minifyJS: true,
                minifyCSS: true,
                minifyURLs: true
            },
            inject: true
        })
    ]
};
import webpack from 'webpack';
import path from 'path';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import CopyPlugin from "copy-webpack-plugin";

export type BuildMode = 'production' | 'development';

export interface BuildEnv {
    mode: BuildMode;
    port: number;
}

export default (env: BuildEnv) => {
    const mode = env.mode || 'development';
    const PORT = env.port || 3000;

    const isDev = mode === 'development';

    return {
        mode: mode,
        devtool: isDev ? 'inline-source-map' : undefined,
        entry: path.resolve(__dirname, 'src', 'index.ts'),
        output: {
            filename: "[name].[contenthash].js",
            path: path.resolve(__dirname, 'dist'),
            clean: true,
        },
        plugins: [
            new HtmlWebpackPlugin({
                template: path.resolve(__dirname, 'src', 'index.html'),
                favicon: path.resolve(__dirname, 'src', 'favicon.ico'),
            }),
            new webpack.ProgressPlugin(),
            new MiniCssExtractPlugin({
                filename: 'css/[name].[contenthash:8].css',
                chunkFilename: 'css/[name].[contenthash:8].css',
            }),
            new webpack.HotModuleReplacementPlugin(),
            new CopyPlugin({
                patterns: [
                    { from: "./src/assets", to: "./assets", },
                    { from: './src/index.css', to: './' },
                ],
            }),
        ],
        module: {
            rules:[
                {
                    test: /\.(s[ac]ss|css)$/i,
                    use: [
                        isDev ? 'style-loader' : MiniCssExtractPlugin.loader,
                        {
                            loader: "css-loader",
                            options: {
                                modules: {
                                    auto: (resPath: string) => Boolean(resPath.includes('.module.')),
                                    localIdentName: isDev ? '[path][name]__[local]' : '[hash:base64:8]'
                                },
                                
                            }
                        },
                        "sass-loader",
                    ],
                },
                {
                    test: /\.tsx?$/,
                    use: 'ts-loader',
                    exclude: /node_modules/,
                },
                {
                    test: /\.(png|jpe?g|gif|ttf)$/i,
                    loader: 'file-loader',
                    options: {
                        name: '[path][name].[ext]',
                    },
                }
            ]
        },
        resolve: {
            extensions: ['.ts', '.js', 'json'],
        },
        devServer: isDev ? {
            port: PORT,
            open: true,
            historyApiFallback: true,
            hot: true,
        } : undefined,
    };
};
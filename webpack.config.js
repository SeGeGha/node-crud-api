import path from 'path';
import { fileURLToPath } from 'url';
import { CleanWebpackPlugin } from'clean-webpack-plugin';
import nodeExternals from 'webpack-node-externals';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default {
    entry: './src/index.ts',
    externalsPresets: {
        node: true
    },
    externals: [
        nodeExternals()
    ],
    module: {
        rules: [
            {
                test: /\.ts?$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
        ],
    },
    resolve: {
        extensions: ['.ts', '.js'],
    },
    output: {
        filename: 'main.cjs',
        path: path.resolve(__dirname, 'dist'),
    },
    plugins: [
        new CleanWebpackPlugin(),
    ],
};

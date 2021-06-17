const webpack = require('webpack')
const path = require('path')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

const prodMode = process.env.NODE_ENV === 'production'
const devMode = process.env.NODE_ENV === 'development'

// const filename = ext => devMode ? `bundle.${ext}`: `bundle.[hash].${ext}`

// plugins
const plugins = [
	new CleanWebpackPlugin(),
	new HtmlWebpackPlugin({
		template: 'src/index.html',
		minify: {
			removeComments: prodMode,
			collapseWhitespace: prodMode
		}
	}),
	new CopyWebpackPlugin({
		patterns: [
			{
				from: path.resolve(__dirname, 'src/favicon.ico'),
				to: path.resolve(__dirname, 'dist')
			},
		]
	}),
	new MiniCssExtractPlugin({
		filename: 'bundle.[hash].css',
		chunkFilename: '[id].css'
	}),
	new webpack.HotModuleReplacementPlugin(),
]

// js loaders
const jsLoaders = [
	{
		loader: 'babel-loader',
		options: {
			presets: ['@babel/preset-env']
		}
	}
]
if (devMode) {
	jsLoaders.push('eslint-loader')
}

module.exports = {
	mode: 'development',
	target: 'web',
	entry: {
		main: ['@babel/polyfill', path.resolve(__dirname, 'src/index.js')]
	},
	output: {
		filename: 'bundle.[hash].js',
		path: path.resolve(__dirname, 'dist'),
	},
	resolve: {
		extensions: ['.js'],
		alias: {
			'@': path.resolve(__dirname, 'src'),
			'@core': path.resolve(__dirname, 'src/core'),
		}
	},
	devtool: devMode ? 'source-map': false,
	devServer: {
		historyApiFallback: true,
		port: 3000,
		hot: true,
		static: true,
	},
	plugins,
	module: {
		rules: [
			{
				test: /\.s[ac]ss$/i,
				use: [
					MiniCssExtractPlugin.loader,
					'css-loader',
					'sass-loader',
				]
			},
			{
				test: /\.js$/,
				exclude: /node_modules/,
				use: jsLoaders
			}
		]
	},
}

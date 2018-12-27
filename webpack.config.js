var HtmlWebpackPlugin = require('html-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');

const path = require('path');

module.exports = {
	mode: "development",
  	entry: './src/web.js',
	optimization: {
	    //minimizer: [
	    //  new TerserPlugin({ /* your config */ })
	    // ]
	},
	devtool: 'inline-source-map',

	devServer: {
	    contentBase: path.join(__dirname, 'dist'),
	    compress: true,
	    port: 9000
	 },

  	output: {
    	filename: 'cwvbundle.js',
    	path: path.resolve(__dirname, 'dist')
  	},
  	plugins: [new HtmlWebpackPlugin()]

};

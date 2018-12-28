var HtmlWebpackPlugin = require('html-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin')


const path = require('path');
// console.log("path=="+path+"===>"+path.resolve(__dirname, "keystore"))
module.exports = {
	mode: "development",
  	entry: './src/index.js',
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
 	module: {
	    rules: [
	      {//load keystore
	        test: /\.(json)$/,
	        include:[path.resolve(__dirname, "keystore")],
	       	loader: 'file-loader',
            options: {
            	outputPath:'keystore'
            }
	      },
	      {
	        test: /\.(png|jpg|gif|proto)$/,
	       	loader: 'file-loader',
	       	include:[path.resolve(__dirname, "src/cwv/proto")],
            options: {
            	outputPath:'pbs'
            }
	      },
	      
	    ],
	 },
	resolve: {//import的时候不需要加上js
   		 extensions: ['.wasm', '.mjs', '.js', '.json']
  	},
  	output: {
    	filename: 'cwvbundle.js',
    	path: path.resolve(__dirname, 'dist'),
    	library:'cwv',
    	libraryExport:'default'
  	},
  	plugins: [new HtmlWebpackPlugin(),


		// new CopyWebpackPlugin([
		// 	{
		// 	  from: "keystore/",
		// 	  to: 'keystore',
		// 	  test: /([^/]+)\/(.+)\.json$/,
		// 	  ignore:['.DS_Store']
		// 	}
		// ],{}),



  	]

};

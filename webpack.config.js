const path = require('path');
const HtmlwebpackPlugin = require('html-webpack-plugin');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin')

const merge = require('webpack-merge');

const TARGET = process.env.npm_lifecycle_event;

const PATHS = {
    app: path.join(__dirname, 'app'),
  build: path.join(__dirname, 'build')
};

process.env.BABEL_ENV = TARGET;
process.traceDeprecation = true;

const webpack = require('webpack');

const common = {
//    mode: 'production',
    mode: 'development',    
    optimization: {
	minimizer: [
	    new UglifyJSPlugin({
		uglifyOptions: {
		    compress: {
			drop_console: true,
		    }
		}
	    })
	]
    },    
  // Entry accepts a path or an object of entries.
  // The build chapter contains an example of the latter.
    entry: PATHS.app,

    // Add resolve.extensions. '' is needed to allow imports
    // without an extension. Note the .'s before extensions!!!
    // The matching will fail without!
    resolve: {
	extensions: ['.js', '.jsx'],
	modules: ['node_modules'],
	alias: {
	    'fs': 'browserfs/dist/shims/fs.js',
	    'buffer': 'browserfs/dist/shims/buffer.js',
	    'path': 'browserfs/dist/shims/path.js',
	    'processGlobal': 'browserfs/dist/shims/process.js',
	    'bufferGlobal': 'browserfs/dist/shims/bufferGlobal.js',
	    'bfsGlobal': require.resolve('browserfs')
	}
    },

    node: {
	process: false,
	Buffer: false
    },

    output: {
	path: PATHS.build,
	filename: 'bundle.js'
    },

    devtool: 'inline-source-map',
    module: {
	noParse: /browserfs\.js/,
	rules: [
	    
	    {
		test: /\.(png|woff|woff2|eot|ttf|svg)/,
		loader: 'url-loader?limit=100000'
	    },
	    
	    
	    {
		// Test expects a RegExp! Note the slashes!
		test: /\.css$/,
		loaders: ['style-loader', 'css-loader'],
		// Include accepts either a path or an array of paths.
		include: PATHS.app
	    },
	    
	    
	    {
		test: /\.(png|jpg)$/,
		loader: 'file-loader?name=[name].[ext]',
		include: PATHS.app.images
	    },

	    {
		test: /\.js$/,
		loader: 'babel-loader',
		include: PATHS.app
	    },
	    
	    {
		test: /\.jsx?$/,
		loader: 'babel-loader',
		query:
		{
		    // presets:['react', 'es2015', 'stage-0']
		    "presets": ["@babel/preset-env",
				"@babel/preset-react",
				["@babel/preset-stage-0", { "decoratorsLegacy": true }],
			//	"@babel/preset-stage-0"
			       ]
		},
		include: PATHS.app
	    }	    	    
	]
    },

    // see https://www.npmjs.com/package/html-webpack-plugin
    plugins: [
	// Expose BrowserFS, process, and Buffer globals.
	// NOTE: If you intend to use BrowserFS in a script tag, you do not need
	// to expose a BrowserFS global.
	new webpack.ProvidePlugin({ BrowserFS: 'bfsGlobal', process: 'processGlobal', Buffer: 'bufferGlobal' }),
	new HtmlwebpackPlugin({
	    inject: false,
	    template: require('html-webpack-template'),
	    hash: true,
	    title: 'SFB-833 SIPper',
	    appMountId: 'app',
	    favicon: 'app/images/jackTheSIPper.png'
	}),
	new webpack.DefinePlugin({
	    'process.env': {
//                'NODE_ENV': JSON.stringify('production'),
                'NODE_ENV': JSON.stringify('development'),		
		'VERSION'     : JSON.stringify('v0.0.1'),
		'CONTACT'     : JSON.stringify('claus.zinn@uni-tuebingen.de'),
		'NC_USER' : JSON.stringify('sfb833_admin'),
		'NC_PASS' : JSON.stringify('JackTheSIPper')
	    }
	}),

        new webpack.optimize.OccurrenceOrderPlugin()
    ]
};

// Default configuration
if(TARGET === 'start' || !TARGET) {

    module.exports = merge(common, {
	devtool: '#inline-source-map',

	devServer: {
	    historyApiFallback: true,
	    hot: true,
	    inline: true,
	    //progress: true,
	    
	    // Display only errors to reduce the amount of output.
	    stats: 'errors-only',
	    
	    // Parse host and port from env so this is easy to customize.
	    host: process.env.HOST,
	    port: process.env.PORT
	},
	plugins: [
	    new webpack.HotModuleReplacementPlugin()
	]
    });
}

if(TARGET === 'build') {
  module.exports = merge(common, {});
}

const path = require('path');

module.exports = {
	entry: './src/index.js',
	output: {
		path: path.resolve(__dirname, 'dist'),
		filename: 'fmh-bc.js',
		library: {
			name: 'fmhBC',
			type: 'umd'
		},
		clean: true
	},
	mode: 'development',
	devtool: 'source-map'
}

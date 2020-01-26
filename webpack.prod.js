const merge = require('webpack-merge');
const common = require('./webpack.common.js');

module.exports = merge(common, {
  mode: 'production',
  output: {
    filename: 'js-streaming.min.js'
  },
  devServer: {
    contentBase: './dist',
  }
});

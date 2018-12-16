var path = require('path');

module.exports = {
  mode:"development",
  devtool: "source-map",
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'cloudinary-live-stream.js',
    library: 'cloudinaryLiveStream',
    libraryTarget: 'umd'
  },
  target: "node",
  module: {
    rules: [
      {
        test: /\.m?js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader'
        }
      }
    ]
  }
};



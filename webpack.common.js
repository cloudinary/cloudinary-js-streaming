const webpack = require('webpack');
const path = require('path');

module.exports = {
  devtool: "source-map",
  entry: ['babel-polyfill', './src/index.js'],
  output: {
    path: path.resolve(__dirname, 'dist'),
    library: 'cloudinaryJsStreaming',
    libraryTarget: 'umd',
    umdNamedDefine: true,
    globalObject: `(typeof self !== 'undefined' ? self : this)`
  },
  //target: "node",
  module: {
    rules: [
      {
        test: /\.m?js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader'
        }
      },
      // janus.js does not use 'export' to provide its functionality to others, instead
      // it creates a global variable called 'Janus' and expects consumers to use it.
      // Let's use 'exports-loader' to simulate it uses 'export'.
      {
        test: require.resolve('janus-gateway'),
        use: 'exports-loader?Janus=Janus'
      }
    ]
  },
  plugins: [
    // janus.js does not use 'import' to access to the functionality of webrtc-adapter,
    // instead it expects a global object called 'adapter' for that.
    // Let's make that object available.
    new webpack.ProvidePlugin({ adapter: 'webrtc-adapter' }),
  ]
};



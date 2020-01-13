// export webpack configuration
const path = require('path');
module.exports = {
  mode: 'development',
  // entry point of application
  entry: './src/app.ts',
  // where to put our bundle
  output: {
    filename: 'bundle.js',
    // absolute path
    path: path.resolve(__dirname, 'dist'),
    // where is relative path for index.html
    publicPath: 'dist'
  },
  // modules to load for some specific times
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: 'ts-loader',
        exclude: /node_modules/
      }
    ]
  },
  // dev source code/debugging
  devtool: 'inline-source-map',
  // which file types to resolve
  resolve: {
    extensions: ['.ts', '.js']
  }
}

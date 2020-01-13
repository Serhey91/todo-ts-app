// export webpack configuration
const path = require('path');
const CleanPlugin = require('clean-webpack-plugin');
module.exports = {
  mode: 'production',
  // entry point of application
  entry: './src/app.ts',
  // where to put our bundle
  output: {
    filename: 'bundle.js',
    // absolute path
    path: path.resolve(__dirname, 'dist'),
    // where is relative path for index.html
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
  devtool: 'none',
  // which file types to resolve
  resolve: {
    extensions: ['.ts', '.js']
  },
  // extra extentions for entire projects
  plugins: [
    //latest bundle in dist folder
    new CleanPlugin.CleanWebpackPlugin()
  ]
}

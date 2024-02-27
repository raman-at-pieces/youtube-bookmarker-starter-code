const path = require('path')
const CopyWebpackPlugin = require('copy-webpack-plugin')

module.exports = {
   entry: {
      popup: './src/popup.js',
      parseClassesSchedule: './src/parseClassesSchedule.js',
      background: './src/background.js'
   },
   output: {
      filename:'[name].bundle.js',
      path: path.resolve(__dirname, 'dist')
   },
   mode: 'development',
   watch: true,
   plugins: [
      new CopyWebpackPlugin({
         patterns: [{ from: 'static'}]
      })
   ],
   devtool: 'cheap-module-source-map'
}
const preactCliFlow = require('preact-cli-plugin-flow');
const HtmlWebpackPlugin = require('html-webpack-plugin');

export default function (config) {
  preactCliFlow(config);

  config.plugins.push(
    /* new CopyWebpackPlugin([
      { from: '*.html' }
    ]) */
    new HtmlWebpackPlugin({
      filename: 'popup.html',
      template: 'popup.html',
      minify: {
        minifyJS: true,
        minifyCSS: true,
        minifyURLs: true,
        collapseWhitespace: true,
        removeScriptTypeAttributes: true,
        removeRedundantAttributes: true,
        removeStyleLinkTypeAttributes: true,
        removeComments: true
      },
      inject: false
    })
  );
}
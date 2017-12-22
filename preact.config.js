/* eslint-disable import/no-extraneous-dependencies */
const flowPlugin = require('preact-cli-plugin-flow');
const {BundleAnalyzerPlugin} = require('webpack-bundle-analyzer');
const HtmlWebpackPlugin = require('html-webpack-plugin');

export default function (config, env, helpers) {
  flowPlugin(config);

  config.plugins.push(
    new HtmlWebpackPlugin({
      filename: 'popup.html',
      template: 'popup.ejs',
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

  if(!env.ssr && env.production){
    config.plugins.push(
      new BundleAnalyzerPlugin({
        analyzerMode: 'static'
      })
    );
  }
}
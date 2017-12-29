/* eslint-disable import/no-extraneous-dependencies */
const webpack = require('webpack');

const flowPlugin = require('preact-cli-plugin-flow');
const swPrecachePlugin = require('preact-cli-sw-precache');
const fastAsyncPlugin = require('preact-cli-plugin-fast-async');

const {BundleAnalyzerPlugin} = require('webpack-bundle-analyzer');
const HtmlWebpackPlugin = require('html-webpack-plugin');

export default function (config, env, helpers) {
  flowPlugin(config);
  fastAsyncPlugin(config);

  const precacheConfig = {
    navigateFallbackWhitelist: [/^(?!\/__)(?!\/popup).*/],
  };
  swPrecachePlugin(config, precacheConfig);

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
    }),
    new webpack.DefinePlugin({
      'process.env.FIREBASE_ENV': JSON.stringify(process.env.FIREBASE_ENV === 'development' ? 'development' : 'production')
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
/* eslint-disable import/no-extraneous-dependencies,no-param-reassign */
const webpack = require('webpack');

const flowPlugin = require('preact-cli-plugin-flow');
const swPrecachePlugin = require('preact-cli-sw-precache');
const fastAsyncPlugin = require('preact-cli-plugin-fast-async');

const {BundleAnalyzerPlugin} = require('webpack-bundle-analyzer');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const path = require('path');

export default function (config, env, helpers) {

  // BASIC CONFIG ---

  // Use project entry.js
  config.entry.bundle = [path.resolve(__dirname, './src/entry')];
  if(!env.production) {
    config.entry.bundle.push(...['webpack-dev-server/client', 'webpack/hot/dev-server']);
  }

  config.module.loaders.push({
    test: /\.worker\.js$/,
    use: { loader: 'worker-loader' }
  });

  // Use nervjs
  config.resolve.alias = Object.assign(
    config.resolve.alias,
    {
      'react': 'nervjs',
      'react-dom': 'nervjs'
    }
  );

  // BABEL ---

  const babel = config.module.loaders
    .filter( loader => loader.loader === 'babel-loader')[0].options;

  // Use default React.createElement JSX
  babel.plugins.pop();
  babel.plugins.pop();
  babel.plugins.push('transform-react-jsx');

  // Workaround CLI 2.1.1
  babel.plugins.push('syntax-dynamic-import');

  flowPlugin(config);
  fastAsyncPlugin(config);


  // PLUGINS ---

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
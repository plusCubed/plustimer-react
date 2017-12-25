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

  const { rule } = helpers.getLoadersByName(config, 'babel-loader')[0];
  const babelConfig = rule.options;

  rule.exclude = [/node_modules/];

  // Remove stage-1 preset
  babelConfig.presets.splice(1,1);
  // Replace stage-1 with plugins
  babelConfig.plugins.push(
    require.resolve('babel-plugin-syntax-dynamic-import'),
    require.resolve('babel-plugin-transform-class-properties'),
    require.resolve('babel-plugin-transform-export-extensions'),
    require.resolve('babel-plugin-transform-object-rest-spread'),
    ['fast-async', {"spec":true}]
  );

  babelConfig.presets[0][1].exclude.push("transform-async-to-generator");


  if(!env.ssr && env.production){
    config.plugins.push(
      new BundleAnalyzerPlugin({
        analyzerMode: 'static'
      })
    );
  }
}
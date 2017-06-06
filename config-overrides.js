const fs = require("fs");
const path = require("path");
const paths = require("react-scripts/config/paths");

module.exports = function override(config, env) {
    // change appIndexJs path to tsx file
    const appDirectory = fs.realpathSync(process.cwd());
    const resolveApp = relativePath => path.resolve(appDirectory, relativePath);
    paths.appIndexJs = resolveApp('src/index.tsx');

    // Replace existing appIndexJs at last index (better way?)
    config.entry.splice(config.entry.length - 1, 1);
    config.entry.push(paths.appIndexJs);

    // allow loading of tsx / ts files
    config.module.rules.push(
        {
            test: /\.(ts|tsx)$/,
            loader: require.resolve('tslint-loader'),
            enforce: 'pre',
            include: paths.appSrc,
        },
        {
            test: /\.(ts|tsx)$/,
            include: paths.appSrc,
            loader: require.resolve('awesome-typescript-loader'),
            query: {
                useBabel: true,
                useCache: true
            },
        }
    );

    // exclude ts tsx from file-loader
    config.module.rules.forEach(rule => {
        if (rule.exclude) {
            rule.exclude.push(/\.(ts|tsx)$/)
        }
    });

    // add extensions
    config.resolve.extensions.push('.tsx');
    config.resolve.extensions.push('.ts');

    return config;
};
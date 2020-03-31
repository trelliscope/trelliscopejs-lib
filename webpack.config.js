const path = require('path');
const glob = require('glob');
const TerserPlugin = require('terser-webpack-plugin');
const replaceInFiles = require('replace-in-files');

// we need to do this in order to get url-loader to properly recognize fonts
replaceInFiles({
  files: 'build/static/css/*.css',
  from: /\/static/g,
  // to: ''
  to: '\.\.'
})
  .then(({ changedFiles, countOfMatchesByPaths }) => {
    console.log('Modified files:', changedFiles);
    console.log('Count of matches by paths:', countOfMatchesByPaths);
  })
  .catch(error => {
    console.error('Error occurred:', error);
  });

module.exports = {
  mode: 'production',
  entry: {
    app: glob.sync('build/static/?(js|css|media)/*.?(js|css|eot|woff|ttf|svg|woff2)')
      .map((f) => path.resolve(__dirname, f))
  },
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'trelliscope.min.js'
  },
  optimization: {
    minimize: true,
    minimizer: [new TerserPlugin()]
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          {
            loader: 'style-loader'
          },
          {
            loader: 'css-loader'
          }
        ]
      },
      {
        test: /\.svg(\?[\s\S]+)?$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 10000000,
              mimetype: 'image/svg+xml'
            }
          }
        ]
      },
      {
        test: /\.woff(\?[\s\S]+)?$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 10000000,
              mimetype: 'application/font-woff'
            }
          }
        ]
      },
      {
        test: /\.woff2(\?[\s\S]+)?$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 10000000,
              mimetype: 'application/font-woff2'
            }
          }
        ]
      },
      {
        test: /\.[ot]tf(\?[\s\S]+)?$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 10000000,
              mimetype: 'application/octet-stream'
            }
          }
        ]
      },
      {
        test: /\.eot(\?[\s\S]+)?$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 10000000,
              mimetype: 'application/vnd.ms-fontobject'
            }
          }
        ]
      }
    ]
  }
};

const path = require('path');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const glob = require('glob');

module.exports = {
  entry: {
    'bundle.js': glob.sync('build/static/?(js|css|media)/*.?(js|css|eot|woff|ttf|svg|woff2)').map(f => path.resolve(__dirname, f))
  },
  // entry: {
  //   'bundle.js': glob.sync('build/static/?(js|css)/main.*.?(js|css)')
  //     .map(f => path.resolve(__dirname, f)),
  // },
  output: {
    filename: 'build/static/js/bundle.min.js'
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      },
      {
        test: /\.svg(\?[\s\S]+)?$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 65000,
              mimetype: 'image/svg+xml',
              name: 'build/static/media/[name].[ext]'
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
              limit: 65000,
              mimetype: 'application/font-woff',
              name: 'build/static/media/[name].[ext]'
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
              limit: 65000,
              mimetype: 'application/font-woff2',
              name: 'build/static/media/[name].[ext]'
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
              limit: 65000,
              mimetype: 'application/octet-stream',
              name: 'build/static/media/[name].[ext]'
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
              limit: 65000,
              mimetype: 'application/vnd.ms-fontobject',
              name: 'build/static/media/[name].[ext]'
            }
          }
        ]
      }
    ]
  },
  plugins: [new UglifyJsPlugin()]
};

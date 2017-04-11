var path = require('path');
var webpack = require('webpack');

module.exports = {
  devtool: 'cheap-module-source-map',
  entry: [
    'babel-polyfill',
    './src/index'
  ],
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'trelliscope.min.js'
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify('production')
      }
    }),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      }
    }),
    new webpack.ProvidePlugin({
      crossfilter: 'crossfilter2'
    }),
    new webpack.DefinePlugin({
      VERSION: JSON.stringify(require('./package.json').version)
    })
  ],
  module: {
    rules: [
      {
        test: /\.scss$/,
        include: /src/,
        use: [
          {
            loader: 'style-loader'
          },
          {
            loader: 'css-loader'
          },
          {
            loader: 'autoprefixer',
            options: {
              browsers: 'last 3 versions'
            }
          },
          {
            loader: 'sass-loader',
            options: {
              outputStyle: 'expanded'
            }
          }
        ]
      },
      {
        test: /\.css$/,
        use: [
          'style-loader',
          'css-loader'
        ]
      },
      {
        test: /\.js$/,
        include: path.join(__dirname, 'src'),
        use: [
          'babel-loader'
        ]
      },
      // Font Definitions
      {
        test: /\.svg(\?[\s\S]+)?$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 65000,
              mimetype: 'image/svg+xml',
              name: 'public/fonts/[name].[ext]'
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
              name: 'public/fonts/[name].[ext]'
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
              name: 'public/fonts/[name].[ext]'
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
              name: 'public/fonts/[name].[ext]'
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
              name: 'public/fonts/[name].[ext]'
            }
          }
        ]
      }
    ]
  }
};

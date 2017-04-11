var path = require('path');
var webpack = require('webpack');

module.exports = {
  devtool: 'eval',
  entry: [
    'webpack-dev-server/client?http://localhost:3000',
    'webpack/hot/only-dev-server',
    './src/index'
  ],
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'trelliscope.js'
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
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
          'react-hot-loader',
          'babel-loader'
        ]
      },
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
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

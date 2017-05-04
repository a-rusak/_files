const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const PROD = process.env.NODE_ENV === 'production';
const a11y = false;
const a11y_theme = 'bw';


const OUTPUT_PATH = PROD ?
  path.resolve(__dirname, 'dist/bundles') :
  path.resolve(__dirname, 'build/bundles');

console.log('=========================================');
console.log(`Start building for ${ process.env.NODE_ENV }`);
console.log(`Files are in ${ PROD ? 'dist' : 'build' } folder`);
console.log('=========================================');
console.log('');

function addHash(template, hash) {
  return PROD ? template.replace(/\.[^.]+$/, `.[${hash}]$&`) : template;
}

function addPostFix(template) {
  return a11y ? template.replace(/\.[^.]+$/, `--${a11y_theme}$&`) : template
}

module.exports = {

  entry: {
    __pages: ['./src/pages'],
    __images: ['./src/images'],
    __files: [
      './src/pages/admission/links/images',
      './src/pages/home/feedback/images',
      './src/pages/home/news/images',
      './src/pages/home/slider/images'
    ],
    'admission':      './src/pages/admission',
    'home':           './src/pages/home',
    'entry':          './src/pages/entry',
    'news-list':      './src/pages/news-list',
    'persons-list':   './src/pages/persons-list',
    'units-list':     './src/pages/units-list'
  },

  output: {
    filename: '[name].js',
    chunkFilename: addHash('[name].js', 'chunkhash'),
    publicPath: '/bundles/',
    path: OUTPUT_PATH
  },

  resolve: {
    modules: [
      path.join(__dirname, "src"),
      "node_modules"
    ],
    alias: {
      Components:     path.resolve(__dirname, 'src/components/'),
      Icons:          path.resolve(__dirname, 'src/icons/'),
      Images:         path.resolve(__dirname, 'src/images/'),
      WebComponents:  path.resolve(__dirname, 'src/web-components/'),
      Styles:         path.resolve(__dirname, 'src/styles/')
    }
  },

  watchOptions: {
    //aggregateTimeout: 100
    //poll: true
  },

  devtool: "source-map",

  devServer: {
    contentBase: path.join(__dirname, "build"),
    //publicPath: "/build/",
    //compress: true,
    //inline: false,
    port: 9090
  },

  module: {
    rules: [{
      test: /\.njk$/,
      use: [{
          loader: 'file-loader',
          options: 'name=../[name].html'
        },
        'extract-loader',
        'html-loader',
        'markup-inline-loader',
        'nunjucks-html-loader'
      ]
    }, {
      test: /\.less$/,
      use: ExtractTextPlugin.extract({
        fallback: 'style-loader',
        use: [{
            loader: 'css-loader',
            options: {
              sourceMap: true
            }
          },
          'postcss-loader',
          {
            loader: 'less-loader',
            options: {
              sourceMap: true
            }
          }
        ]
      })
    }, {
      test: /\.css$/,
      use: ExtractTextPlugin.extract({
        fallback: 'style-loader',
        use: [{
            loader: 'css-loader',
            options: {
              sourceMap: true
            }
          },
          'postcss-loader'
        ]
      })
    }, {
      test: /\.(png|jpg|jpeg)$/,
      include: [
        path.join(__dirname, 'src/images')
      ],
      use: [{
        loader: 'file-loader',
        options: 'name=../images/[name].[ext]'
      }]
    }, {
      test: /\.svg$/,
      include: [
        path.join(__dirname, 'src/images'),
        path.join(__dirname, 'src/icons')
      ],
      use: [{
        loader: 'svg-sprite-loader',
        options: {
          name: 'symbol-[name]'
          //regExp: './src/images/(.*)\\.svg'
        }
      }]
    }, {
      test: /\.(png|jpg|jpeg)$/,
      include: [
        path.join(__dirname, 'src/components'),
        path.join(__dirname, 'src/pages')
      ],
      use: [{
        loader: 'file-loader',
        options: 'name=../files/[name].[ext]'
      }]
    }, {
      test: /\.(png|gif|svg)$/,
      include: [
        path.resolve(__dirname, "node_modules/photoswipe/dist/default-skin")
      ],
      use: [{
        loader: 'url-loader',
        options: {
          limit: 10000
        }
      }]
    }, {
      test: /\.js$/,
      exclude: [
        /node_modules/
      ],
      use: 'babel-loader'
    }]
  },

  plugins: [
    new ExtractTextPlugin(addPostFix('[name].css')),
    new webpack.DefinePlugin({
      a11y: JSON.stringify(a11y),
      a11y_theme: JSON.stringify(a11y_theme),
      PROD: JSON.stringify(PROD)
    }),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'common',
      minChunks: 3,
      chunks: [
        'admission',
        'entry',
        'home',
        'news-list',
        'persons-list',
        'units-list'
      ]
    }),
  ]
}
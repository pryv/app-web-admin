const httpsOptions = require('rec.la').httpsOptions();

module.exports = {
  publicPath: process.env.NODE_ENV === 'production' ? '' : '/',
  devServer: {
    host: 'l.rec.la',
    server: {
      type: 'https',
      options: httpsOptions
    }
  },
  configureWebpack: {
    resolve: {
      fallback: {
        crypto: require.resolve('crypto-browserify'),
        stream: require.resolve('stream-browserify'),
        util: require.resolve('util')
      }
    }
  }
};

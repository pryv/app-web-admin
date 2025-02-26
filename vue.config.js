/**
 * @license
 * Copyright (C) Pryv https://pryv.com
 * This file is part of Pryv.io and released under BSD-Clause-3 License
 * Refer to LICENSE file
 */
const httpsOptions = require('backloop.dev').httpsOptions();

module.exports = {
  publicPath: process.env.NODE_ENV === 'production' ? '' : '/',
  devServer: {
    host: 'l.backloop.dev',
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

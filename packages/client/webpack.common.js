const path = require('path');

module.exports = {
  entry: {
    main: './src/index.js',
    login: './src/login.js'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        include: path.join(__dirname, 'src'),
        loader: 'babel-loader'
      }
    ]
  }
};

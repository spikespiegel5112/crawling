const path = require('path');

module.exports = {
  lintOnSave: false, //配置关闭eslint
  //   configureWebpack: {
  //     resolve: {
  //       alias: {
  //         '@': path.resolve(__dirname, 'src'),
  //         style: path.resolve(__dirname, 'src/style')
  //       }
  //     }
  //   }

  devServer: {
    historyApiFallback: true,
    allowedHosts: 'all'
  }
};

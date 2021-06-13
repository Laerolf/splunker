module.exports = {
  devServer: {
    port: '4080'
  },

  chainWebpack: config => {
    config
      .plugin('html')
      .tap(args => {
        args[0].title = 'Splunker';
        return args;
      });

    const svgRule = config.module.rule('svg');

    svgRule.uses.clear();

    svgRule
      .use('babel-loader')
      .loader('babel-loader')
      .end()
      .use('vue-svg-loader')
      .loader('vue-svg-loader');
  },

  pluginOptions: {
    quasar: {
      importStrategy: 'kebab',
      rtlSupport: false
    }
  },

  transpileDependencies: [
    'quasar'
  ]
};

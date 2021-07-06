const path = require('path')

module.exports = {
  pluginOptions: {
    svgSpriteLoader: {
      // directory
      dir: path.resolve(__dirname, 'src/icons/svg'),
      // test rule
      test: /\.svg$/,
      // https://github.com/JetBrains/svg-sprite-loader#configuration
      options: {
        symbolId: 'icon-[name]'
      }
    }
  },
  css: {
    loaderOptions: {
      sass: {
        prependData: `
          @import '@/styles/common/_variables.scss';
          @import '@/styles/common/_mixins.scss';
          @import '@/styles/common/_functions.scss';
        `
      }
    }
  }
}

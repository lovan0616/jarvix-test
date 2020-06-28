// https://github.com/michael-ciniawsky/postcss-load-config

module.exports = {
  "plugins": {
    "postcss-import": {},
    "postcss-url": {},
    "precss": {},
    "postcss-cssnext": {
      features: {
        customProperties: {
          // 先把不需要的 warnings 關掉
          // https://github.com/angular/angular-cli/issues/7991
          warnings: false
        }
      }
    },
    "postcss-sass-color-functions": {},
    "postcss-rgba-hex": {
      rgbOnly: true
    }
  }
}

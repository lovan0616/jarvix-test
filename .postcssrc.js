// https://github.com/michael-ciniawsky/postcss-load-config

module.exports = {
  "plugins": {
    "postcss-import": {},
    "postcss-url": {},
    "precss": {},
    "postcss-cssnext": {
      features: {
        customProperties: {
          warnings: true
        }
      }
    },
    "postcss-sass-color-functions": {},
    "postcss-rgba-hex": {
      rgbOnly: true
    }
  }
}

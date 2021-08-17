const fs = require('fs')
const path = require('path')
const { optimize, extendDefaultPlugins } = require('svgo')

async function run () {
  const pathToSvgIconsDir = path.join(__dirname, '../src/icons/svg')
  const iconsFilename = (await fs.promises.readdir(pathToSvgIconsDir))
    .filter((filename) => filename.endsWith('.svg'))

  const pathsToSvgIcon = iconsFilename
    .map((filename) => path.join(pathToSvgIconsDir, filename))

  await Promise.all(pathsToSvgIcon.map(async (pathToSvgIcon) => {
    const svgString = (await fs.promises.readFile(pathToSvgIcon)).toString()

    // 最佳化 svg 內容（包含移除所有值不是 none 的 fill/stroke）
    // Default plugins: https://github.com/svg/svgo#built-in-plugins
    const optimizedSvgString = optimize(svgString, {
      plugins: extendDefaultPlugins([
        {
          name: 'removeUselessStrokeAndFill',
          active: false
        },
        {
          name: 'removeDimensions',
          active: true
        },
        {
          name: 'removeViewBox',
          active: false
        },
        {
          name: 'removeAttrs',
          params: {
            attrs: '(stroke|fill)'
          }
        }
      ])
    }).data

    await fs.promises.writeFile(pathToSvgIcon, optimizedSvgString)
  }))
}

run()


import variables from '@/styles/common/variables.scss'

const colorListDefault = [variables['theme-color-primary-dark'], variables['theme-color-primary'], '#71CBFF', '#B5F0FF', '#71F4FF']
const colorListOnly2 = ['#3F5669', '#6DCDCF']
const colorList3 = ['#3F5669', '#558FA1', '#6DCDCF']
const colorList5 = ['#3F5669', '#558FA1', '#6DCDCF', '#49E6DE', '#51FCE8']
const colorList10 = [
  '#334457',
  '#39566B',
  '#3E697E',
  '#407C91',
  '#4290A3',
  '#42A5B3',
  '#43BAC3',
  '#44D0D1',
  '#49E6DE',
  '#51FCE8'
]

export function colorDefault () {
  return colorListDefault
}

export function colorOnly2 () {
  return colorListOnly2
}

export function color3 () {
  return colorList3
}

export function color5 () {
  return colorList5
}

export function color10 () {
  return colorList10
}

export function gridDefault () {
  return {}
}

export function gridInner () {
  const defaultConfig = {
    x: 10,
    y: 20,
    x2: 10,
    y2: 10
  }
  const config = defaultConfig
  return {
    ...config,
    containLabel: true
  }
}

export function gridHorizontalSpace () {
  const defaultConfig = {
    x: 30,
    x2: 30
  }
  const config = defaultConfig
  return {
    ...config,
    containLabel: true
  }
}

export function gridInnerWithLegend () {
  const defaultConfig = {
    x: 0,
    y: 30,
    x2: 30,
    y2: 10
  }
  const config = defaultConfig
  return {
    ...config,
    containLabel: true
  }
}

export function gridNarrow () {
  const defaultConfig = {
    x: 6,
    y: 20,
    x2: 6,
    y2: 20
  }
  const config = defaultConfig
  return {
    ...config
  }
}

export function gridYname () {
  const defaultConfig = {
    x: 80,
    y: 50,
    x2: 20,
    y2: 50
  }
  const config = defaultConfig
  return {
    ...config
  }
}

export function gridXname () {
  const defaultConfig = {
    y: 20,
    y2: 60
  }
  const config = defaultConfig
  return {
    ...config
  }
}

export function gridMini () {
  const defaultConfig = {
    x: 0,
    y: 10,
    x2: 0,
    y2: 10
  }
  const config = defaultConfig
  return {
    ...config
  }
}

export function xAxisDefault () {
  const defaultConfig = {
    nameGap: 24,
    fontSize: 14,
    axisLabelFontSize: 10
  }
  const config = defaultConfig
  return {
    type: 'category',
    nameLocation: 'middle',
    nameGap: config.nameGap,
    splitLine: {
      show: false
    },
    axisTick: {
      show: false
    },
    axisLine: {
      show: true
    },
    axisLabel: {
      show: true,
      textStyle: {
        color: variables['theme-color-gs-dark'],
        fontSize: config.axisLabelFontSize
      },
      rotate: 45,
      color: '#979797'
    }
  }
}

export function xAxisLabelRotate () {
  return {
    axisLabel: {
      show: true,
      rotate: 35
    }
  }
}

export function xAxisSplitLine () {
  return {
    splitLine: {
      show: true,
      lineStyle: {
        color: variables['theme-color-gs-dark'],
        opacity: 0.1
      }
    },
    splitNumber: 4
  }
}

export function xAxisNone () {
  return {
    type: 'category',
    splitLine: {
      show: false
    },
    axisLine: {
      show: false
    },
    axisTick: {
      show: false
    },
    axisLabel: {
      show: false
    }
  }
}

export function yAxisDefault () {
  const defaultConfig = {
    nameGap: 24,
    axisLabelFontSize: 10
  }
  const config = defaultConfig
  return {
    nameLocation: 'middle',
    nameGap: config.nameGap,
    splitLine: {
      show: true
    },
    axisTick: {
      show: false
    },
    axisLine: {
      show: false
    },
    axisLabel: {
      show: true,
      textStyle: {
        color: variables['theme-color-gs-dark'],
        fontSize: config.axisLabelFontSize
      },
      color: '#999999'
    }
  }
}

export function yAxisAutoMaxMin () {
  return {
    max: 'dataMax',
    min: 'dataMin'
  }
}

export function yAxisNone () {
  return {
    splitLine: {
      show: false
    },
    axisTick: {
      show: false
    },
    axisLine: {
      show: false
    },
    axisLabel: {
      show: false
    }
  }
}

export function yAxisOnlySplitLine () {
  return {
    splitLine: {
      show: true,
      lineStyle: {
        color: variables['theme-color-gs-dark'],
        opacity: 0.1
      }
    },
    splitNumber: 3,
    axisTick: {
      show: false
    },
    axisLine: {
      show: false
    },
    axisLabel: {
      show: false
    }
  }
}

export function yAxisName () {
  const defaultConfig = {
    nameGap: 40,
    nameTextFontSize: 14,
    axisLabelFontSize: 10
  }
  const config = defaultConfig
  return {
    nameLocation: 'middle',
    nameTextStyle: {
      color: variables['theme-color-gs-dark'],
      fontSize: config.nameTextFontSize
    },
    nameRotate: 0,
    nameGap: config.nameGap,
    splitLine: {
      show: false
    },
    axisTick: {
      show: false
    },
    axisLine: {
      show: false
    },
    axisLabel: {
      show: true,
      textStyle: {
        color: variables['theme-color-gs-dark'],
        fontSize: config.axisLabelFontSize
      }
    }
  }
}

export function xAxisHorizontalBar () {
  const defaultConfig = {
    nameGap: 24,
    axisLabelFontSize: 10
  }
  const config = defaultConfig
  return {
    type: 'value',
    nameLocation: 'middle',
    nameGap: config.nameGap,
    splitLine: {
      show: false
    },
    axisTick: {
      show: false
    },
    axisLine: {
      show: false
    },
    axisLabel: {
      show: true,
      textStyle: {
        color: variables['theme-color-gs-dark'],
        fontSize: config.axisLabelFontSize
      }
    }
  }
}

export function yAxisHorizontalBar () {
  const defaultConfig = {
    nameGap: 24,
    axisLabelFontSize: 10
  }
  const config = defaultConfig
  return {
    type: 'category',
    nameLocation: 'middle',
    nameGap: config.nameGap,
    splitLine: {
      show: false
    },
    axisTick: {
      show: false
    },
    axisLine: {
      show: false
    },
    axisLabel: {
      show: true,
      textStyle: {
        color: variables['theme-color-gs-dark'],
        fontSize: config.axisLabelFontSize
      }
    }
  }
}

export function seriesItemLine () {
  return {
    type: 'line',
    symbol: 'circle',
    itemStyle: {
      color: variables['theme-color-primary-dark']
    },
    lineStyle: {
      color: variables['theme-color-primary-dark']
    }
  }
}

export function seriesItemSmoothLine () {
  return {
    type: 'line',
    smooth: true
  }
}

export function seriesItemBar () {
  const defaultConfig = {
    barMaxWidth: 24
  }
  const config = defaultConfig
  return {
    type: 'bar',
    barMaxWidth: config.barMaxWidth
  }
}

export function seriesItemStackBar () {
  const defaultConfig = {
    barMaxWidth: 24
  }
  const config = defaultConfig
  return {
    type: 'bar',
    stack: 'all',
    barMaxWidth: config.barMaxWidth
  }
}

export function seriesItemPie () {
  const config = {
    fontSize: 12,
    labelLineLength: 10,
    labelLineLength2: 10
  }
  return {
    type: 'pie',
    label: {
      fontSize: config.fontSize
    },
    labelLine: {
      normal: {
        length: config.labelLineLength,
        length2: config.labelLineLength2
      }
    }
  }
}

export function seriesItemPieLabelWithValue () {
  return {
    label: {
      formatter: '{b} {d}%'
    }
  }
}

export function seriesItemDoughnut () {
  const config = {
    radiusInner: 45,
    radiusOuter: 58,
    fontSize: 12,
    labelLineLength: 10,
    labelLineLength2: 10
  }
  return {
    type: 'pie',
    radius: [`${config.radiusInner}%`, `${config.radiusOuter}%`],
    label: {
      fontSize: config.fontSize
    },
    labelLine: {
      normal: {
        length: config.labelLineLength,
        length2: config.labelLineLength2
      }
    }
  }
}

export function seriesItemInsideLabel () {
  return {
    label: {
      normal: {
        show: true,
        position: 'top',
        color: variables['theme-color-gs-dark']
      }
    }
  }
}

export function seriesItemLabel () {
  return {
    label: {
      normal: {
        show: true
      }
    }
  }
}

export function seriesItemHideSymbol () {
  return {
    showSymbol: false
  }
}

export function seriesItemMarkLine () {
  return {
    markLine: {
      silent: true,
      symbol: 'none',
      lineStyle: {
        normal: {
          color: variables['theme-color-danger'],
          type: 'solid'
        }
      },
      label: {
        normal: {
          show: true,
          position: 'end'
        }
      }
    }
  }
}

export function tooltipDefault () {
  return {
    tooltip: {
      trigger: 'axis'
    }
  }
}

export function legendDefault () {
  const defaultConfig = {
    fontSize: 12,
    itemWidth: 18,
    itemHeight: 12
  }
  const config = defaultConfig
  return {
    left: 'right',
    padding: [0, 10, 0, 10],
    itemWidth: config.itemWidth,
    itemHeight: config.itemHeight,
    textStyle: {
      color: variables['theme-color-gs-dark'],
      fontSize: config.fontSize
    }
  }
}

export function seriesDataColorDanger () {
  return {
    itemStyle: {
      color: variables['theme-color-danger']
    }
  }
}

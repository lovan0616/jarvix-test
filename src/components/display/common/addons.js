
import chartVariable from '@/styles/chart/variables.scss'

export const colorDefault = [chartVariable['darkestChartColor'], chartVariable['darkerChartColor'], chartVariable['basicChartColor'], chartVariable['lighterChartColor'], chartVariable['lightestChartColor']]
export const colorOnly1 = [chartVariable['basicChartColor']]
export const colorOnly2 = [chartVariable['darkestChartColor'], chartVariable['basicChartColor']]
export const color3 = [chartVariable['darkestChartColor'], chartVariable['darkerChartColor'], chartVariable['basicChartColor']]
export const color10 = [
  chartVariable['chartColorList-1'],
  chartVariable['chartColorList-2'],
  chartVariable['chartColorList-3'],
  chartVariable['chartColorList-4'],
  chartVariable['chartColorList-5'],
  chartVariable['chartColorList-6'],
  chartVariable['chartColorList-7'],
  chartVariable['chartColorList-8'],
  chartVariable['chartColorList-9'],
  chartVariable['chartColorList-10']
]

export function gridDefault () {
  return {}
}

export function gridInner () {
  const config = {
    x: 10,
    y: 20,
    x2: 10,
    y2: 10
  }
  return {
    ...config,
    containLabel: true
  }
}

export function gridHorizontalSpace () {
  const config = {
    x: 30,
    x2: 30
  }
  return {
    ...config,
    containLabel: true
  }
}

export function gridInnerWithLegend () {
  const config = {
    x: 0,
    y: 30,
    x2: 30,
    y2: 10
  }
  return {
    ...config,
    containLabel: true
  }
}

export function gridNarrow () {
  const config = {
    x: 6,
    y: 20,
    x2: 6,
    y2: 20
  }
  return {
    ...config
  }
}

export function gridYname () {
  const config = {
    x: 80,
    y: 50,
    x2: 20,
    y2: 50
  }
  return {
    ...config
  }
}

export function gridXname () {
  const config = {
    y: 20,
    y2: 60
  }
  return {
    ...config
  }
}

export function gridMini () {
  const config = {
    x: 0,
    y: 10,
    x2: 0,
    y2: 10
  }
  return {
    ...config
  }
}

export function xAxisDefault () {
  const config = {
    nameGap: 24,
    fontSize: 14,
    axisLabelFontSize: 10
  }
  return {
    type: 'category',
    nameLocation: 'middle',
    nameGap: config.nameGap,
    nameTextStyle: {
      color: chartVariable['textColor']
    },
    splitLine: {
      show: false
    },
    axisTick: {
      show: false
    },
    axisLine: {
      show: true,
      lineStyle: {
        color: chartVariable['textColor']
      }
    },
    axisLabel: {
      show: true,
      textStyle: {
        color: chartVariable['textColor'],
        fontSize: config.axisLabelFontSize
      },
      rotate: 45,
      color: chartVariable['xAxisLabelColor']
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
        color: chartVariable['textColor'],
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
  const config = {
    nameGap: 24,
    axisLabelFontSize: 10
  }
  return {
    // nameLocation: 'middle',
    nameGap: config.nameGap,
    nameTextStyle: {
      color: chartVariable['textColor']
    },
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
        color: chartVariable['textColor'],
        fontSize: config.axisLabelFontSize
      },
      color: chartVariable['yAxisLabelColor']
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
        color: chartVariable['textColor'],
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
  const config = {
    nameGap: 40,
    nameTextFontSize: 14,
    axisLabelFontSize: 10
  }
  return {
    // nameLocation: 'middle',
    nameTextStyle: {
      color: chartVariable['textColor'],
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
        color: chartVariable['textColor'],
        fontSize: config.axisLabelFontSize
      }
    }
  }
}

export function xAxisHorizontalBar () {
  const config = {
    nameGap: 24,
    axisLabelFontSize: 10
  }
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
        color: chartVariable['textColor'],
        fontSize: config.axisLabelFontSize
      }
    }
  }
}

export function yAxisHorizontalBar () {
  const config = {
    nameGap: 24,
    axisLabelFontSize: 10
  }
  return {
    type: 'category',
    // nameLocation: 'middle',
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
        color: chartVariable['textColor'],
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
      color: chartVariable['basicChartColor']
    },
    lineStyle: {
      color: chartVariable['borderColor']
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
  const config = {
    barMaxWidth: 18
  }
  return {
    type: 'bar',
    barMaxWidth: config.barMaxWidth
  }
}

export function seriesItemStackBar () {
  const config = {
    barMaxWidth: 18
  }
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
        color: chartVariable['textColor']
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
          color: chartVariable['markLineColor'],
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
  const config = {
    fontSize: 12,
    itemWidth: 18,
    itemHeight: 12
  }
  return {
    left: 'right',
    padding: [0, 10, 0, 10],
    itemWidth: config.itemWidth,
    itemHeight: config.itemHeight,
    textStyle: {
      color: chartVariable['textColor'],
      fontSize: config.fontSize
    }
  }
}

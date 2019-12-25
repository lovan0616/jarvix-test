
import chartVariable from '@/styles/chart/variables.scss'
import { graphic } from 'echarts/lib/export'

// 圖表的漸層色
export function linearGradient (colorStart, colorEnd) {
  return new graphic.LinearGradient(0, 0, 0, 1, [{
    offset: 0, color: colorStart
  }, {
    offset: 1, color: colorEnd
  }], false)
}

export const colorDefault = [linearGradient('#95FAF2', '#559BD5'), linearGradient('#4CE2F0', '#438AF8'), linearGradient('#76CCFF', '#3E52F9'), linearGradient('#79ACFF', '#5A3FFA'), linearGradient('#698DF3', '#7544FC')]
export const colorOnly1 = [linearGradient('#95FAF2', '#559BD5')]
export const colorOnly2 = [linearGradient('#95FAF2', '#559BD5'), linearGradient('#4BCBF1', '#416DF9')]
export const color3 = [linearGradient('#95FAF2', '#559BD5'), linearGradient('#76CCFF', '#3E52F9'), linearGradient('#698DF3', '#7544FC')]
export const color10 = [
  linearGradient('#95FAF2', '#559BD5'),
  linearGradient('#78F5F7', '#5596E4'),
  linearGradient('#4CE2F0', '#438AF8'),
  linearGradient('#4BCBF1', '#416DF9'),
  linearGradient('#76CCFF', '#3E52F9'),
  linearGradient('#79BCFF', '#443FFA'),
  linearGradient('#79ACFF', '#5A3FFA'),
  linearGradient('#698DF3', '#7544FC'),
  linearGradient('#5568FA', '#9549FD'),
  linearGradient('#6245FF', '#C238FF')
]
export const color12 = [
  chartVariable['chartColorList-1'],
  chartVariable['chartColorList-2'],
  chartVariable['chartColorList-3'],
  chartVariable['chartColorList-4'],
  chartVariable['chartColorList-5'],
  chartVariable['chartColorList-6'],
  chartVariable['chartColorList-7'],
  chartVariable['chartColorList-8'],
  chartVariable['chartColorList-9'],
  chartVariable['chartColorList-10'],
  chartVariable['chartColorList-11'],
  chartVariable['chartColorList-12']
]

export function gridDefault () {
  return {
    // containLabel: true
  }
}

export function xAxisDefault () {
  const config = {
    nameGap: 5,
    fontSize: 14,
    axisLabelFontSize: 10
  }
  return {
    type: 'category',
    nameLocation: 'end',
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
        color: chartVariable['xAxisColor']
      }
    },
    axisLabel: {
      show: true,
      textStyle: {
        color: chartVariable['textColor'],
        fontSize: config.axisLabelFontSize
      },
      rotate: 30,
      color: chartVariable['xAxisLabelColor']
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
      show: true,
      lineStyle: {
        color: chartVariable['splitLineColor']
      }
    },
    axisTick: {
      show: false
    },
    axisLine: {
      show: false,
      lineStyle: {
        color: chartVariable['xAxisColor']
      }
    },
    scale: true,
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

export function seriesItemLine () {
  return {
    type: 'line',
    symbol: 'circle'
  }
}

export function seriesItemLineStack () {
  return {
    type: 'line',
    symbol: 'circle',
    stack: 'stack',
    areaStyle: {}
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

// drillDown type
export function getDrillDownTool (titleObject) {
  let toolbox
  if (titleObject.xAxis.drillable && titleObject.yAxis.drillable) {
    toolbox = ['rect', 'keep', 'clear']
  } else if (titleObject.xAxis.drillable && !titleObject.yAxis.drillable) {
    toolbox = ['lineX', 'keep', 'clear']
  } else if (!titleObject.xAxis.drillable && titleObject.yAxis.drillable) {
    toolbox = ['lineY', 'keep', 'clear']
  } else {
    toolbox = ['']
  }

  return {
    brush: {
      toolbox: toolbox,
      xAxisIndex: 0,
      yAxisindex: 0
    }
  }
}

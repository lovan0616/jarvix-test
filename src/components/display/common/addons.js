
import chartVariable from '@/styles/chart/variables.scss'
import { graphic } from 'echarts/lib/export'

// 圖表的漸層色
export function linearGradient (colorStart, colorEnd, isParallel = false) {
  return new graphic.LinearGradient(isParallel ? 1 : 0, 0, 0, isParallel ? 0 : 1, [{
    offset: 0, color: colorStart
  }, {
    offset: 1, color: colorEnd
  }], false)
}

export const warningColor = [linearGradient('#FF7246', '#FF5C46')]
export const colorOnly1 = [linearGradient('#4CE2F0', '#438AF8')]
export const colorOnly2 = [linearGradient('#4CE2F0', '#438AF8'), linearGradient('#79ACFF', '#5A3FFA')]
export const color3 = ['#44D2FF', '#6C55FA', '#CA66DA']
export const color5 = ['#44D2FF', '#6C55FA', '#CA66DA', '#FF9559', '#EDF86C']

export const parallelColorOnly1 = [linearGradient('#4CE2F0', '#438AF8', true)]
export const parallelColorOnly2 = [linearGradient('#95FAF2', '#559BD5', true), linearGradient('#4BCBF1', '#416DF9', true)]

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
    containLabel: true,
    left: 18,
    bottom: 18
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
      formatter (value) {
        if (value.length > 20) {
          return value.slice(0, 19) + '...'
        }
        return value
      },
      color: chartVariable['xAxisLabelColor']
      
    }
  }
}

export function yAxisParallel () {
  const config = {
    nameGap: 5,
    fontSize: 14,
    axisLabelFontSize: 10
  }
  return {
    type: 'category',
    nameLocation: 'start',
    nameGap: config.nameGap,
    inverse: true,
    nameTextStyle: {
      color: chartVariable['textColor'],
      align: 'left'
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
      rotate: 0,
      color: chartVariable['xAxisLabelColor'],
      formatter (value) {
        if (value.length > 20) {
          return value.slice(0, 19) + '...'
        }
        return value
      }
    }
  }
}

export function yAxisDefault () {
  const config = {
    nameGap: 24,
    axisLabelFontSize: 10
  }
  return {
    nameGap: config.nameGap,
    nameTextStyle: {
      color: chartVariable['textColor'],
      align: 'left'
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
    scale: false,
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

export function yAxisMultiple () {
  const config = {
    nameGap: 24,
    axisLabelFontSize: 10
  }
  return {
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
      lineStyle: {
        color: chartVariable['xAxisColor']
      }
    },
    axisLine: {
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

export function yAxisScroll (count) {
  return [
    {
      type: 'inside',
      yAxisIndex: 0,
      filterMode: 'weakFilter',
      orient: 'vertical',
      start: 0,
      end: count,
      zoomOnMouseWheel: false,
      moveOnMouseMove: true,
      moveOnMouseWheel: true,
      preventDefaultMouseMove: true
    },
    {
      type: 'slider',
      yAxisIndex: 0,
      width: 10,
      right: 50,
      top: 70,
      bottom: 70,
      start: 0,
      end: count,
      handleSize: 0,
      showDetail: false
    }
  ]
}

export function xAxisScroll (count) {
  return [
    {
      type: 'inside',
      xAxisIndex: 0,
      filterMode: 'weakFilter',
      orient: 'horizontal',
      start: 0,
      end: count,
      zoomOnMouseWheel: false,
      moveOnMouseMove: true,
      moveOnMouseWheel: true,
      preventDefaultMouseMove: true
    },
    {
      type: 'slider',
      xAxisIndex: 0,
      height: 10,
      bottom: 0,
      start: 0,
      end: count,
      handleSize: 0,
      showDetail: false
    }
  ]
}

export function parallelZoomIn () {
  return [
    {
      type: 'inside'
    },
    {
      type: 'slider',
      xAxisIndex: 0,
      handleIcon: 'M10.7,11.9v-1.3H9.3v1.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4v1.3h1.3v-1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z',
      handleSize: '80%',
      handleStyle: {
        color: '#fff',
        shadowBlur: 3,
        shadowColor: 'rgba(0, 0, 0, 0.6)',
        shadowOffsetX: 2,
        shadowOffsetY: 2
      },
      dataBackground: {
        areaStyle: {
          color: '#fff'
        }
      },
      height: 15,
      bottom: 5,
      showDetail: false
    }
  ]
}

export function verticalZoomIn () {
  return [
    {
      type: 'inside',
      orient: 'vertical'
    },
    {
      type: 'slider',
      yAxisIndex: 0,
      handleIcon: 'M10.7,11.9v-1.3H9.3v1.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4v1.3h1.3v-1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z',
      handleSize: '80%',
      handleStyle: {
        color: '#fff',
        shadowBlur: 3,
        shadowColor: 'rgba(0, 0, 0, 0.6)',
        shadowOffsetX: 2,
        shadowOffsetY: 2
      },
      dataBackground: {
        areaStyle: {
          color: '#fff'
        }
      },
      width: 15,
      right: 50,
      top: 70,
      bottom: 70,
      showDetail: false
    }
  ]
}

export function twoAxisZoomIn () {
  return [
    {
      type: 'inside'
    },
    {
      type: 'slider',
      xAxisIndex: 0,
      handleIcon: 'M10.7,11.9v-1.3H9.3v1.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4v1.3h1.3v-1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z',
      handleSize: '80%',
      handleStyle: {
        color: '#fff',
        shadowBlur: 3,
        shadowColor: 'rgba(0, 0, 0, 0.6)',
        shadowOffsetX: 2,
        shadowOffsetY: 2
      },
      dataBackground: {
        areaStyle: {
          color: '#fff'
        }
      },
      height: 15,
      bottom: 5,
      showDetail: false
    },
    {
      type: 'slider',
      yAxisIndex: 0,
      handleIcon: 'M10.7,11.9v-1.3H9.3v1.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4v1.3h1.3v-1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z',
      handleSize: '80%',
      handleStyle: {
        color: '#fff',
        shadowBlur: 3,
        shadowColor: 'rgba(0, 0, 0, 0.6)',
        shadowOffsetX: 2,
        shadowOffsetY: 2
      },
      dataBackground: {
        areaStyle: {
          color: '#fff'
        }
      },
      width: 15,
      right: 40,
      top: 30,
      bottom: 30,
      showDetail: false
    }
  ]
}

export function seriesItemLine () {
  return {
    type: 'line',
    symbol: 'circle'
  }
}

export function seriesItemLineStack () {
  return {
    ...seriesItemLine(),
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

export function seriesItemBarStack () {
  return {
    ...seriesItemBar(),
    stack: 'stack',
    areaStyle: {}
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

export function seriesItemHeatMap () {
  return {
    type: 'heatmap',
    label: {
      show: true,
      color: '#000'
    },
    markLine: {
      lineStyle: {
        color: 'rgba(225,225,225,.3)'
      }
    }
  }
}

// drillDown type
export function getDrillDownTool (routeName, titleObject, isParallel = false, twoDirection = false) {
  let toolbox

  let xAxisDrillable = titleObject.xAxis.some(element => element.drillable)
  let yAxisDrillable = titleObject.yAxis.some(element => element.drillable)
  if (routeName === 'PersonalPagePinboard' || routeName === 'ProjectPagePinboard') {
    toolbox = ['']
  } else if (titleObject.xAxis.length === 0 && titleObject.yAxis.length === 0) {
    toolbox = ['']
  } else if (titleObject.xAxis.length === 0 && titleObject.yAxis.length > 0) {
    if (yAxisDrillable) {
      toolbox = isParallel ? ['lineX', 'keep', 'clear'] : ['lineY', 'keep', 'clear']
    } else {
      toolbox = ['']
    }
  } else if (titleObject.xAxis.length > 0 && titleObject.yAxis.length === 0) {
    if (xAxisDrillable) {
      toolbox = isParallel ? ['lineY', 'keep', 'clear'] : ['lineX', 'keep', 'clear']
    } else {
      toolbox = ['']
    }
  } else {
    if (xAxisDrillable && yAxisDrillable) {
      if (twoDirection) {
        toolbox = ['lineY', 'keep', 'clear']
      } else {
        toolbox = ['rect', 'keep', 'clear']
      }
    } else if (xAxisDrillable && !yAxisDrillable) {
      toolbox = isParallel ? ['lineY', 'keep', 'clear'] : ['lineX', 'keep', 'clear']
    } else if (!xAxisDrillable && yAxisDrillable) {
      toolbox = isParallel ? ['lineX', 'keep', 'clear'] : ['lineY', 'keep', 'clear']
    } else {
      toolbox = ['']
    }
  }

  return {
    brush: {
      toolbox: toolbox,
      xAxisIndex: 0,
      yAxisIndex: 0
    }
  }
}

export function paddingZero (n) {
  return n < 10 ? '0' + n : n
}

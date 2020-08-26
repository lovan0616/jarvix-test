import chartVariable from '@/styles/chart/variables.scss'
import { graphic } from 'echarts/lib/export'
import i18n from '@/lang/index'

// 圖表的漸層色
export function linearGradient (colorStart, colorEnd, isParallel = false) {
  return new graphic.LinearGradient(isParallel ? 1 : 0, 0, 0, isParallel ? 0 : 1, [{
    offset: 0, color: colorStart
  }, {
    offset: 1, color: colorEnd
  }], false)
}

export const colorOnly1 = [linearGradient('#4CE2F0', '#438AF8')]
export const colorOnly2 = [linearGradient('#4CE2F0', '#438AF8'), linearGradient('#79ACFF', '#5A3FFA')]
export const color5 = ['#44D2FF', '#6C55FA', '#CA66DA', '#FF9559', '#EDF86C']

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
      color: chartVariable.textColor
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
        color: chartVariable.xAxisColor
      }
    },
    axisLabel: {
      show: true,
      textStyle: {
        color: chartVariable.textColor,
        fontSize: config.axisLabelFontSize
      },
      rotate: 30,
      formatter (value) {
        if (value.length > 20) {
          return value.slice(0, 19) + '...'
        }
        return value
      },
      color: chartVariable.xAxisLabelColor

    }
  }
}

export function yAxisDefault () {
  const config = {
    nameGap: 24,
    axisLabelFontSize: 10
  }
  return {
    type: 'value',
    nameGap: config.nameGap,
    nameTextStyle: {
      color: chartVariable.textColor,
      align: 'left'
    },
    splitLine: {
      show: true,
      lineStyle: {
        color: chartVariable.splitLineColor
      }
    },
    axisTick: {
      show: false
    },
    axisLine: {
      show: false,
      lineStyle: {
        color: chartVariable.xAxisColor
      }
    },
    scale: false,
    axisLabel: {
      show: true,
      textStyle: {
        color: chartVariable.textColor,
        fontSize: config.axisLabelFontSize
      },
      color: chartVariable.yAxisLabelColor
    }
  }
}

export const legend = {
  show: true,
  type: 'scroll',
  top: 0,
  itemWidth: 12,
  itemHeight: 12,
  icon: 'circle',
  itemGap: 20,
  selectorButtonGap: 20,
  textStyle: {
    lineHeight: 14,
    color: chartVariable.textColor
  },
  pageButtonPosition: 'start',
  pageButtonGap: 16,
  pageIconColor: chartVariable.textColor,
  pageTextStyle: {
    color: chartVariable.textColor
  },
  selector: [
    {
      type: 'all or inverse',
      title: i18n.t('schedule.button.selectAll')
    }
  ],
  emphasis: {
    selectorLabel: {
      backgroundColor: '#0a3c42',
      borderColor: '#0a3c42',
      borderWidth: 2
    }
  },
  selectorLabel: {
    color: '#fff',
    backgroundColor: '#2AD2E2',
    borderColor: '#2AD2E2',
    borderWidth: 2,
    align: 'center',
    verticalAlign: 'middle',
    lineHeight: 12,
    padding: [2, 10, 2, 10]
  }
}

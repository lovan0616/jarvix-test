import chartVariable from '@/styles/chart/variables.scss'
// 與 DisplayBasicChart 共用的部分
export const commonChartOptions = {
  legend: {
    show: true,
    type: 'scroll',
    width: '80%',
    top: 0,
    left: 0,
    align: 'left',
    itemWidth: 12,
    itemHeight: 12,
    icon: 'circle',
    itemGap: 20,
    textStyle: {
      color: chartVariable['textColor']
    }
  },
  toolbox: {
    show: true,
    feature: {
      dataZoom: {},
      magicType: {type: ['line', 'bar']},
      restore: {}
    },
    iconStyle: {
      borderColor: '#fff'
    }
  },
  tooltip: {
    show: true,
    trigger: 'axis',
    backgroundColor: chartVariable['backgroundColor'],
    borderWidth: 1,
    borderColor: chartVariable['borderColor'],
    padding: 10,
    textStyle: {
      color: chartVariable['textColor']
    },
    extraCssText: 'box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.08);'
  }
}
export const chartOptions = {
  ...commonChartOptions,
  grid: {
    containLabel: true,
    right: 0,
    left: '5%'
  },
  xAxis: {
    name: '',
    nameLocation: 'end',
    nameGap: 5,
    nameTextStyle: {
      fontWeight: 'bold',
      fontSize: 16,
      color: chartVariable['textColor']
    },
    axisLabel: {
      rotate: 45,
      color: chartVariable['xAxisLabelColor']
    },
    axisLine: {
      lineStyle: {
        color: chartVariable['textColor']
      }
    },
    // 刻度
    axisTick: {
      show: false
    }
  },
  yAxis: {
    type: 'value',
    name: '',
    // nameGap: 58,
    // nameLocation: 'middle',
    nameTextStyle: {
      fontWeight: 'bold',
      fontSize: 16,
      color: chartVariable['textColor']
    },
    axisLabel: {
      color: chartVariable['yAxisLabelColor']
    },
    axisLine: {
      show: false
    },
    axisTick: {
      show: false
    }
  },
  series: []
}

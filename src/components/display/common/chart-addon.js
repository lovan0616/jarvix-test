import chartVariable from '@/styles/chart/variables.scss'
export const chartOptions = {
  tooltip: {
    trigger: 'axis',
    backgroundColor: chartVariable['backgroundColor'],
    borderWidth: 1,
    borderColor: chartVariable['borderColor'],
    padding: 10,
    textStyle: {
      color: chartVariable['textColor']
    },
    extraCssText: 'box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.08);'
  },
  grid: {
    containLabel: true,
    right: 0
  },
  xAxis: {
    name: '',
    nameLocation: 'middle',
    nameGap: 40,
    nameTextStyle: {
      fontWeight: 'bold',
      fontSize: 16,
      color: chartVariable['textColor']
    },
    axisLabel: {
      rotate: 45,
      color: chartVariable['xAxisLabelColor']
    },
    // 刻度
    axisTick: {
      show: false
    }
  },
  yAxis: {
    type: 'value',
    name: '',
    nameGap: 58,
    nameLocation: 'middle',
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

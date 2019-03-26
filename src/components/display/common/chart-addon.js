export default {
  tooltip: {
    trigger: 'axis'
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
      color: '#444'
    },
    axisLabel: {
      rotate: 45,
      color: '#979797'
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
      color: '#444'
    },
    axisLabel: {
      color: '#999999'
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

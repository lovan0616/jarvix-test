
const colorListDefault = ['#0f9696', '#1f3a3d', '#325157', '#48666a', '#67888e', '#78a5a9', '#9fc2c6', '#d1e3e5', '#e4f0f0', '#e1e1e1', '#d5d5d5', '#c3c3c3']

export function colorDefault () {
  return colorListDefault
}

export function tooltipDefault () {
  return {
    trigger: 'axis',
    axisPointer: {
      type: 'shadow'
    },
    formatter: function (params) {
      return `
        <div class="sy-echart-tooltip-default">
          <p class="sy-echart-tooltip-default-title">
            工站項目: <span class="sy-echart-tooltip-default-title-value">${params[0].name}</span>
          </p>
          <ul class="sy-echart-tooltip-default-ul">
            ${params.map(renderList((item, index) => `
              <li class="sy-echart-tooltip-default-li">
                <div class="sy-echart-tooltip-default-li-marker">
                  ${item.marker}
                  <p class="sy-echart-tooltip-default-li-marker-text">
                    ${item.seriesName}
                  </p>
                </div>
                <div style="sy-echart-tooltip-default-li-value">
                  ${(item.value[index + 1] !== undefined) ? item.value[index + 1] : item.value}
                </div>
              </li>
            `)).join('')}
          </ul>
        </div>
      `
    },
    backgroundColor: 'transparent'
  }
}

export function tooltipReverse () {
  return {
    trigger: 'axis',
    axisPointer: {
      type: 'shadow'
    },
    formatter: function (params) {
      return `
        <div class="sy-echart-tooltip-default">
          <p class="sy-echart-tooltip-default-title">
            工站項目: <span class="sy-echart-tooltip-default-title-value">${params[0].name}</span>
          </p>
          <ul class="sy-echart-tooltip-default-ul">
            ${params.reverse().map(renderList((item, index) => `
              <li class="sy-echart-tooltip-default-li">
                <div class="sy-echart-tooltip-default-li-marker">
                  ${item.marker}
                  <p class="sy-echart-tooltip-default-li-marker-text">
                    ${item.seriesName}
                  </p>
                </div>
                <div style="sy-echart-tooltip-default-li-value">
                  ${(item.value[index + 1] !== undefined) ? item.value[index + 1] : item.value}
                </div>
              </li>
            `)).join('')}
          </ul>
        </div>
      `
    },
    backgroundColor: 'transparent'
  }
}

function renderList (template) {
  return function (...args) {
    if (!args[0].value) return
    if (args[0].seriesType === 'line') return ''
    return template(...args)
  }
}

export function xAxisDefault () {
  return {
    type: 'category',
    // name: xTitle,
    nameLocation: 'middle',
    // nameTextStyle: {
    //   color: '#006464',
    //   fontSize: '14'
    // },
    nameGap: 45,

    // axisLabel: {
    //   color: '#006464',
    //   fontSize: '14',
    //   fontWeight: 300
    // },
    axisTick: {
      show: false
    }
  }
}

export function yAxisDefault () {
  return {
    // max: yAxisMax,
    // type: 'value',
    // name: yTitle,
    nameLocation: 'middle',
    // nameTextStyle: {
    //   color: '#006464',
    //   fontSize: '14'
    // },
    // nameRotate: 0,
    nameGap: 45,
    // axisLabel: {
    //   color: '#006464',
    //   fontSize: '14',
    //   fontWeight: 300
    // },
    axisTick: {
      show: false
    },
    axisLine: {
      show: false
    }
  }
}

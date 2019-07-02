import Vue from 'vue'

// 全站共用的 function，會注入每個 component 當中
Vue.mixin({
  methods: {
    /**
     *  字串加密 https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/atob
     * encodeURIComponent: 處理中轉英以及特殊字元像是 '@' 的編碼
     * btoa: base64編碼
     */
    encodeValue (value) {
      if (!value) return false
      return window.btoa(encodeURIComponent(value))
    },
    // 將 /n 改成 <br> 換行顯示
    lineBreak (str) {
      return str ? str.replace(/\n|\r\n/g, '<br/>') : ''
    },
    // byte 轉 MB
    byteToMB (value) {
      return (value / (1024 * 1024)).toFixed(2)
    },
    // timeStamp 轉成 YYYY-MM-DD
    timeStampToDate (time) {
      let datetime = new Date()
      datetime.setTime(time * 1000)
      let year = datetime.getFullYear()
      let month = datetime.getMonth() + 1
      let date = datetime.getDate()
      return year + '-' + this.paddingZero(month) + '-' + this.paddingZero(date)
    },
    // timeStamp 轉成 YYYY-MM-DD HH:mm
    timeStampToDateTime (time) {
      let datetime = new Date()
      datetime.setTime(time * 1000)
      let year = datetime.getFullYear()
      let month = datetime.getMonth() + 1
      let date = datetime.getDate()
      let hour = datetime.getHours()
      let minute = datetime.getMinutes()
      return `${year}-${this.paddingZero(month)}-${this.paddingZero(date)} ${this.paddingZero(hour)}:${this.paddingZero(minute)}`
    },
    // timeStamp 轉成 YYYY/MM/DD HH:mm
    timeStampToDateTime2 (time) {
      let datetime = new Date()
      datetime.setTime(time * 1000)
      let year = datetime.getFullYear()
      let month = datetime.getMonth() + 1
      let date = datetime.getDate()
      let hour = datetime.getHours()
      let minute = datetime.getMinutes()
      return `${year}/${this.paddingZero(month)}/${this.paddingZero(date)} ${this.paddingZero(hour)}:${this.paddingZero(minute)}`
    },
    // 時間補十分位，為了滿足 YYYY-MM-DD 格式
    paddingZero (n) {
      return n < 10 ? '0' + n : n
    },
    // 後端設計 MySQL/SQLITE 的 storage type 都叫 SQLITE，不得以只好前端自己轉換
    getStorageType (value) {
      switch (value) {
        case 'CSV':
          return 'CSV'
        case 'mysql':
        case 'SQLITE':
          return 'SQLITE'
      }
    },
    // 藉由後端的 template 名稱對應到前端的 component name
    getChartTemplate (value) {
      switch (value) {
        case 'bar_chart':
          return 'DisplayBarChart'
        case 'bar_chart_average':
          return 'DisplayAverageBarChart'
        case 'box_plot':
          return 'DisplayBoxPlotChart'
        case 'bubble_scatter_chart':
          return 'DisplayBubbleScatterChart'
        case 'color_scatter_chart':
          return 'DisplayGroupScatterChart'
        case 'histogram':
          return 'DisplayHistogramChart'
        case 'line_chart':
          return 'DisplayLineChart'
        case 'pie_chart':
          return 'DisplayPieChart'
        case 'scatter_chart':
          return 'DisplayScatterChart'
        case 'table':
          return 'SyTable'
        case 'tree_map':
          return 'DisplayTreeMapChart'
      }
    },
    // 圖表在preview 時，不顯示 legend、tootltip、 X\Y 軸的label
    previewChartSetting (config) {
      config.legend.show = false
      config.tooltip.show = false
      config.xAxis.show = false
      config.yAxis.axisLabel.show = false
      config.yAxis.name = null

      return config
    }
  }
})

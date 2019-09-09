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
        case 'pivot_table':
          return 'preview-pivot'
      }
    },
    // 圖表在preview 時，不顯示 legend、tootltip
    previewChartSetting (config) {
      config.legend.show = false
      config.tooltip.show = false
      config.toolbox.show = false
      //  X\Y 軸的label
      // config.xAxis.show = false
      // config.yAxis.axisLabel.show = false
      // config.yAxis.name = null

      return config
    },
    objectToArray (obj) {
      return Object.keys(obj).map(element => {
        obj[element].id = element
        return obj[element]
      })
    },
    // 參考： https://gist.github.com/joshcanhelp/a3a669df80898d4097a1e2c01dea52c1
    // https://stackoverflow.com/questions/21474678/scrolltop-animation-without-jquery
    scrollTo (scrollToObj, scrollDuration) {
      // Set a default for where we're scrolling to
      let scrollDistance = 0
      // Assuming this is a selector we can use to find an element
      // var scrollToObj = document.getElementById(scrollTo)
      if (scrollToObj && typeof scrollToObj.getBoundingClientRect === 'function') {
        scrollDistance = window.pageYOffset + scrollToObj.getBoundingClientRect().top - 80
      }

      // Set this a bit higher
      var anchorHeightAdjust = 30
      if (scrollDistance > anchorHeightAdjust) {
        scrollDistance = scrollDistance - anchorHeightAdjust
      }

      // Set a default for the duration
      if (typeof scrollDuration !== 'number' || scrollDuration < 0) {
        scrollDuration = 1000
      }

      // Declarations
      var cosParameter = (window.pageYOffset - scrollDistance) / 2
      var scrollCount = 0
      var oldTimestamp = window.performance.now()

      function step (newTimestamp) {
        var tsDiff = newTimestamp - oldTimestamp

        // Performance.now() polyfill loads late so passed-in timestamp is a larger offset
        // on the first go-through than we want so I'm adjusting the difference down here.
        // Regardless, we would rather have a slightly slower animation than a big jump so a good
        // safeguard, even if we're not using the polyfill.
        if (tsDiff > 100) {
          tsDiff = 30
        }

        scrollCount += Math.PI / (scrollDuration / tsDiff)

        // As soon as we cross over Pi, we're about where we need to be
        if (scrollCount >= Math.PI) {
          return
        }

        var moveStep = Math.round(scrollDistance + cosParameter + cosParameter * Math.cos(scrollCount))
        console.log(moveStep)
        window.scrollTo(0, moveStep)
        oldTimestamp = newTimestamp
        window.requestAnimationFrame(step)
      }

      window.requestAnimationFrame(step)
    }
  }
})

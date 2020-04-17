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
      let result
      if (value / (1024 * 1024) * 100 < 1) {
        result = this.formatComma((value / 1024).toFixed(2)) + 'KB'
      } else {
        result = this.formatComma((value / (1024 * 1024)).toFixed(2)) + 'MB'
      }

      return result
    },
    // 標註千分位
    formatComma (str) {
      return str ? str.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') : str
    },
    timeToDate (time) {
      let datetime = new Date(time)
      let year = datetime.getFullYear()
      let month = datetime.getMonth() + 1
      let date = datetime.getDate()
      return year + '-' + this.paddingZero(month) + '-' + this.paddingZero(date)
    },
    timeToFileName (time) {
      let datetime = new Date(parseInt(time))
      let year = datetime.getFullYear()
      let month = datetime.getMonth() + 1
      let date = datetime.getDate()
      let hour = datetime.getHours()
      let minute = datetime.getMinutes()
      return `${year}-${this.paddingZero(month)}-${this.paddingZero(date)}-${this.paddingZero(hour)}${this.paddingZero(minute)}`
    },
    // 轉成 YYYY-MM-DD HH:mm
    timeToDateTime (time) {
      let datetime = new Date(time)
      let year = datetime.getFullYear()
      let month = datetime.getMonth() + 1
      let date = datetime.getDate()
      let hour = datetime.getHours()
      let minute = datetime.getMinutes()
      return `${year}-${this.paddingZero(month)}-${this.paddingZero(date)} ${this.paddingZero(hour)}:${this.paddingZero(minute)}`
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
    getLayout (value) {
      switch (value) {
        case 'general':
          return 'GeneralResult'
        case 'correlation_exploration':
          return 'CorrelationExplorationResult'
        case 'root_cause':
          return 'RootCauseResult'
        case 'no_answer':
          return 'EmptyResult'
      }
    },
    datasetTransform (dataset) {
      function checkSpace (element) {
        return isNaN(Number(element)) ? element : ' ' + element
      }
      /**
       * 如果 columns 的名稱為數字，就補個空格給他，不然會被 echarts 辨識為數字
       * 先判斷 display_column 有沒有值，有就顯示 display_column 的資訊
       **/
      let dataColumn
      if (dataset.display_columns) {
        dataColumn = dataset.display_columns.map(element => checkSpace(element))
      } else {
        dataColumn = dataset.columns.map(element => checkSpace(element))
      }

      let result = dataset.data.map((element, index) => {
        return [dataset.display_index ? dataset.display_index[index] : dataset.index[index], ...element]
      })
      return [['index', ...dataColumn], ...result]
    },
    // 藉由後端的 template 名稱對應到前端的 component name
    getChartTemplate (value) {
      switch (value) {
        case 'root_cause_chart':
        case 'bar_chart':
          return 'DisplayBarChart'
        case 'bar_chart_average':
          return 'DisplayAverageBarChart'
        case 'multi_axis_bar_chart':
          return 'DisplayMultiAxisBarChart'
        case 'multi_axis_line_chart':
          return 'DisplayMultiAxisLineChart'
        case 'parallel_bar_chart':
          return 'DisplayParallelBarChart'
        case 'box_plot':
          return 'DisplayBoxPlotChart'
        case 'computed_box_plot':
          return 'DisplayComputedBoxPlotChart'
        case 'bubble_scatter_chart':
          return 'DisplayBubbleScatterChart'
        case 'color_scatter_chart':
          return 'DisplayGroupScatterChart'
        case 'histogram':
          return 'DisplayHistogramChart'
        case 'line_chart':
          return 'DisplayLineChart'
        case 'stack_line_chart':
          return 'DisplayStackLineChart'
        case 'composition_line_chart':
          return 'DisplayCompositionLineChart'
        case 'predict_line_chart':
          return 'DisplayPredictChart'
        case 'pie_chart':
          return 'DisplayPieChart'
        case 'scatter_correlation_chart':
        case 'scatter_chart':
          return 'DisplayScatterChart'
        case 'table':
          return 'SyTable'
        case 'tree_map':
          return 'DisplayTreeMapChart'
        case 'computed_pivot_table':
          return 'DisplayPivotTable'
        case 'world_map':
          return 'DisplayWorldMap'
        case 'title':
          return 'ResultBoardHeader'
        case 'basic_info':
          return 'InsightTable'
        case 'feature_importance':
          return 'DisplayCorrelationFeatures'
        case 'correlation_insight':
          return 'CorrelationInsight'
        case 'root_cause_item':
          return 'RootCauseItem'
        case 'root_cause_description':
          return 'RootCauseDescription'
        case 'root_cause_info':
        case 'general_insight':
          return 'RootCauseInfo'
        case 'sankey_chart':
          return 'DisplaySankeyChart'
        case 'trend_insight':
          return 'TrendRootCause'
        case 'heat_map_chart':
          return 'DisplayHeatMapChart'
        case 'no_answer':
          return 'DisplayNoAnswerInfo'
      }
    },
    // 整個結果頁的 layout
    getLayoutTemplate (value) {
      switch (value) {
        case 'general':
          return 'GeneralResult'
      }
    },
    roundNumber (value, count = 2) {
      if (typeof value === 'string') value = Number(value)
      return parseFloat((value).toFixed(count))
    },
    // export data
    exportCSVFile (el, question, data) {
      let exportFunction = (e) => {
        if (e.target && e.target.id === 'export-btn') {
          /**
           * 在結果頁下載資料可以從 url 上拿到時間資訊
           * 但是 pinboard 頁無法
           */
          let fileName = window.location.search.split('&')[1]
            ? this.timeToFileName(window.location.search.split('&')[1].split('stamp=')[1]) + '_' + question
            : question
          /**
           * 注意！！
           * 這邊的資料不從 data 拿
           * 註冊事件當下由 function 傳進的 data，遇到 pagination 更新資料後
           * 便不再拿取新的 data，所以暫時改由 vue instance 內的 computed options 去拿
           */
          this.exportToCSV(fileName, data.options.dataset.source)
        }
      }
      /**
       * 注意！！
       * 這邊是為了避免 pagination 更新後，又重新註冊事件
       * 所以在 DOM 上面新增屬性，去判斷說是不是已經註冊過事件
       * 暫時沒想到更好的處理方式
       **/
      if (el.getAttribute('listener') !== 'true') {
        el.addEventListener('click', exportFunction, false)
        el.setAttribute('listener', true)
      }
    },
    exportToCSV (filename, rows) {
      let fileName = filename + '.csv' || this.timeToFileName(new Date().getTime()) + '.csv'
      let processRow = (row) => {
        let finalVal = ''
        for (let j = 0; j < row.length; j++) {
          let innerValue = row[j] === null ? '' : row[j].toString()
          if (row[j] instanceof Date) {
            innerValue = row[j].toLocaleString()
          };
          let result = innerValue.replace(/"/g, '""')
          if (result.search(/("|,|\n)/g) >= 0) {
            result = '"' + result + '"'
          }
          if (j > 0) {
            finalVal += ','
          }
          finalVal += result
        }
        return finalVal + '\n'
      }

      let csvFile = ''
      for (let i = 0; i < rows.length; i++) {
        csvFile += processRow(rows[i])
      }

      // 前置的 '\uFEFF' 為零寬不換行空格，處理中文亂碼問題
      let blob = new Blob(['\uFEFF' + csvFile], { type: 'text/csv;charset=utf-8;' })
      if (navigator.msSaveBlob) {
        // IE 10+
        navigator.msSaveBlob(blob, fileName)
      } else {
        let link = document.createElement('a')
        if (link.download !== undefined) {
          // Browsers that support HTML5 download attribute
          let url = URL.createObjectURL(blob)
          link.setAttribute('href', url)
          link.setAttribute('download', fileName)
          link.style.visibility = 'hidden'
          document.body.appendChild(link)
          link.click()
          document.body.removeChild(link)
        }
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
        window.scrollTo(0, moveStep)
        oldTimestamp = newTimestamp
        window.requestAnimationFrame(step)
      }

      window.requestAnimationFrame(step)
    },
    lowercaseFirstLetter (string) {
      return string.charAt(0).toLowerCase() + string.slice(1)
    },
    currentRouteName () {
      const routeName = this.$route.name
      return this.$t('sideNav.' + this.lowercaseFirstLetter(routeName))
    }
  }
})

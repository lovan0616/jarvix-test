import Vue from 'vue'
import moment from 'moment'
import i18n from '@/lang/index.js'
import { getAlertConditions } from '@/API/Alert'

// 全站共用的 function，會注入每個 component 當中
Vue.mixin({
  filters: {
    convertTimeStamp (timeStamp) {
      if (!timeStamp) return '-'
      const date = new Date(timeStamp)
      const year = date.getFullYear()
      const month = date.getMonth() + 1
      const day = date.getDate()
      const hour = date.getHours().toString().padStart(2, '0')
      const minute = date.getMinutes().toString().padStart(2, '0')
      return `${year}/${month}/${day} ${hour}:${minute}`
    }
  },
  data () {
    return {
      warRoomTimeIntervalList: [
        {
          value: '1+Hour',
          name: i18n.t('warRoom.inHours')
        },
        {
          value: '1+Day',
          name: i18n.t('warRoom.inDays')
        },
        {
          value: '1+Week',
          name: i18n.t('warRoom.inWeeks')
        },
        {
          value: '1+Month',
          name: i18n.t('warRoom.inMonths')
        },
        {
          value: '1+Season',
          name: i18n.t('warRoom.inSeasons')
        },
        {
          value: '1+Year',
          name: i18n.t('warRoom.inYears')
        },
        {
          value: 'others',
          name: i18n.t('warRoom.customize')
        }
      ],
      timeScopeUnitOptionList: [
        { value: 'Second', name: i18n.t('timeScopeUnit.second') },
        { value: 'Minute', name: i18n.t('timeScopeUnit.minute') },
        { value: 'Hour', name: i18n.t('timeScopeUnit.hour') },
        { value: 'Day', name: i18n.t('timeScopeUnit.day') },
        { value: 'Week', name: i18n.t('timeScopeUnit.week') },
        { value: 'Month', name: i18n.t('timeScopeUnit.month') },
        { value: 'Season', name: i18n.t('timeScopeUnit.season') },
        { value: 'Year', name: i18n.t('timeScopeUnit.year') }
      ]
    }
  },
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
      if (!str || str === 'NaN') return str
      // 如果進來的字串已經有帶千分位先拔除
      if (typeof str === 'string') str = str.replace(new RegExp(',', 'g'), '')
      // 只處理整數位，不處理小數點位
      const isInt = Number.isInteger(Number(str))
      if (isInt) return str.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
      return str.toString().split('.')[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',') + '.' + str.toString().split('.')[1]
    },
    transformInt (num1, num2, padZeno, compute) {
      num1 = '' + num1
      num2 = '' + num2
      let p1 = 0
      let p2 = 0

      if (num1.split('.')[1]) {
        p1 = num1.split('.')[1].length
      }
      if (num2.split('.')[1]) {
        p2 = num2.split('.')[1].length
      }

      if (padZeno) {
        while (p1 < p2) {
          p1++
          num1 += '0'
        }
        while (p2 < p1) {
          p2++
          num2 += '0'
        }
      }
      let int1 = parseInt(num1.replace('.', ''), 10)
      let int2 = parseInt(num2.replace('.', ''), 10)
      return compute(int1, int2, p1, p2)
    },
    /* 浮點數相加 */
    floatAdd (num1, num2) {
      return this.transformInt(num1, num2, true, (int1, int2, p1, p2) => {
        return (int1 + int2) / Math.pow(10, p1)
      })
    },
    /* 浮點數相減 */
    floatSub (num1, num2) {
      return this.transformInt(num1, num2, true, (int1, int2, p1, p2) => {
        return (int1 - int2) / Math.pow(10, p1)
      })
    },
    /* 浮點數相乘 */
    floatMul (num1, num2) {
      return this.transformInt(num1, num2, false, (int1, int2, p1, p2) => {
        return (int1 * int2) / Math.pow(10, p1 + p2)
      })
    },
    /* 浮點數相除 */
    floatDiv (num1, num2) {
      return this.transformInt(num1, num2, false, (int1, int2, p1, p2) => {
        return (int1 / int2) / Math.pow(10, p1 - p2)
      })
    },
    /* 去除浮點數計算 造成的長尾數 https://www.itread01.com/content/1545644704.html */
    displayFloat (num, precision = 12) {
      return parseFloat(num.toPrecision(precision))
    },
    timeToDate (time) {
      return moment(time).format('YYYY-MM-DD')
    },
    timeToFileName (time) {
      return moment(Number(time)).format('YYYY-MM-DD-HHmm')
    },
    // 轉成 YYYY-MM-DD HH:mm
    timeToDateTime (time) {
      return moment(time).format('YYYY-MM-DD HH:mm')
    },
    timeToDateTimeSecondPrecision (time) {
      return moment(time).format('YYYY-MM-DD HH:mm:ss')
    },
    customerTimeFormatter (time, timeScope, isRangeEnd = false) {
      // 處理季
      if (timeScope === 'QUARTER' && isRangeEnd) {
        // 結束時間再加三個月
        const format = this.getDatePickerOptions(timeScope).format.replace('dd', 'DD').replace('yyyy', 'YYYY')
        return moment.utc(time).add(2, 'month').format(format)
      }

      if (timeScope === 'WEEK') {
        /* 當一年最後一週跨到下一年
         * moment js 與後端回傳的 week 不同
         * EX: 2018-12-30(日)禮拜天落在 2018年第52週，但後端會傳 2019年第一週
        */
        let weekCrossYear = moment.utc(time).format('YYYY') !== moment.utc(time).add(1, 'weeks').format('YYYY')
        let year = weekCrossYear ? moment.utc(time).add(1, 'weeks').format('YYYY') : moment.utc(time).format('YYYY')
        return `${year}-${i18n.tc('timeScopeUnit.allowArg.week', moment.utc(time).week())}`
      }
      const format = this.getDatePickerOptions(timeScope).format.replace('dd', 'DD').replace('yyyy', 'YYYY')
      return moment.utc(time).format(format)
    },
    // 在使用 TimePicker 時，把後端的 timeScope 對印到 element-ui 的 type, format
    getDatePickerOptions (timeScope) {
      switch (timeScope) {
        case 'SECOND':
        case 'MINUTE':
        case 'HOUR':
          return {
            type: 'datetime',
            format: 'yyyy-MM-dd HH:mm:ss'
          }
        case 'DAY':
          return {
            type: 'date',
            format: 'yyyy-MM-dd'
          }
        case 'WEEK':
          return {
            type: 'week',
            format: 'yyyy-W WW'
          }
        case 'MONTH':
        case 'QUARTER':
          return {
            type: 'month',
            format: 'yyyy-MM'
          }
        case 'YEAR':
          return {
            type: 'year',
            format: 'yyyy'
          }
        default:
          return {
            type: 'datetime',
            format: 'yyyy-MM-dd HH:mm:ss'
          }
      }
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
        case 'preview_data_source':
          return 'DataPreviewLayout'
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
        return [dataset.display_index ? String(dataset.display_index[index]) : String(dataset.index[index]), ...element]
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
        case 'computed_histogram':
          return 'DisplayComputedHistogramChart'
        case 'line_chart':
          return 'DisplayLineChart'
        case 'stack_line_chart':
          return 'DisplayStackLineChart'
        case 'composition_line_chart':
          return 'DisplayCompositionLineChart'
        case 'predict_line_chart':
          return 'DisplayPredictChart'
        case 'line_confidential_interval_chart':
          return 'DisplayLineConfidentialIntervalChart'
        case 'periodic_line_charts':
          return 'DisplayPeriodicLineCharts'
        case 'pie_chart':
          return 'DisplayPieChart'
        case 'scatter_correlation_chart':
        case 'scatter_chart':
          return 'DisplayScatterChart'
        case 'scatter_probability_density_chart':
          return 'DisplayScatterProbabilityDensityChart'
        case 'scatter_cluster_chart':
          return 'DisplayScatterClusterChart'
        case 'table':
          return 'SyTable'
        case 'tree_map':
          return 'DisplayTreeMapChart'
        case 'computed_pivot_table':
          return 'DisplayPivotTable'
        case 'world_map':
          return 'DisplayWorldMap'
        case 'basic_info':
          return 'InsightTable'
        case 'feature_importance':
          return 'DisplayCorrelationFeatures'
        case 'correlation_insight':
          return 'CorrelationInsight'
        case 'recommended_insight':
          return 'RecommendedInsight'
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
        case 'DEMO1_INSIGHT': // 光電展特殊元件
          return 'TrendRootCauseOEDemo'
        case 'heat_map_chart':
          return 'DisplayHeatMapChart'
        case 'no_answer':
          return 'DisplayNoAnswerInfo'
        case 'index_info':
          return 'DisplayIndexInfo'
        case 'text_info':
          return 'DisplayTextInfo'
        case 'param_comparison_table':
          return 'ParameterComparisonTable'
        case 'difference_insight':
          return 'DisplayDifferenceInsight'
      }
    },
    // 藉由後端的 result denotation 名稱取得前端的顯示資訊
    getSwitchTypeInfoList (denotation) {
      switch (denotation) {
        case 'OVERVIEW':
          return { name: i18n.t('denotation.dataOverview'), icon: 'basic-info' }
        case 'CLUSTERING':
          return { name: i18n.t('denotation.clusteringAnalysis'), icon: 'clustering' }
        case 'CORRELATION_VERIFICATION':
          return { name: i18n.t('denotation.correlationAnalysis'), icon: 'correlation-analysis' }
        case 'PREDICTION':
          return { name: i18n.t('denotation.predictionAnalysis'), icon: 'telescope' }
        case 'TREND':
          return { name: i18n.t('denotation.trendAnalysis'), icon: 'trend' }
        case 'ANOMALY':
          return { name: i18n.t('denotation.anomalyAnalysis'), icon: 'anomaly-analysis' }
        case 'SEASONALITY':
          return { name: i18n.t('denotation.periodicityAnalysis'), icon: 'cycle' }
        case 'NORMALITY_TEST':
          return { name: i18n.t('denotation.normalityTest'), icon: 'normality-analysis' }
        case 'STABILITY':
          return { name: i18n.t('denotation.stabilityAnalysis'), icon: 'stability-analysis' }
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
    addCSVDownloadTask (question, componentId) {
      let taskList = this.$store.state.result.tableDataCSVDownloadList
      if (taskList.some(task => task.componentId === componentId)) return
      this.$store.commit('result/updateTableDataCSVDownloadList', {
        question: question,
        componentId: componentId,
        status: 'Ready'
      })
    },
    exportCSVFile (el, question, data) {
      let exportFunction = (e) => {
        if (e.target && e.target.id === 'export-btn') {
          /**
           * 注意！！
           * 這邊的資料不從 data 拿
           * 註冊事件當下由 function 傳進的 data，遇到 pagination 更新資料後
           * 便不再拿取新的 data，所以暫時改由 vue instance 內的 computed options 去拿
           */
          // 還有資料沒有拿回，直接打 API 下載所有資料
          if (data.hasPagination && data.canDownloadCsv) return this.addCSVDownloadTask(question, data.componentId)

          this.exportToCSV(question, data.options.dataset.source)
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
    downloadCSV (question, csvFile) {
      /**
       * 在結果頁下載資料可以從 url 上拿到時間資訊
       * 但是 pinboard 頁無法
       */
      let fileName = window.location.search.split('&')[1]
        ? this.timeToFileName(window.location.search.split('&')[1].split('stamp=')[1]) + '_' + question + '.csv'
        : this.timeToFileName(new Date().getTime()) + '.csv'
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
    exportToCSV (question, rows) {
      let processRow = (row) => {
        let finalVal = ''
        for (let j = 0; j < row.length; j++) {
          let innerValue = row[j] === null ? '' : row[j].toString()
          if (row[j] instanceof Date) {
            innerValue = row[j].toLocaleString()
          }
          if (typeof row[j] === 'number') {
            innerValue = this.formatComma(innerValue)
          }
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

      this.downloadCSV(question, csvFile)
    },
    // 圖表在preview 時，不顯示 legend、tooltip
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
    getChartMaxData (dataset) {
      let maxValue = [...dataset[0]]
      // 多組數據，需要存多組 maxValue
      dataset.forEach(row => {
        row.forEach((data, index) => {
          maxValue[index] = Math.max(data, maxValue[index])
        })
      })
      return maxValue
    },
    chartLabelFormatter (num, maxValue) {
      if (num === 0) return num
      /* format value 的規則是
      * 數線上用到最大單位的數值需要到小數點後第 2 位（因為量級有差距時，小單位的數值其實在數線上看起來不會有明顯差別）
      * EX: 若同時有 aM, bK，只有單位是 aM 且和 maxValue 差不到十倍的要顯示到小數點後第 2 位
      *     若所有的單位都是 K，則全部和 maxValue 差不到十倍的 bK 都要顯示到小數點後第 2 位
      */
      let lessThanTenTimes = maxValue / num <= 10
      let numberFixedDigits = lessThanTenTimes ? 2 : 0
      return this.shortenNumber(num, numberFixedDigits)
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
    },
    shortenNumber (num, digit) {
      const absValue = Math.abs(num)
      if (absValue === 0) return num
      if (absValue >= 1000000000000000000) return parseFloat((num / 1000000000000000000).toFixed(digit)) + 'Q'
      if (absValue >= 1000000000000000) return parseFloat((num / 1000000000000000).toFixed(digit)) + 'q'
      if (absValue >= 1000000000000) return parseFloat((num / 1000000000000).toFixed(digit)) + 't'
      if (absValue >= 1000000000) return parseFloat((num / 1000000000).toFixed(digit)) + 'B'
      if (absValue >= 1000000) return parseFloat((num / 1000000).toFixed(digit)) + 'M'
      if (absValue >= 1000) return parseFloat((num / 1000).toFixed(digit)) + 'K'
      if (absValue >= 0.01) return parseFloat(num.toFixed(digit))
      return '<' + Math.sign(num) * 0.01
    },
    shortenDataCapacityNumber (gb, digit = 2) {
      if (gb <= 0.5) return this.formatComma((gb * 1024).toFixed(digit)) + ' MB'
      return this.formatComma((gb).toFixed(digit)) + ' GB'
    },
    checkProperty (testObject, key) {
      return Object.prototype.hasOwnProperty.call(testObject, key)
    },
    accountRoleToCamelCase (str) {
      return str.replace(/(\w)(_)(\w)/g, (match, $1, $2, $3) => `${$1}${$3.toUpperCase()}`)
    },
    getAccountRoleLocaleName (accountRole) {
      return this.$t(`userManagement.${this.accountRoleToCamelCase(accountRole)}`)
    },
    checkShouldApplyMiniAppFilter (filter, mainDateColumn = null) {
      switch (filter.statsType) {
        case 'RELATIVEDATETIME':
          // 如果當前 dataframe 無日期欄位，或相對時間選全選時，不需帶入限制中
          return mainDateColumn && filter.dataValues.length > 0 && filter.dataValues[0] !== 'unset'
        case 'NUMERIC':
        case 'FLOAT':
        case 'DATETIME':
          return filter.start && filter.end
        case 'CATEGORY':
        case 'BOOLEAN':
          return filter.dataValues.length > 0
        default:
          return false
      }
    },
    fetchMiniAppActiveWarningConditions (settingData) {
      if (
        !settingData.activate ||
        !settingData.conditions ||
        settingData.conditions.length === 0
      ) return Promise.resolve([])

      const appConditionIds = settingData.conditions.map(item => item.id)
      const conditionIdSet = new Set(appConditionIds)

      // 取得當前 app active 狀態的示警條件
      return getAlertConditions(this.getCurrentGroupId)
        .then(conditions => {
          let appConditions = []
          appConditions = conditions.reduce((acc, cur) => {
            if (!cur.active || !conditionIdSet.has(cur.id)) return acc
            acc.push(cur.id)
            return acc
          }, [])
          return appConditions
        })
    },
    hasDuplicatedElements (array) {
      return new Set(array).size < array.length
    }
  }
})

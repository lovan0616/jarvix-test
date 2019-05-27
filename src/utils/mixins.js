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
      return (value / (1024 * 1024)).toFixed(4)
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
    // 時間補十分位，為了滿足 YYYY-MM-DD 格式
    paddingZero (n) {
      return n < 10 ? '0' + n : n
    }
  }
})

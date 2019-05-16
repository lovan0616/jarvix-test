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
    }
  }
})

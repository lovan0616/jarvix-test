export default class SpeechCognition {
  constructor ({ onStart, onResult, onError, onEnd, lang }) {
    this.isSupport = this.checkSuport()
    if (!this.isSupport) return
    // eslint-disable-next-line
    this.recognition = new webkitSpeechRecognition() // 建立語音辨識物件 webkitSpeechRecognition
    this.recognition.continuous = true // 設定連續辨識模式
    this.recognition.interimResults = true // 設定輸出中先結果。
    this.recognition.onstart = this.onstart(onStart)
    this.recognition.onresult = this.onresult(onResult)
    this.recognition.onerror = this.onerror(onError)
    this.recognition.onend = this.onend(onEnd)
    this.recognition.lang = lang || 'cmn-Hant-TW'
    this.isRecognizing = false
    this.interimTranscript = ''
    this.finalTranscript = ''
  }

  checkSuport () {
    if (!('webkitSpeechRecognition' in window)) return false
    else return true
  }

  onstart (callback) {
    if (typeof callback !== 'function') callback = function () { }
    return () => callback()
  }

  onend (callback) {
    if (typeof callback !== 'function') callback = function () { }
    return () => callback()
  }

  onerror (callback) {
    if (typeof callback !== 'function') callback = function () { }
    return (e) => callback(e)
  }

  onresult (callback) {
    if (typeof callback !== 'function') callback = function () { }
    return (event) => {
      this.interimTranscript = '' // 中間結果
      for (let i = event.resultIndex; i < event.results.length; ++i) { // 對於每一個辨識結果
        if (event.results[i].isFinal) { // 如果是最終結果
          this.finalTranscript += event.results[i][0].transcript // 將其加入最終結果中
        } else { // 否則
          this.interimTranscript += event.results[i][0].transcript // 將其加入中間結果中
        }
      }
      // 如果有最終辨識文字
      if (this.finalTranscript.trim().length > 0) callback(this.finalTranscript) // 顯示最終辨識文字
      // 如果有中間辨識文字
      else if (this.interimTranscript.trim().length > 0) callback(this.interimTranscript) // 顯示中間辨識文字
    }
  }

  reset () {
    this.finalTranscript = ''
  }

  start () {
    if (!this.isSupport) throw new Error('browser not support')
    if (this.recognizing) return
    this.recognizing = true
    this.reset()
    this.recognition.start()
  }

  end () {
    if (!this.isSupport) throw new Error('browser not support')
    if (!this.recognizing) return
    this.recognition.stop()
    this.recognizing = false
  }

  get recognizing () {
    return this.isRecognizing
  }

  set recognizing (value) {
    if (typeof value !== 'boolean') throw new Error('value should be boolean for recognizing')
    else this.isRecognizing = value
  }
}

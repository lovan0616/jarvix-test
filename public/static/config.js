window.env = window.env || {}
window.env.PUBLIC_API_ROOT_URL = 'https://public.dev.sis.ai/'
window.env.SCHEDULE_API_ROOT_URL = 'https://schedule.dev.sis.ai/'
window.env.SAME_ORIGIN = false

;(function initForDev () {
  window.env.PUBLIC_API_ROOT_URL = localStorage.getItem('PUBLIC_API_ROOT_URL') || window.env.PUBLIC_API_ROOT_URL
  window.env.SCHEDULE_API_ROOT_URL = localStorage.getItem('SCHEDULE_API_ROOT_URL') || window.env.SCHEDULE_API_ROOT_URL
  localStorage.setItem('PUBLIC_API_ROOT_URL', window.env.PUBLIC_API_ROOT_URL)
  localStorage.setItem('SCHEDULE_API_ROOT_URL', window.env.SCHEDULE_API_ROOT_URL)
})()

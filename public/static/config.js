window.env = window.env || {}
window.env.PUBLIC_API_ROOT_URL = localStorage.getItem('PUBLIC_API_ROOT_URL') || 'https://public.dev.sis.ai/'
window.env.SCHEDULE_API_ROOT_URL = localStorage.getItem('SCHEDULE_API_ROOT_URL') || 'https://schedule.dev.sis.ai/'
window.env.SAME_ORIGIN = false

window.env.PUBLIC_API_ROOT_OPTIONS = {
  dev: 'https://public.dev.sis.ai/',
  qa: 'https://public.qa.sis.ai/',
  qa2: 'https://public.qa2.sis.ai/',
  sp1: 'https://public.sp1.sis.ai/',
  sp2: 'https://public.sp2.sis.ai/',
  sp3: 'https://public.sp3.sis.ai/'
}

window.env.SCHEDULE_API_ROOT_OPTIONS = {
  dev: 'https://schedule.dev.sis.ai/',
  qa: 'https://schedule.qa.sis.ai/',
  qa2: 'https://schedule.qa2.sis.ai/',
  sp1: 'https://schedule.sp1.sis.ai/',
  sp2: 'https://schedule.sp2.sis.ai/',
  sp3: 'https://schedule.sp3.sis.ai/'
}

localStorage.setItem('PUBLIC_API_ROOT_URL', window.env.PUBLIC_API_ROOT_URL)
localStorage.setItem('SCHEDULE_API_ROOT_URL', window.env.SCHEDULE_API_ROOT_URL)

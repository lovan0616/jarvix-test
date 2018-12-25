<template>
  <div :class="[
      'sy-holy-grail',
      {
        [`is-header-${options.header.type}`]: (options.header.active && options.header.type),
        [`is-footer-${options.footer.type}`]: (options.footer.active && options.footer.type),
        ['is-aside-left-active']: options.asideLeft.active,
        ['is-aside-left-fixed']: options.asideLeft.fixed,
        ['is-aside-right-active']: options.asideRight.active,
        ['is-header-extend-active']: options.headerExtend.active
      }
    ]"
  >
    <div class="wrapper">
      <header class="header"
        v-if="options.header.active"
      >
        <div class="container">
          <slot name="header"></slot>
        </div>
        <div class="header-extend"
          v-if="options.headerExtend.active"
        >
          <div :class="['container', { 'full-width': options.headerExtend.fullWidth }]">
            <slot name="header-extend"></slot>
          </div>
        </div>
      </header>
      <main class="main">
        <aside class="aside-left"
          v-if="options.asideLeft.active"
        >
          <slot name="aside-left"></slot>
        </aside>
        <div class="center">
          <slot></slot>
        </div>
        <aside class="aside-right"
          v-if="options.asideRight.active"
        >
          <slot name="aside-right"></slot>
        </aside>
      </main>
      <footer class="footer"
        v-if="options.footer.active"
      >
        <div class="container">
          <slot name="footer"></slot>
        </div>
      </footer>
    </div>
  </div>
</template>

<script>
const defaultOptions = {
  header: { type: '', active: true },
  footer: { type: '', active: true },
  asideLeft: { active: true, fixed: false },
  asideRight: { active: true, fixed: false },
  headerExtend: { active: false, fullWidth: false }
}
export default {
  name: 'SyHolyGrail',
  props: {
    header: { type: Object, default: () => defaultOptions.header },
    footer: { type: Object, default: () => defaultOptions.footer },
    asideLeft: { type: Object, default: () => defaultOptions.asideLeft },
    asideRight: { type: Object, default: () => defaultOptions.asideRight },
    headerExtend: { type: Object, default: () => defaultOptions.headerExtend }
  },
  computed: {
    options () {
      let result = {}
      Object.keys(defaultOptions).forEach(key => {
        result[key] = { ...defaultOptions[key], ...this[key] }
      })
      return result
    }
  }
}
</script>

<template>
  <div class="layout-root"
    v-loading="loading"
    element-loading-background="transparent"
  >
    <component
      ref="content"
      :is="content"
      :key="new Date().getTime()"
    ></component>
  </div>
</template>

<script>
import Vue from 'vue'

export default {
  name: 'Layout',
  props: {
    template: { type: String, default: undefined }
  },
  data () {
    return {
      loading: true,
      content: undefined
    }
  },
  watch: {
    template () {
      this.destoryLayout()
      this.createLayout()
    }
  },
  mounted () {
    this.createLayout()
  },
  methods: {
    destoryLayout () {
      this.loading = true
      this.content = undefined
    },
    createLayout () {
      if (!this.template) return
      this.content = Vue.extend({
        template: this.template,
        data () {
          return {}
        }
      })
      this.loading = false
    }
  }
}
</script>

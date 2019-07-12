<template>
  <div :class="['task-root', { 'is-full-height': fullHeight }]"
    v-loading="loading"
    element-loading-spinner="el-icon-loading"
    element-loading-background="transparent"
  >
  </div>
</template>

<script>
import { getTask } from '@/API/Ask'
import Vue from 'vue'

export default {
  name: 'Task',
  props: {
    url: { type: String, default: '' },
    dataUrl: { type: String, default: '' },
    templateUrl: { type: String, default: '' },
    params: { type: Object, default: () => ({}) },
    fullHeight: { type: Boolean, default: false },
    cancelLoading: { type: Boolean, default: false },
    intervalPull: { type: Boolean, default: false },
    intervalTime: { type: Number, default: 10 },
    intervalLoading: { type: Boolean, default: false },
    listeners: { type: Object, default: () => ({}) }
  },
  data () {
    return {
      loading: true,
      entities: this.params,
      urlRoot: window.env.API_ROOT_URL,
      childVm: undefined
    }
  },
  created () {
    Object.keys(this.listeners).forEach(key => {
      this.$events.$on(key, this[this.listeners[key]])
    })
  },
  destroyed () {
    Object.keys(this.listeners).forEach(key => {
      this.$events.$off(key)
    })
  },
  mounted () {
    this.init()
  },
  computed: {
    path () {
      return this.urlRoot + this.url
    },
    templatePath () {
      return this.urlRoot + this.templateUrl
    },
    dataPath () {
      return this.urlRoot + this.dataUrl
    }
  },
  methods: {
    init () {
      if (this.url) this.genTask(this.path, this.params)
      if (this.templateUrl && this.dataUrl) this.genTaskByTemplateAndData()
    },
    reload (params) {
      if (this.url) {
        this.clearInterval()
        if (!this.cancelLoading) this.loading = true
        this.entities = params
        this.genTask(this.path, this.entities)
      }

      if (this.templateUrl && this.dataUrl) {
        if (!this.cancelLoading) this.loading = true
        this.childVm.getData(this.dataPath, params).then(() => {
          this.loading = false
        })
      }
    },
    clearInterval () {
      this.timeoutId = clearTimeout(this.timeoutId)
    },
    genTaskAfterTimeout () {
      if (!this.intervalPull) return
      this.clearInterval()
      this.timeoutId = setTimeout(this.genTask, this.intervalTime * 1000, this.path, this.params)
    },
    genTask (path, params) {
      if (!this.cancelLoading && this.intervalLoading) this.loading = true
      return getTask(path, params)
        .then(res => {
          this.destroyTaskVm()
          this.createTask(res)
          this.genTaskAfterTimeout()
        })
        .catch(err => {
          this.loading = false
          console.log(err)
        })
    },
    genTaskByTemplateAndData () {
      if (!this.cancelLoading && this.intervalLoading) this.loading = true

      Promise.all([
        getTask(this.templatePath, this.params).then(res => res),
        getTask(this.dataPath, this.params).then(res => res)
      ]).then(res => {
        const template = res[0]
        const data = res[1]
        this.destroyTaskVm()
        this.createTaskByTemplateAndData({ template, data })
      }).catch(() => {
        this.loading = false
      })
    },
    createTask ({ template = '', data = {} }) {
      const Task = Vue.extend({
        template,
        data () {
          return data
        }
      })
      this.childVm = new Task({
        parent: this
      })
      this.$nextTick(() => {
        this.$el.appendChild(this.childVm.$mount().$el)
        this.loading = false
      })
    },
    createTaskByTemplateAndData ({ template = '', data = {} }) {
      const dataPath = this.dataPath
      const params = this.params
      const intervalPull = this.intervalPull
      const intervalTime = this.intervalTime
      const Task = Vue.extend({
        template,
        data () {
          return data
        },
        mounted () {
          if (intervalPull) this.intervalGetData(dataPath, params)
        },
        methods: {
          getData (path, params) {
            return getTask(path, params).then(res => {
              Object.keys(res).forEach(key => {
                this[key] = res[key]
              })
            })
          },
          intervalGetData (path, params) {
            setInterval(() => {
              this.getData(path, params)
            }, intervalTime * 1000)
          }
        }
      })
      this.childVm = new Task({
        parent: this
      })
      this.$nextTick(() => {
        this.$el.appendChild(this.childVm.$mount().$el)
        this.loading = false
      })
    },
    destroyTaskVm () {
      if (this.childVm) {
        const el = this.$el
        while (el.firstChild) {
          el.removeChild(el.firstChild)
        }
        this.childVm.$destroy(true)
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.task-root {
  width: 100%;
  min-height: 20px;
}
</style>

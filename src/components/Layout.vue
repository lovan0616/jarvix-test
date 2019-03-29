<template>
  <div :class="['layout-root', { 'is-loading': loading }]"
    v-loading="loading"
    element-loading-spinner="el-icon-loading"
    element-loading-background="rgba(255, 255, 255, 0.75)"
  >
    <component ref="content" v-bind:is="content"></component>
  </div>
</template>

<script>
import Vue from 'vue'
import axios from 'axios'

export default {
  name: 'Layout',
  props: {
    template: { type: String, default: undefined },
    data: { type: Object, default: undefined }
  },
  data () {
    return {
      loading: true,
      content: undefined,
      relationship: [],
      extensions: []
    }
  },
  watch: {
    template: {
      handler (e) {
        if (e === undefined) this.destoryLayout()
        else this.createLayout(this.$props)
      },
      immediate: true
    },
    // template (e) {
    //   console.log(e, 'watch template')
    //   if (e === undefined) this.destoryLayout()
    //   else this.createLayout(this.$props)
    // },
    data (e) {
      this.createLayout(this.$props)
    }
  },
  mounted () {
    this.$events.$on('layoutMounted', this.layoutMounted)
    this.$events.$on('scrollToBottom', this.scrollToBottom)
    this.$events.$on('cleanRelations', this.cleanRelations)
    this.$events.$on('queryAnswer', this.queryAnswer)
  },
  beforeDestroy () {
    this.$events.$off('layoutMounted', this.layoutMounted)
    this.$events.$off('cleanRelations', this.cleanRelations)
    this.$events.$off('scrollToBottom', this.scrollToBottom)
    this.$events.$off('queryAnswer', this.queryAnswer)
  },
  methods: {
    layoutMounted () {
      this.$nextTick(() => {
        // init task relationship
        this.relationship = this.findTasks(this).map(task => this.createRelationshipNode(task))
      })
    },
    cleanRelations ({ taskNode }) {
      const relationRoot = this.findRelationshipNodeByUid(this.relationship, taskNode._uid)
      if (relationRoot) this.cleanAllExtends(relationRoot)
    },
    cleanAllExtends (relationshipNode) {
      relationshipNode.extends.forEach(rnode => {
        if (rnode.extends.length > 0) this.cleanAllExtends(rnode)
        this.subtractComponent(rnode.extension)
        this.removeExtension(rnode.extension)
      })
      relationshipNode.extends = []
    },
    findTasks (vm) {
      let result = []
      if (vm.$options._componentTag === 'task') result.push(vm)
      if (vm.$children.length > 0) {
        vm.$children.forEach(item => {
          result = result.concat(this.findTasks(item))
        })
      }
      return result
    },
    scrollToBottom () {
      // TODO: scroll to bottom or special element, maybe can use vue-scrollto
      // https://github.com/rigor789/vue-scrollto#readme

      // setTimeout(() => window.scrollTo(0, document.body.scrollHeight), 300)
    },
    destoryLayout () {
      this.loading = true
      this.content = undefined
      this.relationship = []
      this.extensions = []
    },
    createLayout ({ template, data = {} }) {
      if (!template) return
      this.content = Vue.extend({
        template,
        data () {
          return data
        },
        mounted () {
          this.$nextTick(() => this.$events.$emit('layoutMounted'))
        }
      })
      this.loading = false
    },
    queryAnswer ({ eventArgs, taskNode }) {
      this.createExtendLayout(eventArgs).then(Comp => {
        const parent = this.$refs.content.$children[0]
        const extension = new Comp({ parent })
        this.appendComponent(parent, extension)
        this.addExtension(extension)
        this.extendRelationshipNode(taskNode._uid, this.findTasks(extension), extension)
      })
    },
    createRelationshipNode (vm, extension) {
      return { uid: vm._uid, extends: [], vm, extension }
    },
    extendRelationshipNode (uid, vms, extension) {
      const relationshipNode = this.findRelationshipNodeByUid(this.relationship, uid)
      if (relationshipNode) {
        const extendRelationshipNodes = vms.map(vm => this.createRelationshipNode(vm, extension))
        relationshipNode.extends = relationshipNode.extends.concat(extendRelationshipNodes)
      }
    },
    findRelationshipNodeByUid (ary, uid) {
      let result
      ary.forEach(node => {
        if (node.uid === uid) result = node
        else result = this.findRelationshipNodeByUid(node.extends, uid)
      })
      return result
    },
    createExtendLayout (data) {
      return this.fetchApiQuery(data)
        .then(d => this.createExtendLayoutComp(d))
    },
    fetchApiQuery (data) {
      const path = window.env.API_ROOT_URL + 'api/query'
      return axios.post(path, data)
        .then(res => res.data.data)
    },
    createExtendLayoutComp ({ template, data = {} }) {
      if (!template) return
      return Vue.extend({
        template,
        data () {
          return data
        }
      })
    },
    appendComponent (parent, vm) {
      const root = parent.$el.querySelector('.block-row')
      root.appendChild(vm.$mount().$el)
    },
    subtractComponent (vm) {
      vm.$el.parentNode.removeChild(vm.$el)
      vm.$destroy()
    },
    addExtension (vm) {
      this.extensions.push(vm)
    },
    removeExtension (vm) {
      const index = this.extensions.findIndex(extension => extension === vm)
      this.extensions.splice(index, 1)
    }
  }
}
</script>

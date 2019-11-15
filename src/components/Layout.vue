<template>
  <div class="layout-root">
    <spinner class="layout-spinner"
      v-if="loading"
      :title="$t('resultDescription.analysisProcessing')"
      size="50"
    ></spinner>
    <component
      v-else
      :id="id"
      :is="content"
    ></component>
  </div>
</template>

<script>
export default {
  name: 'Layout',
  props: {
    template: {
      type: String,
      default: null
    },
    id: {
      type: [Number, String],
      default: null
    }
  },
  data () {
    return {
      loading: true,
      content: null
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
      this.content = null
    },
    createLayout () {
      if (!this.template) return

      this.content = {
        template: this.template,
        data () {
          return {}
        }
      }

      this.loading = false
    }
  }
}
</script>
<style lang="scss" scoped>
.layout-root {
  transition: height 0.3s;

  .layout-spinner {
    height: calc(100vh - 150px);
  }
}
</style>

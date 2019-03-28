<template>
  <div class="page-pinboard">
    <h1 class="page-title">Pinboard</h1>
    <layout class="single-pinboard"
      v-if="layout"
      v-for="(template, index) in layout"
      :key="index"
      v-bind="template"
    ></layout>
  </div>
</template>
<script>
import axios from 'axios'

export default {
  name: 'PagePinboard',
  data () {
    return {
      layout: null
    }
  },
  mounted () {
    this.getPinboardInfo()
  },
  methods: {
    getPinboardInfo () {
      const path = window.env.API_ROOT_URL + 'api/pin/reports'
      axios.get(path)
        .then(res => {
          this.layout = res.data.data.reports
        })
    }
  }
}
</script>
<style lang="scss" scoped>
.page-pinboard {
  .single-pinboard {
    &:not(:last-child) {
      margin-bottom: 30px;
    }
  }
}
</style>

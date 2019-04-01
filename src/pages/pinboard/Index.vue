<template>
  <div class="page-pinboard">
    <h1 class="page-title">Pinboard</h1>
    <layout class="single-pinboard"
      v-if="pinboardList"
      v-for="(template, index) in pinboardList"
      :key="index"
      v-bind="template"
    ></layout>
  </div>
</template>
<script>
export default {
  name: 'PagePinboard',
  data () {
    return {
    }
  },
  mounted () {
    this.getPinboardInfo()
  },
  methods: {
    getPinboardInfo () {
      this.$store.dispatch('pinboard/getPinboardList')
    }
  },
  computed: {
    pinboardList () {
      return this.$store.state.pinboard.pinboardList
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

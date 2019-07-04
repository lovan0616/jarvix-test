<template>
  <div class="page-pinboard">
    <h1 class="page-title">个人钉板</h1>
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
  beforeDestroy () {
    this.$store.commit('pinboard/setPinboardList', [])
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
  .page-title {
    margin-top: 0;
  }
  .single-pinboard {
    transition: all 0.3s;

    &:not(:last-child) {
      margin-bottom: 30px;
    }
  }
}
</style>

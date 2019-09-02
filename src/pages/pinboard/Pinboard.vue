<template>
  <div class="page-pinboard">
    <spinner
      v-if="isLoading"
    ></spinner>
    <div
      v-else
    >
      <div class="bread-crumb-block">
        <router-link class="page root" to="/pinboard">个人钉板</router-link>
        <span class="divider">/</span>
        <span class="page">{{ pinboardInfo.name }}</span>
      </div>
      <h1 class="page-title">{{ pinboardInfo.name }}</h1>
      <layout
        v-for="pinboard in pinboardInfo.templates"
        :key="pinboard.id"
        :id="pinboard.id"
        :template="pinboard.template"
      ></layout>
      <empty-info-block
        v-if="pinboardInfo.templates.length === 0"
        msg="暂无钉板资讯，请先去询问问题"
      ></empty-info-block>
    </div>
  </div>
</template>
<script>
import Spinner from '@/components/Spinner'
import EmptyInfoBlock from '@/components/EmptyInfoBlock'

export default {
  name: 'PagePinboard',
  components: {
    EmptyInfoBlock,
    Spinner
  },
  data () {
    return {
      isLoading: true
    }
  },
  mounted () {
    this.getPinboardInfo()
  },
  methods: {
    getPinboardInfo () {
      this.$store.dispatch('pinboard/getPinboardTemplate', this.$route.params.id).then(res => {
        this.isLoading = false
      }).catch(() => {
        this.isLoading = false
      })
    }
  },
  computed: {
    pinboardInfo () {
      return this.$store.state.pinboard.pinboardInfo
    }
  }
}
</script>
<style lang="scss" scoped>
.page-pinboard {
  .bread-crumb-block {
    line-height: 20px;
    margin-bottom: 32px;
    font-weight: 700;

    .page {
      &.root {
        color: #65cfd9;
      }
    }
    .divider {
      color: #979797;
      margin: 0 4px;
    }
  }
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

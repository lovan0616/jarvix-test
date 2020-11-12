<template>
  <div class="dialog">
    <nav class="dialog__nav">
      <div class="nav--left">
        <div
          class="icon-arrow"
          @click="$emit('closeDialog')">
          <svg-icon icon-class="arrow-left" />
        </div>
        {{ $t('miniApp.createComponent') }}
      </div>
      <div class="nav--right">
        <button
          class="btn btn-default"
          @click="createComponent"
        >
          {{ $t('button.create') }}
        </button>
      </div>
    </nav>
    <div class="dialog__content">
      <div class="search-bar">
        <data-frame-menu :redirect-on-change="false"/>
        <ask-block :redirect-on-ask="false"/>
      </div>
      <div class="result-block">
        <result-display 
          v-if="appQuestion" 
          :redirect-on-select="false"/>
      </div>
    </div>
  </div>
</template>

<script>
import DataFrameMenu from '@/components/select/DataFrameMenu'
import AskBlock from '@/components/chatBot/AskBlock'
import ResultDisplay from '@/pages/result/ResultDisplay'
import { mapState } from 'vuex'

export default {
  name: 'CreateComponentDialog',
  components: {
    DataFrameMenu,
    AskBlock,
    ResultDisplay
  },
  data () {
    return {}
  },
  computed: {
    ...mapState('result', ['currentResultInfo']),
    ...mapState('dataSource', ['appQuestion'])
  },
  mounted () {
  },
  destroyed () {
    this.$store.commit('result/updateCurrentResultInfo', null)
    this.$store.commit('dataSource/setAppQuestion', null)
  },
  methods: {
    createComponent () {
      this.$emit('create', {
        id: this.currentResultInfo.key_result[0],
        title: this.currentResultInfo.question
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.dialog {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  &__nav {
    height: 56px;
    padding: 0 24px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: rgba(0, 0, 0, 0.55);
    border-bottom: 1px solid #232C2E;
    .nav--left {
      display: flex;
      align-items: center;
      .icon-arrow {
        cursor: pointer;
        color: $theme-color-primary;
        margin-right: 20px;
      }
    }
  }
  &__content {
    .search-bar {
      display: flex;
      padding: 8px 24px;
      border-bottom: 1px solid #232C2E;
      .data-frame-select-block {
        width: 300px;
        margin-right: 16px;
      }
    }
    .result-block {
      padding: 24px;
    }
  }
}
</style>
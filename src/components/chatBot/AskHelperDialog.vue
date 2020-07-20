<template>
  <div 
    class="ask-helper-dialog"
  >
    <div class="helper-header">{{ $t('askHelper.title') }}</div>
    <el-tabs 
      v-model="activeTab"
      class="ask-helper-tab"
      type="card"
    >
      <el-tab-pane
        :label="$t('askHelper.tabToken')"
        :name="$t('askHelper.tabToken')"
      >
        <column-info/>
      </el-tab-pane>
      <el-tab-pane
        v-if="$store.state.setting.locale.includes('zh')"
        :label="$t('askHelper.tabSample')"
        :name="$t('askHelper.tabSample')"
      >
        <question-sample/>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import QuestionSample from './QuestionSample'
import ColumnInfo from './ColumnInfo'

export default {
  name: 'AskHelperDialog',
  components: {
    QuestionSample,
    ColumnInfo
  },
  data () {
    return {
      activeTab: this.$t('askHelper.tabToken')
    }
  },
  methods: {
    closeDialog () {
      this.$emit('close')
    }
  }
}
</script>
<style lang="scss" scoped>
.ask-helper-dialog {
  .helper-header {
    font-weight: 600;
    font-size: 24px;
    line-height: 32px;
    margin-bottom: 24px;
  }
}
</style>
<style lang="scss">
.ask-helper-tab.el-tabs--card {
  &>.el-tabs__header {
    border: none;
    margin: 0 0 27px;

    .el-tabs__nav {
      width: 100%;
      border: none;

      &::before {
        content: '';
        position: absolute;
        bottom: 0;
        width: 100%;
        height: 3px;
        background: #324B4E;
      }
    }

    .el-tabs__item {
      border: none;
      width: 160px;
      color:  #AAAAAA;
      border-bottom: 3px solid #324B4E;
      text-align: center;

      &.is-active {
        color: #fff;
        background: linear-gradient(360deg, #324B4E 0%, rgba(50, 75, 78, 0) 100%);
        border-bottom: 3px solid $theme-color-primary;
      }
    }
  }

  .el-tabs__content {
    overflow-y: auto;
    height: calc(100vh - 280px - #{$header-height});
  }
}
</style>

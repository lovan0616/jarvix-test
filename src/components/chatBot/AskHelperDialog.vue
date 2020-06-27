<template>
  <div 
    :class="{show}"
    class="ask-helper-dialog"
  >
    <div class="title-block">
      <div class="dialog-title">{{ $t('askHelper.title') }}</div>
      <a 
        href="javascript:void(0)" 
        class="close-btn"
        @click="closeDialog"
      >
        <svg-icon icon-class="close"/>
      </a>
    </div>
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
  props: {
    show: {
      type: Boolean,
      default: false
    }
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
  position: absolute;
  left: 0;
  width: 100%;
  height: 0;
  overflow: hidden;
  background-color: rgba(35, 61, 64, 0.97);
  transition: height 0.3s;

  &.show {
    overflow: auto;
    height: calc(100vh - 110px - #{$header-height});
    padding: 24px 32px;
  }

  .title-block {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 8px;

    .dialog-title {
      font-size: 20px;
      line-height: 50px;
    }

    .close-btn {
      color: #fff;
    }
  }
}
</style>
<style lang="scss">
.ask-helper-tab.el-tabs--card {
  &>.el-tabs__header {
    border: none;

    .el-tabs__nav {
      width: 100%;
      border: none;
    }

    .el-tabs__item {
      border: none;
      width: 50%;
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

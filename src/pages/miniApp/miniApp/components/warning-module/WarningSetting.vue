<template>
  <div class="warning-module">
    <nav class="warning-module__nav">
      <div class="nav-left">示警管理</div>
      <div class="nav-right">
        <button class="btn btn-m btn-default">
          {{ $t('button.save') }}
        </button>
      </div>
    </nav>
    <main class="warning-module__content">
      <div class="warning-module__content-enable">
        <section class="setting-block">
          啟用設定：
          <div class="input-radio-group">
            <input
              id="activate"
              :checked="warningModule.activate"
              :value="warningModule.activate"
              name="status"
              class="input-radio"
              type="radio"
              @change="warningModule.activate = true"
            >
            <label
              for="activate"
              class="input-radio-label"
            >啟用</label>
          </div>
          <div class="input-radio-group">
            <input
              id="inactivate"
              :checked="!warningModule.activate"
              :value="!warningModule.activate"
              name="status"
              class="input-radio"
              type="radio"
              @change="warningModule.activate = false"
            >
            <label
              for="inactivate"
              class="input-radio-label"
            >關閉</label>
          </div>
        </section>
      </div>
      <div class="warning-module__content-rule">
        <div class="title">
          <span class="col-enable">是否使用</span>
          <span class="col-content">示警內容</span>
          <span class="col-relation">關聯看板</span>
        </div>
        <section 
          v-for="(rule, index) in warningModule.rules" 
          :key="index" 
          class="setting-block">
          <div class="col-enable">
            <el-switch
              v-model="rule.activate"
              :width="Number('32')"
              active-color="#2AD2E2"
              inactive-color="#324B4E"
            />
          </div>
          <div class="col-content">
            <span class="rule-name">{{ rule.ruleName }}</span>
          </div>
          <div class="col-relation">
            <default-select
              v-model="rule.relatedDashboard.id"
              :option-list="dashboardOptions"
              placeholder="請選擇分析看板"
              class="dashboard-select"
            />
          </div>
        </section>
      </div>
    </main>
  </div>
</template>

<script>
import DefaultSelect from '@/components/select/DefaultSelect'

export default {
  name: 'WarningSetting',
  components: {
    DefaultSelect
  },
  props: {
    dashboardList: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
      warningModule: {
        activate: false,
        // TODO 串 API
        rules: []  
      }
    }
  },
  computed: {
    dashboardOptions () {
      return this.dashboardList
        .map(item => ({
          value: item.id,
          name: item.name
        }))
    },
  },
  mounted () {
    while (this.warningModule.rules.length < 12) {
      this.warningModule.rules.push({
        ruleName: '(1)功率過大',
        activate: false,
        relatedDashboard: {
          id: null,
          name: null
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.warning-module {
  height: 100%;
  display: flex;
  flex-direction: column;
  &__nav {
    display: flex;
    justify-content: space-between;
    margin-bottom: 12px;
    margin-right: 20px;
    .nav-left {
      font-size: 20px;
    }
    .nav-right {
      .btn {
        padding: 5px 10px;
        min-width: unset;
      }
    }
  }
  &__content {
    flex: 1;
    height: 0;
    display: flex;
    flex-direction: column;
    .setting-block {
      display: flex;
      align-items: center;
      padding: 24px;
      background-color: #192323;
      border-radius: 5px;
      margin-bottom: 8px;
      margin-right: 20px;
      font-size: 14px;
      .input-radio-group {
        margin-left: 24px;
      }
    }
    &-enable {
      .setting-block {
        margin-bottom: 24px;
      }
    }
    &-rule {
      overflow: auto;
      height: 0;
      flex: 1;
      .title {
        display: flex;
        padding: 0 24px 12px 24px;
      }
      /deep/ .dashboard-select {
        .el-input__inner {
          padding-left: 0;
          border-bottom: 1px solid #FFF;
          font-size: 14px;
        }
      }
    }
    .col {
      &-enable {
        flex: 0 0 140px;
      }
      &-content {
        flex: 1;
      }
      &-relation {
        flex: 0 0 200px;
      }
    }
  }
}
</style>
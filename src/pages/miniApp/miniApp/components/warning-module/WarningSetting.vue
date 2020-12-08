<template>
  <div class="warning-module">
    <nav class="warning-module__nav">
      <div class="nav-left">{{ $t('miniApp.warningManagement') }}</div>
      <div class="nav-right">
        <button class="btn btn-m btn-default">
          {{ $t('button.save') }}
        </button>
      </div>
    </nav>
    <main class="warning-module__content">
      <div class="warning-module__content-enable">
        <section class="setting-block">
          {{ $t('miniApp.enableWarningModule') }}：
          <div class="input-radio-group">
            <input
              id="activate"
              :checked="isWarningModuleActivate"
              :value="isWarningModuleActivate"
              name="status"
              class="input-radio"
              type="radio"
              @change="isWarningModuleActivate = true"
            >
            <label
              for="activate"
              class="input-radio-label"
            >{{ $t('miniApp.activate') }}</label>
          </div>
          <div class="input-radio-group">
            <input
              id="inactivate"
              :checked="!isWarningModuleActivate"
              :value="!isWarningModuleActivate"
              name="status"
              class="input-radio"
              type="radio"
              @change="isWarningModuleActivate = false"
            >
            <label
              for="inactivate"
              class="input-radio-label"
            >{{ $t('miniApp.inactivate') }}</label>
          </div>
        </section>
      </div>
      <div class="warning-module__content-rule">
        <div class="title">
          <span class="col col-enable">是否使用</span>
          <span class="col col-message">示警訊息</span>
          <span class="col col-condition">示警條件</span>
          <span class="col col-relation">關聯看板</span>
        </div>
        <section 
          v-for="(condition, index) in warningConditions" 
          :key="index" 
          class="setting-block">
          <div class="col col-enable">
            <el-switch
              v-model="condition.activate"
              :width="Number('32')"
              active-color="#2AD2E2"
              inactive-color="#324B4E"
            />
          </div>
          <div class="col-message">
            <span>{{ condition.name }}</span>
          </div>
          <div class="col-condition">
            <span v-html="displayedConditionMessage(condition.targetConfig.displayName, condition.comparingValues)"/>
          </div>
          <div class="col-relation">
            <default-select
              v-model="condition.relatedDashboardId"
              :option-list="dashboardOptions"
              :placeholder="$t('miniApp.selectDashboard')"
              class="dashboard-select"
            />
          </div>
        </section>
      </div>
    </main>
  </div>
</template>

<script>
import { getAlertConditions } from '@/API/Alert'
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
      isWarningModuleActivate: false,
      warningConditions: []
    }
  },
  computed: {
    dashboardOptions () {
      let options = []
      const defaultOption = {
        value: null,
        name: this.$t('miniApp.noRelation')
      }
      options = this.dashboardList.map(item => ({ value: item.id, name: item.name }))
      options.unshift(defaultOption)
      return options
    }
  },
  created () {
    getAlertConditions().then(conditions => {
      conditions.forEach(condition => {
        this.warningConditions.push({
          ...condition,
          activate: false,
          relatedDashboardId: null
        })
      })
    })
  },
  mounted () {
  },
  methods: {
    displayedConditionMessage (targetColumnName, comparingValues) {
      return comparingValues.reduce((acc, cur) => {
        let comparisonOperator = ''
        switch (cur.comparisonOperator) {
          case 'GREATER_THAN':
            comparisonOperator = '>'
            break
          case 'LOWER_THAN':
            comparisonOperator = '<'
            break
          case 'EQUAL':
            comparisonOperator = '='
        }
        return acc.concat(`${targetColumnName}${comparisonOperator}${cur.value}<br>`)
      }, '')
      
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
        margin-right: 24px;
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
      &-message {
        flex: 0 0 140px;
      }
      &-condition {
        flex: 1;
      }
      &-relation {
        flex: 0 0 200px;
      }
    }
  }
}
</style>
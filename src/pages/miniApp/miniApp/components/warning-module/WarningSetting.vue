<template>
  <div class="warning-setting">
    <nav class="warning-setting__nav">
      <div class="nav-left">{{ $t('miniApp.warningManagement') }}</div>
      <div class="nav-right">
        <button 
          class="btn btn-m btn-default" 
          @click="saveWarningModuleSetting">
          {{ $t('button.save') }}
        </button>
      </div>
    </nav>
    <main class="warning-setting__content">
      <div class="warning-setting__content-enable">
        <section class="setting-block">
          {{ $t('miniApp.enableWarningModule') }}：
          <el-switch
            v-model="tempWarningModuleConfig.activate"
            :width="Number('32')"
            class="module-activate-controller"
            active-color="#2AD2E2"
            inactive-color="#324B4E"
          />
          {{ tempWarningModuleConfig.activate ? $t('miniApp.activate') : $t('miniApp.inactivate') }}
        </section>
      </div>
      <div class="warning-setting__content-frequency">
        <section class="setting-block">
          {{ $t('miniApp.monitorUpdateFrequency') }}：
          <default-select 
            v-model="tempWarningModuleConfig.updateFrequency"
            :option-list="updateFrequency"
            :placeholder="$t('miniApp.chooseUpdateFrequency')"
            class="setting__block-select"
            name="updateFrequency"
          />
        </section>
      </div>
      <div class="warning-setting__content-rule">
        <div class="title">
          <span class="col col-enable">{{ $t('miniApp.enableWarningModule') }}</span>
          <span class="col col-condition">{{ $t('miniApp.warningName') }}</span>
          <span class="col col-relation">{{ $t('miniApp.relatedDashboard') }}</span>
        </div>
        <spinner 
          v-if="isLoading" 
          :title="$t('button.download')" 
          size="50"/>
        <section
          v-for="(condition, index) in tempWarningModuleConfig.conditions"
          v-else 
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
          <div class="col-condition">
            <div>{{ condition.name }}</div>
            <div 
              class="comparing-values" 
              v-html="displayedConditionMessage(condition.targetConfig.displayName, condition.comparingValues)"/>
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
import { mapGetters } from 'vuex'

export default {
  name: 'WarningSetting',
  components: {
    DefaultSelect
  },
  props: {
    setting: {
      type: Object,
      default: () => {}
    },
    dashboardList: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
      isLoading: false,
      allConditions: [],
      tempWarningModuleConfig: {}
    }
  },
  computed: {
    ...mapGetters('userManagement', ['getCurrentGroupId']),
    dashboardOptions () {
      let options = []
      const defaultOption = {
        value: null,
        name: this.$t('miniApp.noRelation')
      }
      options = this.dashboardList.map(item => ({ value: item.id, name: item.name }))
      options.unshift(defaultOption)
      return options
    },
    updateFrequency () {
      return [
        {
          value: '* * * * *',
          name: this.$t('warRoom.everyMinute', { number: 1 })
        },
        {
          value: '*/2 * * * *',
          name: this.$t('warRoom.everyMinute', { number: 2 })
        },
        {
          value: '*/5 * * * *',
          name: this.$t('warRoom.everyMinute', { number: 5 })
        },
        {
          value: '*/15 * * * *',
          name: this.$t('warRoom.everyMinute', { number: 15 })
        },
        {
          value: '*/30 * * * *',
          name: this.$t('warRoom.everyMinute', { number: 30 })
        }
      ]
    }
  },
  created () {
    this.isLoading = true

    // 示警模組設定
    const { activate, updateFrequency } = this.setting
    this.tempWarningModuleConfig = { activate, updateFrequency, conditions: [] }

    getAlertConditions(this.getCurrentGroupId).then(conditions => {
      // 存放所有示警條件
      this.allConditions = conditions

      // 還原之前的設定到示警條件上
      conditions.forEach(condition => {
        const prevConditionSetting = this.setting.conditions.find(item => item.id === condition.id)
        if (!prevConditionSetting) return
        const isRelatedDashbaordExist = this.dashboardList.map(item => item.id).includes(prevConditionSetting.relatedDashboardId)
        this.tempWarningModuleConfig.conditions.push({
          ...condition,
          activate: prevConditionSetting ? prevConditionSetting.activate : false,
          relatedDashboardId: isRelatedDashbaordExist ? prevConditionSetting.relatedDashboardId : null
        })
      })
    }).finally(() => this.isLoading = false )
  },
  methods: {
    saveWarningModuleSetting () {
      this.$emit('update', {
        ...this.tempWarningModuleConfig,
        conditions: this.tempWarningModuleConfig.conditions.map(item => ({
          id: item.id,
          activate: item.activate,
          relatedDashboardId: item.relatedDashboardId
        }))
      })
    },
    displayedConditionMessage (targetColumnName, comparingValues) {
      return comparingValues.reduce((acc, cur) => {
        let comparisonOperator = ''
        switch (cur.comparisonOperator) {
          case 'GREATER_THAN':
            comparisonOperator = '>'
            break
          case 'GREATER_THAN_OR_EQUAL_TO':
            comparisonOperator = '≥'
            break
          case 'LESS_THAN':
            comparisonOperator = '<'
            break
          case 'LESS_THAN_OR_EQUAL_TO':
            comparisonOperator = '≤'
            break
          case 'EQUAL':
            comparisonOperator = '='
            break
          case 'NOT_EQUAL':
            comparisonOperator = '≠'
        }
        return acc.concat(`- ${targetColumnName}${comparisonOperator}${cur.value}<br>`)
      }, '')
      
    }
  }
}
</script>

<style lang="scss" scoped>
.warning-setting {
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
      margin-bottom: 24px;
      margin-right: 20px;
      font-size: 14px;
      .input-radio-group {
        margin-left: 24px;
      }
      /deep/ .sy-select {
        .el-input__inner {
          padding-left: 0;
          border-bottom: 1px solid #FFF;
          font-size: 14px;
        }
      }
    }
    &-enable {
      .setting-block {
        .module-activate-controller {
          margin: 0 12px;
        }
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
    }
    .col {
      &-enable {
        flex: 0 0 140px;
      }
      &-condition {
        flex: 1;
        .comparing-values {
          font-size: 12px;
          color: #999;
          margin-top: 6px;
          & ~ .comparing-values {
            margin-top: 2px;
          }
        }
      }
      &-relation {
        flex: 0 0 200px;
      }
    }
  }
}
</style>
<template>
  <div class="warning-setting">
    <nav class="warning-setting__nav">
      <div class="nav-left">
        {{ $t('alert.alertManagement') }}
        <div class="module-activate-controller">
          <el-switch
            v-model="tempWarningModuleConfig.activate"
            :width="Number('32')"
            active-color="#2AD2E2"
            inactive-color="#324B4E"
            @change="saveWarningModuleSetting"
          />
          {{ tempWarningModuleConfig.activate ? $t('miniApp.activate') : $t('miniApp.inactivate') }}
        </div>
      </div>
      <div class="nav-right">
        <button
          class="btn-m btn-secondary button-container__button"
          @click="isShowCreateConditionDialog = true"
        >{{ $t('alert.createAlertCondition') }}</button>
      </div>
    </nav>
    <main class="warning-setting__content">
      <div class="warning-setting__content-frequency">
        <section class="setting-block">
          {{ $t('miniApp.monitorUpdateFrequency') }}：
          <default-select 
            v-model="tempWarningModuleConfig.updateFrequency"
            :option-list="updateFrequency"
            :placeholder="$t('miniApp.chooseUpdateFrequency')"
            class="setting__block-select"
            name="updateFrequency"
            @change="saveWarningModuleSetting"
          />
        </section>
      </div>
      <div class="warning-setting__content-condition">
        <spinner 
          v-if="isLoading || isProcessing" 
          :title="$t('button.download')" 
          size="50"/>
        <empty-info-block
          v-else-if="isEmpyAlertCondition"
          :msg="$t('alert.emptyCondition')"
        />
        <template v-else>
          <div class="title">
            <span class="col-enable">{{ $t('alert.enableAlertModule') }}</span>
            <span class="col-condition">{{ $t('alert.alertCondition') }}</span>
            <span class="col-relation">{{ $t('miniApp.relatedDashboard') }}</span>
            <span class="col-status">{{ $t('alert.operatingStatus') }}</span>
            <span class="col-deletion"/>
          </div>
          <section
            v-for="condition in tempWarningModuleConfig.conditions"
            :key="condition.id" 
            class="setting-block">
            <div class="col-enable">
              <el-switch
                v-model="condition.activate"
                :width="Number('32')"
                active-color="#2AD2E2"
                inactive-color="#324B4E"
                @change="saveWarningModuleSetting"
              />
            </div>
            <div class="col-condition">
              <div>{{ condition.name }}</div>
              <div class="datasource-info">
                <svg-icon icon-class="data-source"/>{{ condition.dataSourceName }}
                <svg-icon icon-class="table"/>{{ condition.dataFrameName }}
                <svg-icon :icon-class="isComponentAlerter(condition.targetType) ? 'watch-list' : 'column'"/>
                {{ isComponentAlerter(condition.targetType) 
                  ? $t('alert.monitoringItem', {number: condition.targetConfig.combinationCounts }) 
                : condition.targetConfig.displayName }}
              </div>
              <div 
                class="comparing-values" 
                v-html="displayedConditionMessage(condition.targetConfig.displayName || condition.targetConfig.analysisValueType, condition.comparingValues)"/>
              <div class="message-template">
                <span class="message-template__label">{{ $t('alert.alertLogMessage') }}:</span>
                <span class="message-template__content">{{ condition[`alertMessage${locale.split('-')[1]}`] }}</span>
                <a
                  v-if="!isComponentAlerter(condition.targetType)"
                  href="javascript:void(0)"
                  class="link message-template__edit-btn"
                  @click="openAlertConditionMessageDialog(condition)"
                >{{ $t('alert.editAlertMessage') }}</a>
              </div>
            </div>
            <div class="col-relation">
              <default-select
                v-model="condition.relatedDashboardId"
                :option-list="dashboardOptions"
                :placeholder="$t('miniApp.selectDashboard')"
                class="dashboard-select"
                @change="saveWarningModuleSetting"
              />
            </div>
            <div class="col-status">
              <button
                v-if="isAllowManulTriggerAlert(condition.status)"
                class="btn btn-outline"
                @click="runAlert(condition.id)"
              >{{ $t('button.runRightAway') }}</button>
              <div
                v-else
                class="message">
                <spinner size="14"/>{{ $t('alert.operating') }}
              </div>
            </div>
            <div class="col-deletion">
              <alert-condition-deleter
                :condition="condition"
                @deleted="fetchSettingData"
              />
            </div>
          </section>
        </template>
      </div>
    </main>
    <create-alert-condition-dialog
      v-if="isShowCreateConditionDialog"
      @close="isShowCreateConditionDialog = false"
      @created="alertConditionUpdated('CreateCondition', $event)"
    />
    <alert-condition-message-editor-dialog
      v-if="isShowEditConditionMessageDialog"
      :condition="currentEditingCondition"
      @close="isShowEditConditionMessageDialog = false"
      @done="alertConditionUpdated('EditConditionMessage')"
    />
  </div>
</template>

<script>
import { getAlertConditions, manualTriggerAlert } from '@/API/Alert'
import DefaultSelect from '@/components/select/DefaultSelect'
import CreateAlertConditionDialog from './CreateAlertConditionDialog'
import AlertConditionDeleter from './AlertConditionDeleter'
import AlertConditionMessageEditorDialog from './AlertConditionMessageEditorDialog'
import EmptyInfoBlock from '@/components/EmptyInfoBlock'
import { mapState, mapGetters } from 'vuex'
import { alertTargetType } from '@/utils/general'

export default {
  name: 'WarningSetting',
  components: {
    DefaultSelect,
    CreateAlertConditionDialog,
    AlertConditionMessageEditorDialog,
    AlertConditionDeleter,
    EmptyInfoBlock
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
      isProcessing: false,
      tempWarningModuleConfig: {},
      currentEditingCondition: null,
      isShowCreateConditionDialog: false,
      isShowEditConditionMessageDialog: false,
      alertTargetType,
      timeoutFunction: null
    }
  },
  computed: {
    ...mapGetters('userManagement', ['getCurrentGroupId']),
    ...mapState('setting', ['locale']),
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
    },
    isEmpyAlertCondition () {
      return this.tempWarningModuleConfig.conditions.length === 0
    }
  },
  created () {
    this.fetchSettingData()
  },
  destroyed() {
    if (this.timeoutFunction) window.clearTimeout(this.timeoutFunction)
  },
  methods: {
    fetchSettingData () {
      this.isLoading = true

      // 示警模組設定
      const { activate, updateFrequency } = this.setting
      this.tempWarningModuleConfig = { activate, updateFrequency, conditions: [] }
      return this.fetchAlertConditions()
        .finally(() => this.isLoading = false )
    },
    fetchAlertConditions () {
      window.clearTimeout(this.timeoutFunction)
      const isOwnConditionIdList = this.setting.conditions.map(condition => condition.id)
      return getAlertConditions(this.getCurrentGroupId)
        .then(conditions => {      
          let latestConditions = []
          conditions
            .filter(condition => isOwnConditionIdList.includes(condition.id))
            .sort((a, b) => a.id - b.id)
            .forEach(condition => {

              // 尋找之前是否有針對此示警條件做過設定
              const prevConditionSetting = this.setting.conditions.find(item => item.id === condition.id)
              
              // 若有，檢查所設定關聯看板是否還存在
              let isRelatedDashbaordExist = false
              if (prevConditionSetting) isRelatedDashbaordExist = this.dashboardList.map(item => item.id).includes(prevConditionSetting.relatedDashboardId)
              
              // 組成示警條件列表
              latestConditions.push({
                ...condition,
                activate: prevConditionSetting ? prevConditionSetting.activate : false,
                relatedDashboardId: isRelatedDashbaordExist ? prevConditionSetting.relatedDashboardId : null
              })
            })

          this.tempWarningModuleConfig.conditions = latestConditions

          // 如果場上有示警條件則設定輪詢持續取得最新狀態
          if (this.tempWarningModuleConfig.conditions.length > 0) {
            this.timeoutFunction = window.setTimeout(() => {
              this.fetchAlertConditions()
            }, 5000)
          }
        })
    },
    openAlertConditionMessageDialog (condition) {
      this.currentEditingCondition = { ...condition }
      this.isShowEditConditionMessageDialog = true
    },
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
      
    },
    createAlertCondition (conditionId) {
      this.setting.conditions.push({
        id: conditionId,
        activate: true
      })
    },
    async alertConditionUpdated (action, conditionId) {
      switch (action) {
        case 'CreateCondition':
          this.createAlertCondition(conditionId)
          break
        case 'EditConditionMessage':
          this.isShowEditConditionMessageDialog = false
          this.currentEditingCondition = null
          break
      }
      await this.fetchSettingData()
      this.saveWarningModuleSetting()
    },
    isComponentAlerter (targetType) {
      return targetType === this.alertTargetType['COMPONENT']
    },
    isAllowManulTriggerAlert(status) {
      const enableList = ['Ready', 'Complete', 'Fail']
      return enableList.includes(status)
    },
    runAlert (conditionId) {
      // 先更新狀態，待下一次輪詢取得最新更新資訊
      manualTriggerAlert(conditionId)
        .then(() => {
          this.tempWarningModuleConfig.conditions = this.tempWarningModuleConfig.conditions.map(condition => {
            if (condition.id !== conditionId) return condition
            return { ...condition, status: 'Process' }
          })
        })
        .catch(() => {
           this.tempWarningModuleConfig.conditions = this.tempWarningModuleConfig.conditions.map(condition => {
            if (condition.id !== conditionId) return condition
            return { ...condition, status: 'Fail' }
          })
        })
    }
  },
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
    align-items: center;
    margin-bottom: 12px;
    margin-right: 20px;
    .nav-left {
      font-size: 20px;
      display: flex;
      align-items: center;
    }
    .nav-right {
      .btn {
        padding: 5px 10px;
        min-width: unset;
      }
    }
    .module-activate-controller {
      margin-left: 24px;
      font-size: 14px;
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
      margin-bottom: 20px;
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
    &-condition {
      overflow: overlay;
      height: 0;
      flex: 1;
      .title {
        display: flex;
        margin-right: 24px;
        padding: 0 24px 12px 24px;
      }
      .setting-block {
        position: relative;
        margin-bottom: 8px;
        &:last-child {
          margin-bottom: 24px;
        }
      }
    }
    .col {
      &-enable {
        flex: 0 0 100px;
      }
      &-condition {
        flex: 1;
        padding-right: 16px;
        .datasource-info {
          display: flex;
          align-items: center;
          flex-wrap: wrap;
          white-space: nowrap;
          font-size: 12px;
          list-style: 16px;
          color: #CCC;
          margin: 6px 0;
          .svg-icon {
            margin-right: 6px;
            &:not(:first-child) {
              margin-left: 6px;
            }
          }
        }
        .comparing-values {
          font-size: 12px;
          color: #999;
          margin-top: 6px;
          margin-bottom: 6px;
          & ~ .comparing-values {
            margin-top: 2px;
          }
        }
        .message-template {
          width: fit-content;
          font-size: 12px;
          background-color: #101919;
          border-radius: 5px;
          padding: 4px 8px;
          &__edit-btn {
            margin-left: 7.5px;
          }
        }
      }
      &-relation {
        flex: 0 0 285px;
      }
      &-status {
        flex: 0 1 160px;
        .message {
          display: flex;
          color: #CCCCCC;
          font-size: 12px;
        }
        /deep/ .spinner-block {
          padding: 0;
          margin-right: 7px;
        }
      }
      &-deletion {
        flex: 0 0 20px;
        .alert-condition-deleter {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          z-index: 1;
        }
      }
    }
    .empty-info-block {
      margin-right: 20px;
      background-color: #192322;
    }
  }
  &__reminding {
    font-size: 12px;
    line-height: 32px;
    padding-left: 16px;
    margin-bottom: 20px;
    margin-right: 20px;
    word-break: keep-all;
    background-color: rgba(255, 223, 111, 0.1);
    border-radius: 5px;

    .column-lamp {
      color: $theme-color-warning;
    }
  }
}
</style>
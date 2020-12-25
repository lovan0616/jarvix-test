<template>
  <div class="warning-setting">
    <nav class="warning-setting__nav">
      <div class="nav-left">{{ $t('alert.alertManagement') }}</div>
      <div class="nav-right">
        <button
          class="btn-m btn-secondary button-container__button"
          @click="isShowCreateConditionDialog = true"
        >{{ $t('alert.createAlertCondition') }}</button>
      </div>
    </nav>
    <main class="warning-setting__content">
      <div class="warning-setting__content-enable">
        <section class="setting-block">
          {{ $t('alert.enableAlertModule') }}：
          <el-switch
            v-model="tempWarningModuleConfig.activate"
            :width="Number('32')"
            class="module-activate-controller"
            active-color="#2AD2E2"
            inactive-color="#324B4E"
            @change="saveWarningModuleSetting"
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
            @change="saveWarningModuleSetting"
          />
        </section>
      </div>
      <div class="warning-setting__reminding">
        <span class="column-lamp">
          <svg-icon icon-class="lamp"/>
          {{ $t('askHelper.description') }}:
        </span>
        {{ $t('alert.alertSettingIsSharingByAllGroupApplications') }}
      </div>
      <div class="warning-setting__content-condition">
        <div class="title">
          <span class="col-enable">{{ $t('alert.enableAlertModule') }}</span>
          <span class="col-condition">{{ $t('alert.alertCondition') }}</span>
          <span class="col-relation">{{ $t('miniApp.relatedDashboard') }}</span>
          <span class="col-deletion"/>
        </div>
        <spinner 
          v-if="isLoading || isProcessing" 
          :title="$t('button.download')" 
          size="50"/>
        <section
          v-for="condition in tempWarningModuleConfig.conditions"
          v-else 
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
            <div 
              class="comparing-values" 
              v-html="displayedConditionMessage(condition.targetConfig.displayName, condition.comparingValues)"/>
            <div class="message-template">
              <span class="message-template__label">{{ $t('alert.alertLogMessage') }}</span>
              <span class="message-template__content">{{ condition.message }}</span>
              <a
                href="javascript:void(0)"
                class="link message-template__edit-btn"
                @click="openAlertConditionMessageDialog(condition)"
              >編輯內容</a>
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
          <div class="col-deletion">
            <alert-condition-deleter
              :condition="condition"
              @deleted="fetchAlertConditions"
            />
          </div>
        </section>
      </div>
    </main>
    <create-alert-condition-dialog
      v-if="isShowCreateConditionDialog"
      @close="isShowCreateConditionDialog = false"
      @created="alertConditionUpdated('CreateCondition')"
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
import {
  getAlertConditions,
  getAlertConditionMessageById
} from '@/API/Alert'
import DefaultSelect from '@/components/select/DefaultSelect'
import CreateAlertConditionDialog from './CreateAlertConditionDialog'
import AlertConditionDeleter from './AlertConditionDeleter'
import AlertConditionMessageEditorDialog from './AlertConditionMessageEditorDialog'
import { mapState, mapGetters } from 'vuex'

export default {
  name: 'WarningSetting',
  components: {
    DefaultSelect,
    CreateAlertConditionDialog,
    AlertConditionMessageEditorDialog,
    AlertConditionDeleter
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
      isShowEditConditionMessageDialog: false
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
    }
  },
  created () {
    this.fetchAlertConditions()
  },
  methods: {
    fetchAlertConditions () {
      this.isLoading = true

      // 示警模組設定
      const { activate, updateFrequency } = this.setting
      this.tempWarningModuleConfig = { activate, updateFrequency, conditions: [] }

      getAlertConditions(this.getCurrentGroupId).then(conditions => {      
        conditions.forEach(async (condition) => {

          // 尋找之前是否有針對此示警條件做過設定
          const prevConditionSetting = this.setting.conditions.find(item => item.id === condition.id)
          
          // 若有，檢查所設定關聯看板是否還存在
          let isRelatedDashbaordExist = false
          if (prevConditionSetting) isRelatedDashbaordExist = this.dashboardList.map(item => item.id).includes(prevConditionSetting.relatedDashboardId)
          
          // 取得示警訊息
          // TODO 之後 GET all condiotion API 會直接給 message
          const message = await this.fetchAlertConditionMessage(condition)

          // 組成示警條件列表
          this.tempWarningModuleConfig.conditions.push({
            ...condition,
            message,
            activate: prevConditionSetting ? prevConditionSetting.activate : false,
            relatedDashboardId: isRelatedDashbaordExist ? prevConditionSetting.relatedDashboardId : null
          })
        })
      }).finally(() => this.isLoading = false )
    },
    fetchAlertConditionMessage (condition) {
      return getAlertConditionMessageById(condition.id)
        .then(messagesOfAllLangs => {
          const currentLangMessage = messagesOfAllLangs.find(item => item.language.replace('_', '-') === this.locale)
          return currentLangMessage ? currentLangMessage.messageTemplate : '-'
        })
        .catch(() => '-')
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
    alertConditionUpdated (action) {
      this[`isShow${action}Dialog`] = false
      this.fetchAlertConditions()
      if (action === 'EditConditionMessage') this.currentEditingCondition = null
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
    &-enable {
      .setting-block {
        .module-activate-controller {
          margin: 0 12px;
        }
      }
    }
    &-condition {
      overflow: auto;
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
        flex: 0 0 140px;
      }
      &-condition {
        flex: 1;
        padding-right: 16px;
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
        flex: 0 0 200px;
      }
      &-deletion {
        flex: 0 0 20px;
        .alert-condition-deleter {
          position: absolute;
          top: 12px;
          right: 12px;
        }
      }
    }
  }
  &__reminding {
    font-size: 12px;
    line-height: 32px;
    padding-left: 16px;
    margin-bottom: 12px;
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
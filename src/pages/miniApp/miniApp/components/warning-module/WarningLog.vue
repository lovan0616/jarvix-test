<template>
  <div class="warning-log">
    <nav class="warning-log__nav">
      {{ $t('miniApp.warningLogs') }}
    </nav>
    <div class="warning-log__content">
      <template v-if="setting.activate">
        <spinner 
          v-if="isLoading" 
          :title="$t('button.download')" 
          size="50"/>
        <el-table
          v-else
          :data="warningLogs"
          class="sy-table"
          style="width: 100%">
          <div slot="empty">{{ $t('miniApp.emptyLogs') }}</div>
          <el-table-column
            :label="$t('miniApp.warningLogCreateTime')"
            prop="createDate"
            width="220">
            <template slot-scope="scope">
              <span>{{ scope.row.createDate | convertTimeStamp }}</span>
            </template>  
          </el-table-column>
          <el-table-column
            :label="$t('miniApp.warningLogMessage')"
            prop="conditionMetMessage"/>
          <el-table-column
            :label="$t('miniApp.state')"
            prop="active"
            width="120">
            <template slot-scope="scope">
              <custom-dropdown-select
                :data-list="stateOptions"
                :has-bullet-point="false"
                trigger="hover"
                @select="updateLogActiveness(scope.row.conditionMetLogId, $event)"
              >
                <template #display>
                  <div 
                    :class="scope.row.active ? 'button--active' : 'button--inactive'" 
                    class="button">
                    <span class="button-label">
                      {{ scope.row.active ? $t('miniApp.finished') : $t('miniApp.unfinished') }}
                    </span>
                    <svg-icon 
                      icon-class="triangle" 
                      class="icon-triangle"/>
                  </div>
                </template>
              </custom-dropdown-select>
            </template>
          </el-table-column>
          <el-table-column
            :label="$t('miniApp.goToDashboard')"
            prop="relatedDashboardId"
            width="120">
            <template slot-scope="scope">
              <a 
                class="link" 
                @click.stop="$emit('goToCertainDashboard', scope.row.relatedDashboardId)">
                {{ $t('miniApp.link') }}
              </a>
            </template>
          </el-table-column>
        </el-table>
      </template>
      <div 
        v-else 
        class="warning-log__content-empty">{{ $t('miniApp.warningModuleIsInactive') }}</div>
    </div>
  </div>
</template>

<script>
import { getAlertLogs, patchAlertLogActiveness } from '@/API/Alert'
import CustomDropdownSelect from '@/components/select/CustomDropdownSelect'

export default {
  name: 'WarningLog',
  components: {
    CustomDropdownSelect
  },
  props: {
    setting: {
      type: Object,
      default: () => {}
    },
  },
  data () {
    return {
      isLoading: false,
      warningLogs: [],
      isProcessing: false
    }
  },
  computed: {
    activeConditionIds () {
      if (!this.setting.conditions) return []
      return this.setting.conditions.filter(item => item.activate).map(item => item.id)
    },
    stateOptions () {
      return [
        {
          name: this.$t('miniApp.finished'),
          id: true
        },
        {
          name: this.$t('miniApp.unfinished'),
          id: false
        }
      ]
    }
  },
  created () {
    this.activeConditionIds.length > 0 && this.getWarningLogs(this.activeConditionIds)
  },
  methods: {
    getWarningLogs (activeConditionIds) {
      this.isLoading = true
      getAlertLogs({ conditionIds: activeConditionIds }).then(response => {
        this.warningLogs = response.data.map(log => {
          const prevSettingCondition = this.setting.conditions.find(item => item.id === log.conditionId)
          return {
            ...log,
            relatedDashboardId: prevSettingCondition ? prevSettingCondition.relatedDashboardId : null
          }
        })
      })
        .catch(() => {})
        .finally(() => this.isLoading = false )
    },
    updateLogActiveness (logId, isActive) {
      this.isProcessing = true
      patchAlertLogActiveness(logId, { "active" : isActive })
        .then(() => this.getWarningLogs(this.activeConditionIds))
        .finally(() => this.isProcessing = false)
    }
  }
}
</script>

<style lang="scss" scoped>
.warning-log {
  height: 100%;
  display: flex;
  flex-direction: column;
  &__nav {
    display: flex;
    justify-content: space-between;
    margin-bottom: 12px;
    margin-right: 20px;
    font-size: 20px;
  }
  &__content {
    flex: 1;
    height: 0;
    display: flex;
    flex-direction: column;
    padding: 0 20px 20px 0;
    &-empty {
      padding-top: 30vh;
      text-align: center;
      color: #A4A4A4;
    }
  }

  /deep/ .dropdown {
    &__list-container {
      left: -40%;
      top: 115%;
      text-align: left;
      z-index: 1;
      width: 136px;

      &::before {
        position: absolute;
        content: "";
        bottom: 100%;
        left: 0;
        width: 100%;
        background-color: transparent;
        height: 12px;
      }

      &::after {
        position: absolute;
        content: "";
        bottom: 100%;
        left: 50%;
        transform: translateX(-50%);
        border-bottom: 8px solid #2B3839;
        border-left: 8px solid transparent;
        border-right: 8px solid transparent;
      }
    }
    &__link {
      line-height: 39px;
      font-weight: 600;
      font-size: 14px;
    }
    .icon-triangle {
      transform: rotate(180deg);
      font-size: 8px;
    }
    .button {
      cursor: pointer;
      padding: 0 8px;
      border-radius: 5px;
      font-weight: 600;
      font-size: 12px;
      display: inline-block;
      &--inactive {
        background: rgba(255, 255, 255, 0.2);
        color: #DDDDDD;

      }
      &--active {
        background: #2FECB3;
        color: #2E2E2E;
      }
    }
  }

  /deep/ .el-table {
    /deep/.cell {
      overflow: unset;
    }
    &__body-wrapper {
      overflow: unset;
    }
  }
}
  
</style>
<template>
  <spinner
    v-if="isLoading"
    size="50"
  />
  <div v-else>
    <div
      v-if="isShowOrderUpload && $route.name === 'ScheduleBaseSetting'"
      class="setting setting--basic"
    >
      <div class="setting__header">
        <h2 class="header__title">
          Order
        </h2>
      </div>
      <div class="setting__body">
        <order-upload />
      </div>
    </div>
    <!-- 基本設定 -->
    <div class="setting setting--basic">
      <div class="setting__header">
        <h2 class="header__title">
          {{ $t('schedule.setting.title') }}
        </h2>
        <div class="header__action">
          <default-button @click="saveSetting">
            {{ $t('schedule.setting.save') }}
          </default-button>
        </div>
      </div>
      <div class="setting__body">
        <section class="body__block body__block--duration">
          <h3 class="block__title">
            {{ $t('schedule.setting.init') }}
          </h3>
          <div class="block__form">
            <div class="form__item">
              <div class="form__label">
                *{{ $t('schedule.setting.scheduleDuration') }}
              </div>
              <div class="form__content">
                <el-input-number
                  v-model="settingInfo.scheduleDays"
                  :min="1"
                  class="ss-input-number"
                />
                <span class="schedule-duration__input-unit">{{ $t('schedule.base.day') }}</span>
              </div>
            </div>
            <div
              v-if="solutionSequence"
              class="form__item"
            >
              <div class="form__label">
                *{{ $t('schedule.simulation.startDatetime') }}
              </div>
              <div class="form__content">
                <default-date-picker
                  v-model="settingInfo.scheduleStartDate"
                  :picker-options="pickerOptions"
                  format="yyyy/MM/dd"
                  value-format="yyyy/MM/dd"
                  type="date"
                />
              </div>
            </div>
          </div>
        </section>
        <section
          v-if="settingInfo.worktimes"
          class="body__block body__block--shift"
        >
          <h3 class="block__title">
            {{ $t('schedule.setting.workingHoursSetting') }}
            <i
              :class="{'is-rotate': collapseAll.worktimes}"
              class="block__collapse-controller el-icon-arrow-down"
              @click="toggleCollapse('worktimes')"
            />
            <span class="reminding">
              <i class="el-icon-warning-outline" />
              {{ $t('schedule.setting.useMilitaryTime') }}
            </span>
          </h3>
          <div class="block__form">
            <shift-setting
              :worktimes="settingInfo.worktimes"
              :collapse-all="collapseAll.worktimes"
            />
          </div>
          <div
            v-if="solutionSequence && !isYKSchedule"
            class="block__form"
          >
            <exception-time-setting
              :start-date="settingInfo.scheduleStartDate"
              :schedule-days="settingInfo.scheduleDays"
              :periods="settingInfo.overtimes"
              :title="$t('schedule.simulation.overTimeShift')"
            />
          </div>
          <div
            v-if="solutionSequence"
            class="block__form"
          >
            <exception-time-setting
              :start-date="settingInfo.scheduleStartDate"
              :schedule-days="settingInfo.scheduleDays"
              :periods="settingInfo.leavetimes"
              :title="$t('schedule.simulation.leaveTimeShift')"
            />
          </div>
        </section>
        <section
          v-if="!isYKSchedule"
          class="body__block body__block--equipment"
        >
          <h3 class="block__title">
            {{ $t('schedule.setting.machine') }}
            <i
              :class="{'is-rotate': collapseAll.excludedPeriod}"
              class="block__collapse-controller el-icon-arrow-down"
              @click="toggleCollapse('excludedPeriod')"
            />
            <span class="reminding">
              <i class="el-icon-warning-outline" />
              {{ $t('schedule.setting.useMilitaryTime') }}
            </span>
          </h3>
          <div class="block__form">
            <spinner v-if="isLoadingEquipments" />
            <div
              v-else-if="!equipments"
              class="empty-block"
            >
              {{ $t('schedule.setting.equipmentInfoIsUnbound') }}
            </div>
            <exclude-setting
              v-else
              :excluded-equipment="settingInfo.excludeEquipments"
              :equipments="equipments"
              :collapse-all="collapseAll.excludedPeriod"
            />
          </div>
        </section>
        <section
          v-if="settingInfo.kpiSetting && !isYKSchedule"
          class="body__block body__block--kpi"
        >
          <h3 class="block__title">
            {{ $t('schedule.setting.simulationKPI') }}
            <span class="reminding">
              <i class="el-icon-warning-outline" />
              {{ $t('schedule.setting.noReapeatNumber') }}
            </span>
          </h3>
          <kpi-setting :setting="settingInfo.kpiSetting" />
        </section>
      </div>
    </div>
    <!-- 滾動排程設定 -->
    <div
      v-if="!isYKSchedule"
      class="setting setting--rolling"
    >
      <div class="setting__header">
        <h2 class="header__title">
          {{ $t('schedule.rolling.rollingSetting') }}
        </h2>
      </div>
      <div class="setting__body">
        <!-- 滾動排程方式設定 -->
        <section class="body__block">
          <div class="block__title">
            {{ $t('schedule.rolling.rollingTypes') }}
          </div>
          <rolling-type-setting
            :original-setting="settingInfo.incompleteAction"
            @change="settingInfo.incompleteAction = $event"
          />
        </section>
        <!-- 自動更新生產狀況 -->
        <section
          v-if="!solutionSequence"
          class="body__block"
        >
          <div class="block__title">
            {{ $t('schedule.setting.autoUpdateProduceStatus') }}
            <div class="reminder">
              <a
                class="link"
                @click="isShowScheduleProjectRelationDialog = true"
              >
                {{ $t('schedule.setting.bindDataframe') }}
              </a>
              <div
                v-if="!isBoundWithProductionProgress"
                class="highlight"
              >
                <svg-icon icon-class="alert-circle-outline" />
                {{ $t('schedule.setting.bindProductionProgressReminder') }}
              </div>
            </div>
          </div>
          <auto-update-produce-status-setting
            :original-setting="settingInfo.progressUpdateSetting"
            :is-bound-with-production-progress="isBoundWithProductionProgress"
            @change="settingInfo.progressUpdateSetting = $event"
          />
          <schedule-project-relation-dialog
            v-if="isShowScheduleProjectRelationDialog"
            :project-info="getCurrentProject"
            @close="isShowScheduleProjectRelationDialog = false"
            @setIsBoundWithProductionProgress="isBoundWithProductionProgress = $event"
          />
        </section>
        <!-- 生產延遲通知數量設定 -->
        <section
          v-if="!solutionSequence"
          class="body__block"
        >
          <div class="block__title">
            {{ $t('schedule.rolling.delayNotificationManagement') }}
            <div
              v-if="settingInfo.alertSetting.alertType === ALERT_TYPE.ALERT_OFF"
              class="reminder"
            >
              <div class="highlight">
                <svg-icon icon-class="alert-circle-outline" />
                {{ $t('schedule.setting.activeDelayNotifyReminder') }}
              </div>
            </div>
          </div>
          <rolling-delay-criteria-setting
            :original-setting="settingInfo.alertSetting"
            @change="settingInfo.alertSetting = $event"
          />
        </section>
      </div>
    </div>
    <!-- 示警通知功能設定 -->
    <div
      v-if="!solutionSequence && !isYKSchedule"
      class="setting setting--notification"
    >
      <div class="setting__header">
        <h2 class="header__title">
          {{ $t('schedule.notification.setting') }}
          <default-button
            @click="isShowGroupSettingDialog = true"
          >
            {{ $t('schedule.setting.groupManagement') }}
          </default-button>
        </h2>
      </div>
      <div class="setting__body">
        <div class="body__block">
          <div class="block__title">
            {{ $t('schedule.notification.targetSetting') }}
          </div>
          <notification-setting
            :original-setting="settingInfo.alertEventSetting"
            @toggleActive="onNotificationActivenessChanged($event)"
          />
        </div>
      </div>
      <group-setting-dialog
        v-if="isShowGroupSettingDialog"
        :notification-setting="settingInfo.alertEventSetting"
        @close="closeGroupSetting"
      />
    </div>
  </div>
</template>

<script>
import OrderUpload from './components/OrderUpload'
import ShiftSetting from './components/shiftSetting/ShiftSetting'
import ExcludeSetting from './components/excludeSetting/ExcludeSetting'
import KpiSetting from './components/kpiSetting/KpiSetting'
import ExceptionTimeSetting from '@/schedule/pages/simulation/setting/components/ExceptionTimeSetting'
import RollingTypeSetting from './components/rollingSetting/RollingTypeSetting'
import RollingDelayCriteriaSetting from './components/rollingSetting/RollingDelayCriteriaSetting'
import AutoUpdateProduceStatusSetting from './components/rollingSetting/AutoUpdateProduceStatusSetting'
import NotificationSetting from './components/notificationSetting/NotificationSetting'
import GroupSettingDialog from './components/groupSetting/GroupSettingDialog'
import ScheduleProjectRelationDialog from '../projectManagement/components/dialog/relation/ScheduleProjectRelationDialog.vue'
import { fetchDataBoundStatus } from '@/schedule/API/Project'
import { mapState, mapGetters } from 'vuex'
import { validateSimulationSetting } from '@/schedule/utils/mixins'
import { NOTIFICATION, ALERT_TYPE } from '@/schedule/utils/enum'
import { Message } from 'element-ui'

export default {
  name: 'BaseSetting',
  components: {
    OrderUpload,
    ShiftSetting,
    ExcludeSetting,
    KpiSetting,
    ExceptionTimeSetting,
    RollingTypeSetting,
    RollingDelayCriteriaSetting,
    AutoUpdateProduceStatusSetting,
    NotificationSetting,
    GroupSettingDialog,
    ScheduleProjectRelationDialog
  },
  props: {
    solutionSequence: {
      type: Number,
      default: null
    }
  },
  data () {
    return {
      isLoading: true,
      isLoadingEquipments: false,
      isProcessing: false,
      isShowGroupSettingDialog: false,
      isShowScheduleProjectRelationDialog: false,
      isBoundWithProductionProgress: false,
      settingInfo: {},
      prevSetting: {},
      equipments: null,
      collapseAll: {
        // 後台設定預設展開區塊，模擬頁面預設收合區塊
        worktimes: Boolean(this.solutionSequence),
        excludedPeriod: Boolean(this.solutionSequence)
      },
      ALERT_TYPE,
      pickerOptions: {
        disabledDate: (time) => {
          return this.isYKSchedule ? time.getFullYear() < 2021 : false
        }
      }
    }
  },
  computed: {
    ...mapState('simulation', ['planId']),
    ...mapState('scheduleSetting', ['scheduleProjectId']),
    ...mapGetters('scheduleSetting', ['getCurrentProject', 'isYKSchedule']),
    isShowOrderUpload () {
      return localStorage.getItem('isShowOrderUpload') === 'true'
    }
  },
  mounted () {
    const defaultSetting = this.$store.state.scheduleSetting.defaultSetting
    const equipments = this.$store.state.scheduleSetting.equipments

    // 若已拿過後台設定且為模擬方案，則顯示模擬資訊
    const solutionInfo = this.$store.state.simulation.solutions.find(s => s.sequence === this.solutionSequence)
    if (defaultSetting && solutionInfo) {
      this.settingInfo = solutionInfo
      this.equipments = equipments
      this.isLoading = false
      return
    }
    this.fetchBackStageSetting()
    this.fetchFiles()
  },
  methods: {
    fetchBackStageSetting () {
      this.$store.dispatch('scheduleSetting/getSetting')
        .then(prevSetting => {
          this.prevSetting = prevSetting
          this.settingInfo = { ...prevSetting, projectId: this.scheduleProjectId }
          this.formatAlertEventSetting()
          this.$store.commit('scheduleSetting/updateSetting', this.settingInfo)
        })
        .catch(() => {})
        .finally(() => this.isLoading = false)
    },
    fetchFiles () {
      fetchDataBoundStatus(this.scheduleProjectId)
        .then(files => {
          files.forEach(file => {
            if (file.dataframeStatus === 'BOUND') {
              switch (file.code) {
                case 'EQUIPMENT': {
                  this.fetchEquipments()
                  break
                }
                case 'PRODUCTION_PROGRESS': {
                  this.isBoundWithProductionProgress = true
                  break
                }
              }
            }
          })
        })
        .catch(() => {})
        .finally(() => {})
    },
    fetchEquipments () {
      this.isLoadingEquipments = true
      this.$store.dispatch('scheduleSetting/getEquipments')
        .then(equipments => {
          this.equipments = equipments
          this.$store.commit('scheduleSetting/setEquipments', equipments)
        })
        .catch(() => {})
        .finally(() => this.isLoadingEquipments = false)
    },
    saveSetting () {
      // 表單驗證
      if (!validateSimulationSetting(this.settingInfo)) {
        if (this.solutionSequence) {
          this.$store.commit('simulation/updateSolutionValidStatusBySequence', {
            sequence: this.solutionSequence,
            isValid: false
          })
        }
        return
      }

      if (this.solutionSequence) {
        this.settingInfo.valid = true
        if (this.planId) this.settingInfo.simulated = false
        this.$store.commit('simulation/updateSolutionBySequence', {
          sequence: this.solutionSequence,
          data: this.settingInfo
        })
        Message({
          message: this.$t('schedule.successMessage.settingSaved'),
          type: 'success',
          duration: 3 * 1000,
          showClose: true
        })
        return
      }

      this.isProcessing = true
      const copiedSetting = { ...this.settingInfo }
      this.$store.dispatch('scheduleSetting/setSetting', copiedSetting).then(() => {
        Message({
          message: this.$t('schedule.successMessage.settingSaved'),
          type: 'success',
          duration: 3 * 1000,
          showClose: true
        })
        this.$store.commit('scheduleSetting/updateSetting', copiedSetting)
      })
        .catch(() => {})
        .finally(() => this.isProcessing = false)
    },
    formatAlertEventSetting () {
      this.settingInfo.alertEventSetting.forEach(event => {
        switch (event.alertEvent) {
          case NOTIFICATION.DELAY:
            event.isActive = this.settingInfo.alertSetting.alertType !== ALERT_TYPE.ALERT_OFF
        }
      })
    },
    onNotificationActivenessChanged ({ alertEvent, isActive }) {
      switch (alertEvent) {
        case NOTIFICATION.DELAY:
          if (isActive) {
            this.$set(this.settingInfo, 'alertSetting', {
              alertThreshold: this.prevSetting.alertSetting.alertThreshold || '100',
              alertType: this.prevSetting.alertSetting.alertType === ALERT_TYPE.ALERT_OFF
                ? ALERT_TYPE.ALERT_PERCENTAGE
                : this.prevSetting.alertSetting.alertType
            })
          } else {
            this.$set(this.settingInfo, 'alertSetting', {
              alertThreshold: null,
              alertType: ALERT_TYPE.ALERT_OFF
            })
          }
      }
    },
    toggleCollapse (section) {
      this.collapseAll[section] = !this.collapseAll[section]
    },
    closeGroupSetting (shouldRefetch) {
      this.isShowGroupSettingDialog = false
      if (shouldRefetch) this.fetchBackStageSetting()
    }
  }
}
</script>

<style lang="scss" scoped>
.setting {
  padding: 24px;
  &--basic {
    .setting__body {
      display: flex;
      flex-direction: column;
      .body__block {
        &--duration {
          .form__item { flex-basis: 100% }
        }
      }
      .body__block {
        &--duration    { order: 1 }
        &--shift       { order: 2 }
        &--overtime    { order: 3 }
        &--equipment   { order: 4 }
        &--kpi         { order: 5 }
        &--url         { order: 6 }
        .page--simulation & {
          &--duration  { order: 1 }
          &--kpi       { order: 2 }
          &--shift     { order: 3 }
          &--overtime  { order: 4 }
          &--equipment { order: 5 }
          &--url       { order: 6 }
        }
      }
    }
  }
  &--rolling {
    .reminder {
      margin-left: 12px;
      display: inline-flex;
      align-items: center;
      gap: 16px;
      font-size: 12px;
      .highlight {
        color: $theme-color-warning;
      }
    }
  }
  &__header {
    display: flex;
    align-items: center;
    margin-bottom: 16px;
    .header {
      &__title {
        display: flex;
        align-items: center;
        margin-top: 0;
        margin-bottom: 0;
        .default-button {
          margin-left: 16px;
        }
      }
      &__action {
        margin-left: 20px;
      }
    }
  }
  &__body {
    padding: 24px;
    background-color: var(--color-black);
    border-radius: 8px;
    .body__block {
      &:not(:first-child) {
        margin-top: 48px;
      }
      &--shift, &--equipment, &--kpi {
        .block__title {
          .reminding {
            color: var(--color-warning);
            font-size: 12px;
            font-weight: bold;
            margin-left: 8px;
          }
        }
      }
      .block__title {
        font-size: 20px;
        margin-top: 0;
        margin-bottom: 16px;
        &:before {
          content: '';
          display: inline-block;
          vertical-align: middle;
          width: 6px;
          height: 6px;
          margin-right: 4px;
          background-color: var(--color-info);
          transform: translateY(-50%);
        }
        .block__collapse-controller {
          cursor: pointer;
          user-select: none;
          transition: all .3s ease;
          &.is-rotate {
            transform: rotate(180deg);
          }
        }
      }
      .block__form {
        display: flex;
        align-items: center;
        flex-wrap: wrap;
        ::v-deep .form__item {
          display: flex;
          align-items: center;
          margin-right: 16px;
          margin-bottom: 16px;
          .form__content {
            display: flex;
            align-items: center;
            margin-left: 20px;
            .sync-url__input .el-input__inner {
              width: 300px;
            }
            .schedule-duration__input-unit {
              display: inline-block;
              font-size: 14px;
              margin-left: 8px;
            }
          }
        }
      }
    }
  }
}
</style>

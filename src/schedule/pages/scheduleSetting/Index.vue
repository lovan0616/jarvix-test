<template>
  <div
    v-if="isLoading"
    class="page__spinner"
  >
    <spinner size="50" />
  </div>
  <div
    v-else
    class="page page--setting"
  >
    <div
      v-if="isShowOrderUpload && $route.name === 'ScheduleSetting'"
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
            v-if="solutionSequence"
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
              {{ $t('schedule.setting.useMilitaryTime') }}
            </span>
          </h3>
          <div class="block__form">
            <exclude-setting
              :excluded-equipment="settingInfo.excludeEquipments"
              :equipments="equipments"
              :collapse-all="collapseAll.excludedPeriod"
            />
          </div>
        </section>
        <section
          class="body__block body__block--kpi"
          v-if="settingInfo.kpiSetting && !isYKSchedule"
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
      <default-button
        class="save-btn"
        @click="saveSetting"
      >
        {{ $t('schedule.setting.save') }}
      </default-button>
    </div>
    <!-- 額外限制條件設定 -->
    <div
      v-if="!solutionSequence"
      class="setting setting--constraint"
    >
      <div class="setting__header">
        <h2 class="header__title">
          {{ $t('schedule.setting.extraConstraintSetting') }}
        </h2>
      </div>
      <div class="setting__body">
        <spinner v-if="isFetchingAdvanceSetting" />
        <div
          v-for="file in files.constraint"
          v-else
          :key="file.code"
          class="file"
        >
          <single-constraint-file :file-data="file"/>
        </div>
      </div>
    </div>
    <!-- 共用資料設定 -->
    <div
      v-if="!solutionSequence"
      class="setting setting--common"
    >
      <div class="setting__header">
        <h2 class="header__title">
          {{ $t('schedule.setting.commonDataSetting') }}
        </h2>
      </div>
      <div class="setting__body">
        <spinner v-if="isFetchingAdvanceSetting" />
        <div
          v-for="file in files.raw_data"
          v-else
          :key="file.code"
          class="file"
        >
          <single-common-file :file-data="file" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import OrderUpload from './components/OrderUpload'
import ShiftSetting from './components/shiftSetting/ShiftSetting'
import ExcludeSetting from './components/excludeSetting/ExcludeSetting'
import KpiSetting from './components/kpiSetting/KpiSetting'
import SingleConstraintFile from './components/constraintSetting/SingleConstraintFile'
import SingleCommonFile from './components/commonDataSetting/SingleCommonFile'
import ExceptionTimeSetting from '@/schedule/pages/simulation/setting/components/ExceptionTimeSetting'
import { fetchDataBoundStatus } from '@/schedule/API/Project'
import { Message } from 'element-ui'
import { mapState, mapGetters } from 'vuex'
import { validateSimulationSetting } from '@/schedule/utils/mixins'

export default {
  name: 'ScheduleSetting',
  components: {
    OrderUpload,
    ShiftSetting,
    ExcludeSetting,
    KpiSetting,
    ExceptionTimeSetting,
    SingleConstraintFile,
    SingleCommonFile
  },
  props: {
    solutionSequence: {
      type: Number,
      default: null
    }
  },
  data () {
    return {
      isLoading: false,
      settingInfo: {},
      equipments: [],
      files: {
        raw_data: [],
        constraint: []
      },
      isFetchingAdvanceSetting: false,
      collapseAll: {
        // 後台設定預設展開區塊，模擬頁面預設收合區塊
        worktimes: Boolean(this.solutionSequence),
        excludedPeriod: Boolean(this.solutionSequence)
      },
      scheduleStartDatePickerOptions: {
        disabledDate (time) {
          return time.getTime() < Date.now()
        }
      }
    }
  },
  computed: {
    ...mapState('simulation', ['solutions', 'planId']),
    ...mapState('scheduleSetting', ['scheduleProjectId']),
    ...mapGetters('scheduleSetting', ['isYKSchedule']),
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
      return
    }

    this.fetchFiles()

    this.$store.dispatch('scheduleSetting/getSetting').then(prevSetting => {
      // 拿到先前設定
      this.settingInfo = { ...prevSetting, projectId: this.scheduleProjectId }
      delete this.settingInfo.worktimes.weekList
      this.$store.commit('scheduleSetting/updateSetting', this.settingInfo)
    })
    this.$store.dispatch('scheduleSetting/getEquipments')
      .then(equipments => {
        // 拿到設備列表
        this.equipments = equipments
        this.$store.commit('scheduleSetting/setEquipments', equipments)
      })
      .catch(() => {})
  },
  methods: {
    fetchFiles () {
      this.isFetchingAdvanceSetting = true
      fetchDataBoundStatus(this.scheduleProjectId)
        .then(files => {
          files.forEach(file => {
            const category = file.category
            if (file.category === 'RAW_DATA' || file.category === 'CONSTRAINT') {
              this.files[category.toLowerCase()].push(file)
            }
          })
          this.isFetchingAdvanceSetting = false
        })
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

      this.isLoading = true
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
      .finally(() => {
        this.isLoading = false
      })
    },
    toggleCollapse (section) {
      this.collapseAll[section] = !this.collapseAll[section]
    }
  }
}
</script>

<style lang="scss" scoped>
.page {
  padding: 24px;
  &__spinner {
    margin-top: 30vh;
  }
  &__header {
    margin-bottom: 16px;
    .header__title {
      font-size: 24px;
      line-height: 32px;
      margin-top: 0;
      margin-bottom: 0;
    }
  }
  &__section {
    padding: 24px;
    background-color: var(--color-black);
    border-radius: 8px;
  }
  .setting {
    &+.setting {
      margin-top: 56px;
    }
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
    &__header {
      display: flex;
      align-items: center;
      margin-bottom: 16px;
      .header {
        &__title {
          margin-top: 0;
          margin-bottom: 0;
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
        .block__title {
          margin-top: 0;
          margin-bottom: 0;
        }
        &--shift, &--equipment, &--kpi {
          .block__title {
            .reminding {
              margin-left: 8px;
            }
          }
        }
        .block__title {
          font-size: 20px;
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
          /deep/ .form__item {
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
      /deep/ .file {
        background: rgba(0, 0, 0, 0.55);
        box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.12);
        border-radius: 8px;
        &:not(:last-child) {
          margin-bottom: 16px;
        }
        &__item {
          width: 100%;
          padding: 24px;
          border-radius: 8px;
          display: flex;
          justify-content: space-between;
          background: rgba(35, 61, 64, 0.6);
        }

        &__item-info {
          flex: 1;
        }

        &__item-title {
          font-size: 18px;
          margin-bottom: 13px;
          font-weight: 600;
        }

        &__item-description {
          display: flex;
          font-size: 14px;
        }

        &__item-name {
          flex: 3;
          width: 245px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          &.is-empty {
            color: #AAA;
          }
        }
        &__item-date {
          flex: 2;
          &.is-empty {
            color: #AAA;
          }
        }

        &__item-button-block {
          display: flex;
          justify-content: flex-end;
        }

        &__item-button {
          margin-left: 12px;
          display: flex;
          align-items: center;
        }
      }
    }
  }
  .save-btn{
    height: 40px;
    margin-top: 16px;
    border-radius: 6px;
  }
  /deep/ .reminding {
    color: var(--color-warning);
    font-size: 12px;
    font-weight: bold;
  }
}
</style>

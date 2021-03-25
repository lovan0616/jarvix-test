<template>
  <div
    v-if="!settingInfo"
    class="page__spinner"
  >
    <spinner size="50" />
  </div>
  <div
    v-else
    class="page page--setting"
  >
    <!-- 基本設定 -->
    <div class="setting setting--basic">
      <div class="setting__header">
        <h2 class="header__title">
          Surgery Scheduling Simultion
        </h2>
        <div class="header__action">
          <default-button @click="saveSetting">
            Save
          </default-button>
        </div>
      </div>
      <div class="setting__body">
        <section class="body__block body__block--duration">
          <h3 class="block__title">
            Scheduling Time Setting
          </h3>
          <div class="block__form">
            <div class="form__item">
              <div class="form__label">
                *Length
              </div>
              <div class="form__content">
                <el-input-number
                  v-model="settingInfo.scheduleDays"
                  :min="1"
                  class="ss-input-number"
                />
                <span class="schedule-duration__input-unit">Days</span>
              </div>
            </div>
            <div
              v-if="solutionSequence"
              class="form__item"
            >
              <div class="form__label">
                *Start Date
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
            Staff Availability Hours
            <i
              :class="{'is-rotate': collapseAll.worktimes}"
              class="block__collapse-controller el-icon-arrow-down"
              @click="toggleCollapse('worktimes')"
            />
            <div class="block__title-right">
              <default-select
                v-model="selectedStaff"
                :options="staffOptions"
              />
              <default-select
                v-model="selectedName"
                :options="nameOptions"
              />
            </div>
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
              title="Extra Working Hours"
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
              title="Leave of Absence"
            />
          </div>
        </section>
        <section
          v-if="settingInfo.kpiSetting"
          class="body__block body__block--kpi"
        >
          <h3 class="block__title">
            Scheduling Preference Setting
          </h3>
          <kpi-setting :setting="settingInfo.kpiSetting" />
        </section>
      </div>
      <default-button
        class="save-btn save-btn--large"
        @click="saveSetting"
      >
        Save
      </default-button>
    </div>
  </div>
</template>

<script>
import ShiftSetting from './components/shiftSetting/ShiftSetting'
import KpiSetting from './components/kpiSetting/KpiSetting'
import ExceptionTimeSetting from '@/pages/patientSchedule/simulation/setting/components/ExceptionTimeSetting'
import { Message } from 'element-ui'
import { mapState } from 'vuex'

export default {
  name: 'ScheduleSetting',
  components: {
    ShiftSetting,
    KpiSetting,
    ExceptionTimeSetting,
  },
  props: {
    solutionSequence: {
      type: Number,
      default: null
    }
  },
  data () {
    return {
      settingInfo: null,
      equipments: [],
      isShowUploadFileDialog: false,
      constraintSetting: [],
      commonDataSetting: [],
      publicPath: process.env.BASE_URL,
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
      },
      selectedStaff: 'Surgeon',
      selectedName: 'Ashely L.'
    }
  },
  computed: {
    ...mapState('simulation', ['solutions', 'planId']),
    isShowOrderUpload () {
      return localStorage.getItem('isShowOrderUpload') === 'true'
    },
    staffOptions () {
      return [
        { label: 'Surgeon', value: 'Surgeon' },
        { label: 'Anesthetist', value: 'Anesthetist' }
      ]
    },
    nameOptions () {
      return [
        { label: 'Ashely L.', value: 'Ashely L.' },
        { label: 'Katherine W.', value: 'Katherine W.' },
        { label: 'Paul H.', value: 'Paul H.' }
      ]
    }
  },
  mounted () {
    this.settingInfo = this.solutions.find(item => item.sequence === this.solutionSequence)
  },
  methods: {
    saveSetting () {
      if (Object.values(this.settingInfo.kpiSetting).sort().toString() !== [1, 2, 3, 4].toString()) {
        return Message({
          message: 'Preference Index Duplicated.',
          type: 'warning',
          duration: 3 * 1000
        })
      }

      this.settingInfo.valid = true
      if (this.planId) this.settingInfo.simulated = false
      this.$store.commit('simulation/updateSolutionBySequence', {
        sequence: this.solutionSequence,
        data: this.settingInfo
      })
      Message({
        message: 'Setting Saved',
        type: 'success',
        duration: 3 * 1000,
        showClose: true
      })
    },
    toggleCollapse (section) {
      this.collapseAll[section] = !this.collapseAll[section]
    }
  }
}
</script>

<style lang="scss" scoped>
/deep/ * {
  font-weight: 300;
  letter-spacing: 0.5px;
}
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
          display: flex;
          align-items: center;
          &-right {
            flex: 1;
            text-align: right;
            .default-select + .default-select {
              margin-left: 8px;
            }
          }
        }
        &--shift, &--equipment, &--kpi {
          .block__title {
            .reminding {
              margin-left: 8px;
              font-size: 12px;
            }
          }
        }
        &--kpi {
          .reminding {
            color: var(--color-warning);
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
            margin: 4px 4px 0 0;
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
        &__item {
          width: 100%;
          padding: 24px;
          margin-bottom: 16px;
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
          margin-right: 131px;
          width: 245px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
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
  .save-btn--large {
    width: 217px;
    height: 40px;
    margin-top: 16px;
    border-radius: 6px;
  }
}
</style>

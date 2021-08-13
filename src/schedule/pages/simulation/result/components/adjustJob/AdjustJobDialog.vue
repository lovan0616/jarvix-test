<template>
  <div class="full-page-dialog adjust-job-dialog">
    <div class="dialog-container">
      <div class="dialog-title">
        {{ $t('schedule.simulation.adjustJob.jobName') }}：{{ jobInfo.jobName }}
      </div>
      <div>
        <!-- 開始生產時間 -->
        <div class="section">
          <div class="section__title">
            {{ $t('schedule.simulation.adjustJob.expectedStartTimeRange') }}
          </div>
          <div class="section__content">
            <div class="expect-start-time__form">
              <div class="expect-start-time__form-label">
                {{ $t('schedule.simulation.adjustJob.startTime') }}
              </div>
              <div class="expect-start-time__form-desc">
                {{ jobInfo.jobStartTime }}
              </div>
              <svg-icon
                icon-class="go-right"
                class="expect-start-time__form-icon"
              />
              <el-date-picker
                :picker-options="pickerOptions"
                :clearable="false"
                :prefix-icon="null"
                :disabled="isViewMode"
                v-model="expectRuntime"
                :range-separator="$t('schedule.base.to')"
                :class="{
                  'is-starttime-mutated': isStartTimeMutated,
                  'is-endtime-mutated': isEndTimeMutated
                }"
                type="datetimerange"
                format="yyyy-MM-dd HH:mm"
                value-format="yyyy-MM-dd HH:mm"
                class="expect-start-time__form-datetime-picker"
              />
            </div>
          </div>
        </div>
        <!-- 工序機台指定 -->
        <div class="section">
          <div class="section__title">
            {{ $t('schedule.simulation.adjustJob.assignEquipmentToOperation') }}
          </div>
          <spinner v-if="isLoading" />
          <div
            v-else-if="operations !== null || operations.length > 0"
            class="section__content"
          >
            <operations
              :operations="operations"
              :is-view-mode="isViewMode"
              @change="onOperationChanged"
            />
          </div>
          <empty-info-block v-else />
        </div>
      </div>
      <div class="dialog-footer">
        <div class="dialog-button-block">
          <template v-if="isViewMode">
            <button
              class="btn btn-outline"
              @click="$emit('close')"
            >
              {{ $t('button.close') }}
            </button>
          </template>
          <template v-else>
            <button
              class="btn btn-outline"
              @click="$emit('close')"
            >
              {{ $t('button.cancel') }}
            </button>
            <button
              :disabled="!isAnythingAdjusted"
              class="btn btn-default"
              @click="saveJobAdjustment"
            >
              {{ $t('button.confirm') }}
            </button>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Operations from './Operations'
import { getJobInfo } from '@/schedule/API/Job'
import moment from 'moment'

export default {
  name: 'AdjustJobDialog',
  components: {
    Operations
  },
  props: {
    jobInfo: {
      type: Object,
      default: () => {},
      required: true
    },
    adjustedJobInfo: {
      type: [Object, null],
      default: () => {}
    },
    scheduleInfo: {
      type: Object,
      default: () => {},
      required: true
    },
    isViewMode: {
      type: Boolean,
      default: false
    }
  },
  data: () => {
    return {
      isLoading: true,
      operations: {},
      expectRuntime: []
    }
  },
  computed: {
    pickerOptions () {
      const vm = this
      return {
        disabledDate (time) {
          return time.getTime() > new Date(vm.scheduleEndDate).getTime() || time.getTime() < new Date(vm.scheduleStartDate).getTime()
        }
      }
    },
    scheduleStartDate () {
      return moment(this.scheduleInfo.scheduleStartDate).format('YYYY-MM-DD HH:mm')
    },
    scheduleEndDate () {
      return moment(this.scheduleInfo.scheduleStartDate).add(this.scheduleInfo.scheduleDays, 'days').format('YYYY-MM-DD HH:mm')
    },
    isStartTimeMutated () {
      return this.expectRuntime[0] && this.expectRuntime[0] !== this.scheduleStartDate
    },
    isEndTimeMutated () {
      return this.expectRuntime[1] && this.expectRuntime[1] !== this.scheduleEndDate
    },
    isTimeMutated () {
      return this.isStartTimeMutated || this.isEndTimeMutated
    },
    isAnythingAdjusted () {
      return this.isTimeMutated || Object.values(this.operations).some(item => item.frontendInfo.mutated)
    }
  },
  mounted () {
    this.initAdjustmentForm()
  },
  methods: {
    async initAdjustmentForm () {
      if (this.adjustedJobInfo) {
        this.expectRuntime = [
          // 若未做異動，會存 null，這邊要給定預設值
          this.adjustedJobInfo.expectRuntimeStart || this.scheduleStartDate,
          this.adjustedJobInfo.expectRuntimeEnd || this.scheduleEndDate
        ]
        this.operations = this.adjustedJobInfo.operations
      } else {
        // 給定預設值，為此次排程起始、結束時間
        this.expectRuntime = [this.scheduleStartDate, this.scheduleEndDate]
        this.setOperations(await this.getJobInfo())
      }
      this.isLoading = false
    },
    async getJobInfo () {
      const { operations } = await getJobInfo({ solutionId: this.scheduleInfo.solutionId, jobId: this.jobInfo.jobId })
      return operations.map(operation => ({
        ...operation,
        assignedEquipments: Array.isArray(operation.assignedEquipments) && operation.assignedEquipments.length > 0
          ? operation.assignedEquipments[0] // 目前都只會有一個，之後加上拆併單邏輯再調整為接收多個
          : null
      }))
    },
    setOperations (operations) {
      operations.forEach(operation => {
        if (!this.operations[operation.operationOrder]) {
          this.$set(this.operations, operation.operationOrder, {
            ...operation,
            frontendInfo: {
              selectedEquipment: operation.assignedEquipments,
              mutated: false
            }
          })
        }
      })
    },
    onOperationChanged ($event) {
      this.operations = $event
    },
    saveJobAdjustment () {
      this.$emit('confirm', {
        ...this.jobInfo,
        // 未異動預期工單起始範圍，給 null 以節省 DS 運算時間
        expectRuntimeStart: this.isTimeMutated ? this.expectRuntime[0] : null,
        expectRuntimeEnd: this.isTimeMutated ? this.expectRuntime[1] : null,
        operations: this.operations,
        lastEditedTimestamp: new Date().getTime()
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.adjust-job-dialog {
  .dialog-container {
    min-width: 874px;
    font-size: 14px;
  }
  .section {
    padding: 24px;
    background: rgba(50, 58, 58, 0.95);
    border-radius: 6px;
    & + .section {
      margin-top: 16px;
    }
    &__title {
      font-size: 18px;
      margin-bottom: 12px;
    }
    &__content {
      background: rgba(67, 76, 76, 0.95);
      border-radius: 8px;
      padding: 20px;

      ::v-deep .expect-start-time {
        &__form {
          display: flex;
          align-items: center;
          &-label, &-desc {
            white-space: nowrap;
          }
          &-desc {
            margin-left: 16px;
          }
          &-icon {
            flex: 0 0 40px;
            margin: 0 8px;
          };
          &-datetime-picker {
            width: 461px;
            border: none;
            border-radius: 0;
            font-size: 14px;
            padding-left: 0;
            padding-right: 20px;
            background-color: transparent;
            color: $theme-text-color;
            height: 40px;
            position: relative;
            &.is-starttime-mutated {
              &::before {
                @include mutated-dot(54px);
              }
            }
            &.is-endtime-mutated {
              &::after {
                @include mutated-dot(unset, 8px, 196px);
              }
            }

            .el-range-separator {
              color: #ffffff;
              font-size: 14px;
            }
            .el-range-input {
              width: 180px;
              background: transparent;
              padding: 0 !important;
              border-bottom: 1px solid #ffffff;
              border-radius: 0;
            }
          }
        }
      }
    }
  }
  .dialog-footer {
    margin-top: 16px;
  }
}
</style>

<template>
  <div class="job-id">
    <span
      v-if="jobState"
      :style="{ 'border-color': jobColorVar[jobState.toLowerCase()] }"
      class="legend"
    />
    {{ jobInfo.job }}
    <el-popover
      :disabled="!hasProgressInfo"
      placement="right"
      trigger="hover"
      popper-class="el-popover--stateful-jobid-popover"
    >
      <svg-icon
        v-if="hasProgressInfo"
        slot="reference"
        class="job-progress-info"
        icon-class="data-explanation"
      />
      <div>
        <div class="title">
          {{ jobInfo.job }}
        </div>
        <hr class="hr">
        <dl class="job-info">
          <dt class="job-info-title">
            {{ $t('schedule.rolling.operationCompletedCount') }}：
          </dt>
          <dd class="job-info-detail">
            {{ displayedCompletedQuantity }}
          </dd>
        </dl>
        <dl class="job-info">
          <dt class="job-info-title">
            {{ $t('schedule.base.operationName') }}：
          </dt>
          <dd class="job-info-detail">
            {{ displayedOperation }}
          </dd>
        </dl>
        <dl class="job-info">
          <dt class="job-info-title">
            {{ $t('schedule.base.operationOrder') }}：
          </dt>
          <dd class="job-info-detail">
            {{ displayedOperationOrder }}
          </dd>
        </dl>
        <dl class="job-info">
          <dt class="job-info-title">
            {{ $t('schedule.rolling.syncTime') }}：
          </dt>
          <dd class="job-info-detail">
            {{ displayedUpdateTime }}
          </dd>
        </dl>
      </div>
    </el-popover>
  </div>
</template>

<script>
import { JOB_STATUS } from '@/schedule/utils/enum'
import jobColorVar from '@/schedule/styles/common/_variables.scss'
import moment from 'moment'

export default {
  name: 'StatefulJobId',
  props: {
    jobInfo: {
      type: Object,
      default: () => {
        return {
          jobId: String,
          state: String
        }
      }
    }
  },
  data () {
    return {
      jobColorVar
    }
  },
  computed: {
    jobState () {
      if (this.jobInfo.delayed && !this.jobInfo.withinScheduleTime) return JOB_STATUS.OVERDUE_DELAY
      if (!this.jobInfo.withinScheduleTime) return JOB_STATUS.OVERDUE
      if (this.jobInfo.delayed) return JOB_STATUS.DELAY
      if (this.jobInfo.scheduled) return JOB_STATUS.SCHEDULED
      return null
    },
    displayedCompletedQuantity () {
      return this.hasProgressInfo ? this.jobInfo.progressInformation.completedQuantity : this.$t('schedule.rolling.noSyncRecordReminder')
    },
    displayedOperation () {
      return this.hasProgressInfo ? this.jobInfo.progressInformation.operation : this.$t('schedule.rolling.noSyncRecordReminder')
    },
    displayedOperationOrder () {
      return this.hasProgressInfo ? this.jobInfo.progressInformation.opOrder : this.$t('schedule.rolling.noSyncRecordReminder')
    },
    displayedUpdateTime () {
      return this.hasProgressInfo ? moment(this.jobInfo.progressInformation.updateTime).format(('YYYY-MM-DD HH:mm:ss')) : this.$t('schedule.rolling.noSyncRecord')
    },
    hasProgressInfo () {
      return !!this.jobInfo.progressInformation
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/schedule/styles/components/_job.scss';

.job-id {
  .legend {
    position: relative;
    font-size: 14px;
    padding-left: 12px;
    @include job-state-dot;
  }
}
.job-progress-info {
  cursor: pointer;
}
</style>

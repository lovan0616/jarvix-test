<template>
  <div class="jobs__filter">
    <!-- 工單狀態 -->
    <div class="filter__title">
      {{ $t('schedule.base.jobState') }}
    </div>
    <default-select
      v-model="selectedJobStatus"
      :options="innerJobStatesOptions"
      class="filter__job-status-selector"
      @input="searchJobData"
    />
    <!-- 工單交付日 -->
    <span class="filter__title"> {{ $t('schedule.simulation.jobsDueDate') }} </span>
    <default-date-picker
      v-model="period"
      :clearable="true"
      type="daterange"
      format="yyyy/MM/dd"
      value-format="yyyy/MM/dd"
      class="filter__date-picker"
    />
    <div class="search">
      <!-- 當前計畫頁面 使用 ticket filter 提供訂單 / 工單選項預覽，以及 fuzzy search 功能 -->
      <ticket-filter
        v-if="isCurrentSimulationPage"
        v-model="keyword"
        class="filter__search"
        @change="keyword = $event"
      />
      <!-- 其餘頁面（選擇工單、模擬結果頁面）使用一般 input -->
      <default-input
        v-else
        v-model="keyword"
        :placeholder="$t('schedule.simulation.searchJobs')"
        type="text"
        class="filter__search"
      >
        <i
          slot="prepend"
          class="el-icon-search filter__search--icon"
        />
      </default-input>
    </div>
    <default-button
      size="m"
      type="outline"
      @click="searchJobData"
    >
      {{ $t('schedule.button.send') }}
    </default-button>
  </div>
</template>

<script>
import TicketFilter from './TicketFilter'
import { JOB_STATUS } from '@/schedule/utils/enum'
import { snakeToCamel } from '@/schedule/utils/mixins'
import { mapState } from 'vuex'

export default {
  name: 'JobsFilter',
  components: {
    TicketFilter
  },
  props: {
    jobStatesOptions: {
      type: Array,
      default: () => Object.values(JOB_STATUS)
    }
  },
  data () {
    return {
      selectedJobStatus: null,
      period: [],
      keyword: ''
    }
  },
  computed: {
    ...mapState('scheduleSetting', ['globalJobStatusRestriction']),
    innerJobStatesOptions () {
      const all = { value: null, label: this.$t('schedule.simulation.allJobStatus') }
      const status = this.jobStatesOptions.map(status => ({
        value: status,
        label: this.$t(`schedule.rolling.${snakeToCamel(status)}`)
      }))
      return [all, ...status]
    },
    innerRestrictions () {
      const conditions = {
        scheduled: null,
        withinScheduleTime: null,
        delayed: null
      }
      switch (this.selectedJobStatus) {
        case JOB_STATUS.SCHEDULED:
          conditions.scheduled = true
          break
        case JOB_STATUS.OVERDUE:
          conditions.withinScheduleTime = false
          break
        case JOB_STATUS.DELAY:
          conditions.delayed = true
          break
        case JOB_STATUS.OVERDUE_DELAY:
          conditions.delayed = true
          conditions.withinScheduleTime = false
      }
      return {
        keyword: this.keyword,
        deadlineStartDate: this.period && this.period.length > 0 ? this.period[0] : null,
        deadlineEndDate: this.period && this.period.length > 0 ? this.period[1] : null,
        ...conditions
      }
    },
    isCurrentSimulationPage () {
      return this.$route.name === 'CurrentSimulation'
    }
  },
  watch: {
    globalJobStatusRestriction: {
      immediate: true,
      handler (jobStatus) {
        if (jobStatus) {
          this.selectedJobStatus = jobStatus.toUpperCase()
          // 還原狀態
          this.$store.commit('scheduleSetting/setGlobalJobStatusRestriction', null)
          this.searchJobData()
        }
      }
    }
  },
  methods: {
    searchJobData () {
      this.$emit('submit', this.innerRestrictions)
    },
    snakeToCamel
  }
}
</script>

<style lang="scss" scoped>
.jobs__filter {
  display: flex;
  align-items: center;
  .filter {
    &__title {
      font-size: 14px;
      line-height: 18px;
      margin-right: 8px
    }

    &__job-status-selector {
      width: 130px;
      padding-bottom: 0;
      margin-right: 16px;

      ::v-deep .el-input__inner {
        height: 32px;
        line-height: 32px;
      }
    }

    &__date-picker {
      margin-right: 17px;
      background: rgba(50, 58, 58, 0.95);
      border-radius: 6px;
      height: 32px;
      border-bottom: none;

      ::v-deep .el-date-editor--daterange {
        width: 100%;
        display: flex;
        align-items: baseline;
      }

      ::v-deep .el-range-separator {
        display: inline-block;
      }

      ::v-deep .el-range-input {
        width: 90px;

        &:last-of-type {
          margin-left: 5px;
        }
      }

      ::v-deep .el-range-separator {
        padding: 0;
        color: #C0C4CC;
      }
    }

    &__search {
      display: flex;
      padding: 0 6px;
      background: rgba(50, 58, 58, 0.95);
      border-radius: 6px;
      margin-right: 8px;

      ::v-deep .el-input__inner {
        border: 0;
      }

      &--icon {
        margin-right: 4px;
      }
    }
  }
}
</style>

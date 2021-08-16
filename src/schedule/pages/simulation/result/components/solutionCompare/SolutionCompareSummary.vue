<template>
  <div class="summary__wrapper">
    {{ $t('schedule.solutionCompare.withoutScheduleJobCount') }}：
    <spinner
      v-if="isLoading"
      size="16"
    />
    <div v-else>
      {{ $t('schedule.solutionCompare.beforeAdjust') }}<span class="highlight">{{ compareInfo.parentWithoutSchedule }}</span>
      {{ $t('schedule.solutionCompare.afterAdjust') }}<span class="highlight">{{ compareInfo.childWithoutSchedule }}</span>
    </div>
  </div>
</template>

<script>
import { getSolutionScheduleCompare } from '@/schedule/API/Simulation'

export default {
  name: 'SolutionCompareSummary',
  props: {
    solution: {
      type: Object,
      default: () => {},
      required: true
    }
  },
  data () {
    return {
      isLoading: false,
      compareInfo: {
        parentWithoutSchedule: 0,
        childWithoutSchedule: 0
      }
    }
  },
  mounted () {
    this.fetchCompareSummary()
  },
  methods: {
    fetchCompareSummary () {
      this.isLoading = true
      // 取得單母方案未達交工單數量
      const parentIncompleteJobCount = getSolutionScheduleCompare({
        compareeSolutionId: this.solution.parentSolutionId,
        compareeWithinScheduleTime: false,
        size: 1
      })
      // 取得單子方案未達交工單數量
      const childIncompleteJobCount = getSolutionScheduleCompare({
        compareeSolutionId: this.solution.solutionId,
        compareeWithinScheduleTime: false,
        size: 1
      })
      Promise.all([parentIncompleteJobCount, childIncompleteJobCount])
        .then(([{ pagination: parentPagination }, { pagination: childPagination }]) => {
          // 從頁碼資訊取得未達交工單總數
          this.compareInfo.parentWithoutSchedule = parentPagination.totalItems
          this.compareInfo.childWithoutSchedule = childPagination.totalItems
        })
        .catch(() => {})
        .finally(() => this.isLoading = false)
    }
  }
}
</script>

<style lang="scss" scoped>
.summary {
  &__wrapper {
    display: flex;
    font-size: 14px;
    margin-bottom: 8px;
  }
}
.highlight {
  color: $theme-color-warning;
  padding: 0 4px;
}
</style>

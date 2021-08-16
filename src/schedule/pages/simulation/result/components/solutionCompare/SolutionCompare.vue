<template>
  <div>
    <solution-compare-summary :solution="solution" />

    <!-- 調整後達交 -->
    <solution-compare-table
      :parent-solution-id="solution.parentSolutionId"
      :is-parent-on-schedule="false"
      :is-child-on-schedule="true"
      :child-solution-id="solution.solutionId"
      class="solution-compare-table"
      @view-more="viewMore"
    />

    <!-- 調整後不達交 -->
    <solution-compare-table
      :parent-solution-id="solution.parentSolutionId"
      :is-parent-on-schedule="true"
      :is-child-on-schedule="false"
      :child-solution-id="solution.solutionId"
      class="solution-compare-table"
      @view-more="viewMore"
    />

    <!-- 皆未達交 -->
    <solution-compare-table
      :parent-solution-id="solution.parentSolutionId"
      :is-parent-on-schedule="false"
      :is-child-on-schedule="false"
      :child-solution-id="solution.solutionId"
      class="solution-compare-table"
      @view-more="viewMore"
    />

    <!-- 完整顯示 -->
    <writing-dialog
      v-if="isShowDetailTable"
      class="detail-dialog"
      @closeDialog="isShowDetailTable = false"
    >
      <solution-compare-table
        :parent-solution-id="solution.parentSolutionId"
        :is-parent-on-schedule="isParentOnSchedule"
        :is-child-on-schedule="isChildOnSchedule"
        :child-solution-id="solution.solutionId"
        :is-show-pagination="true"
        class="solution-compare-table"
      />
    </writing-dialog>
  </div>
</template>

<script>
import SolutionCompareTable from './SolutionCompareTable'
import SolutionCompareSummary from './SolutionCompareSummary'
import WritingDialog from '@/components/dialog/WritingDialog'

export default {
  name: 'SolutionCompare',
  components: {
    SolutionCompareTable,
    SolutionCompareSummary,
    WritingDialog
  },
  props: {
    solution: {
      type: Object,
      default: () => {},
      required: true
    }
  },
  data () {
    return {
      isParentOnSchedule: false,
      isChildOnSchedule: false,
      isShowDetailTable: false
    }
  },
  methods: {
    viewMore ([isParentOnSchedule, isChildOnSchedule]) {
      this.isParentOnSchedule = isParentOnSchedule
      this.isChildOnSchedule = isChildOnSchedule
      this.isShowDetailTable = true
    }
  }
}
</script>

<style lang="scss" scoped>
::v-deep .solution-compare-table {
  td {
    border-bottom: none;
  }
}
::v-deep .detail-dialog {
  background: rgba(0, 0, 0, .9);
  .dialog-inner-box {
    background-color: transparent;
    width: 85%;
    padding: 0;
    .dialog-close {
      top: -32px;
      right: -32px;
    }
  }
  .dialog-select-flex {
    display: none;
  }
}

::v-deep .spinner-block {
  padding: 0;
}
</style>

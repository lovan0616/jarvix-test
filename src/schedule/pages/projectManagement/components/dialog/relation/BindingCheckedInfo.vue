<template>
  <div class="binding-checked-info">
    <svg-icon
      v-if="info"
      icon-class="alert-circle"
    />
    <span
      v-if="info && info.headerErrorMessage"
      class="binding-checked-info__msg"
    >
      {{ info.headerErrorMessage }}
    </span>
    <span
      v-else-if="failedRowCount > 0"
      class="binding-checked-info__msg"
      @click="isShowInfoDialog = true"
    >
      <i18n path="schedule.binding.failedRowCount">
        {{ failedRowCount }}
      </i18n>
    </span>
    <writing-dialog
      v-if="isShowInfoDialog"
      :title="$t('schedule.binding.failedRow')"
      :button="$t('schedule.binding.bind')"
      show-both
      @closeDialog="isShowInfoDialog = false"
      @confirmBtn="isShowConfirmDialog = true"
    >
      <p class="summary">
        <i18n path="schedule.binding.checkedResultSummary">
          <span class="highlight">{{ info.totalRowCount }}</span>
          <span class="highlight">{{ info.applicableRowCount }}</span>
          <span class="highlight">{{ failedRowCount }}</span>
        </i18n>
      </p>
      <p class="reminder">
        {{ $t('schedule.binding.bindingReminding') }}
      </p>
      <ul class="info-list">
        <li
          v-for="column in failedColumns"
          :key="column.displayName"
          class="info-list__item"
        >
          <b class="column-name">{{ $t('schedule.binding.columnName') }}：{{ column.displayName }}</b>

          <div
            v-if="column.emptyRowIndexes.length > 0"
            class="error-info"
          >
            <div><b>{{ $t('schedule.binding.failedBecauseOfEmpty') }}</b>（{{ $t('schedule.binding.failedBecauseOfEmptyDesc') }}）</div>
            <i18n path="schedule.binding.failedRowCount">
              <span class="highlight">{{ column.emptyRowIndexes.length }}</span>
            </i18n>
          </div>
          <div
            v-if="column.refErrorValueCounts && column.refErrorValueCounts.length > 0"
            class="error-info"
          >
            <div><b>{{ $t('schedule.binding.failedBecauseOfRef') }}</b>（{{ $t('schedule.binding.failedBecauseOfRefDesc') }}）</div>
            <span class="highlight">{{ concatedValues(parseRefErrorValues(column.refErrorValueCounts)) }}</span>
          </div>
          <div
            v-if="column.typeErrorRowIndexes.length > 0"
            class="error-info"
          >
            <div><b>{{ $t('schedule.binding.failedBecauseOfType') }}</b>（{{ $t('schedule.binding.failedBecauseOfTypeDesc') }}）</div>
            <i18n path="schedule.binding.failedRowCount">
              <span class="highlight">{{ column.typeErrorRowIndexes.length }}</span>
            </i18n>
          </div>
        </li>
      </ul>
    </writing-dialog>
    <decide-dialog
      v-show="isShowConfirmDialog"
      :title="$t('schedule.binding.bindingReminding')"
      :btn-text="$t('schedule.binding.confirmToBind')"
      type="confirm"
      @confirmBtn="confirmBind"
      @closeDialog="isShowConfirmDialog = false"
    />
  </div>
</template>

<script>
import WritingDialog from '@/components/dialog/WritingDialog'
import DecideDialog from '@/components/dialog/DecideDialog'
import { mapState } from 'vuex'

export default {
  name: 'BindingCheckedInfo',
  components: {
    WritingDialog,
    DecideDialog
  },
  props: {
    info: {
      type: Object,
      default: () => {},
      required: true
    }
  },
  data: () => {
    return {
      isShowInfoDialog: false,
      isShowConfirmDialog: false
    }
  },
  computed: {
    ...mapState('scheduleSetting', ['refErrorResultSizeLimit']),
    failedRowCount () {
      return this.info.notApplicableRowCount
    },
    failedColumns () {
      return this.info.notApplicableRowCount > 0
        ? this.info.columns.filter(column => column.emptyRowIndexes.length > 0 || column.typeErrorRowIndexes.length > 0 || (column.refErrorValueCounts && column.refErrorValueCounts.length > 0))
        : []
    }
  },
  methods: {
    parseRefErrorValues (refErrorValues) {
      // 後端會將 refErrorValues 去重複並由大到小排序
      return {
        values: refErrorValues.filter(item => item.value !== null).reduce((acc, cur) => acc.concat(cur.value), []),
        exceedMaxShowAmount: refErrorValues.length >= this.refErrorResultSizeLimit
      }
    },
    concatedValues ({ values, exceedMaxShowAmount }) {
      return exceedMaxShowAmount ? values.join(', ').concat('...') : values.join(', ')
    },
    confirmBind () {
      this.$emit('bind')
      this.isShowConfirmDialog = false
      this.isShowInfoDialog = false
    }
  }
}
</script>

<style lang="scss" scoped>
.binding-checked-info {
  cursor: pointer;
  color: $theme-color-danger;
  ::v-deep .dialog-box .dialog-inner-box {
    text-align: left;
    .reminder {
      line-height: 1.8;
      font-size: 14px;
    }
    .info-list {
      overflow: auto;
      margin: 0 0 16px 0;
      padding: 0;
      line-height: 2;
      &__item {
        &:not(:last-child) {
          margin-bottom: 24px;
        }
        .column-name {
          display: flex;
          align-items: center;
          margin-bottom: 8px;
          &::before {
            content: '';
            width: 6px;
            height: 6px;
            border-radius: 50%;
            background-color: #fff;
            margin-right: 8px;
          }
        }
        .error-info {
          padding: 10px 16px;
          background-color: rgba(0, 0, 0, 0.55);
          border-radius: 8px;
          max-height: 200px;
          overflow: auto;
          & + .error-info {
            margin-top: 12px;
          }
        }
      }
    }
  }
}
.highlight {
  color: $theme-color-warning;
}
</style>

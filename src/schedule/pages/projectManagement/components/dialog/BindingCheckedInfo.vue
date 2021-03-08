<template>
  <div class="binding-checked-info">
    <svg-icon 
      v-if="info" 
      icon-class="alert-circle"/>
    <span 
      v-if="info && info.headerErrorMessage" 
      class="binding-checked-info__msg">
      {{ info.headerErrorMessage }}
    </span>
    <span 
      v-else-if="failedRowCount > 0" 
      class="binding-checked-info__msg"
      @click="isShowInfoDialog = true"
    >
      {{ $t('schedule.binding.failedRowCountOfDataFrame', { count: failedRowCount }) }}
    </span>
    <writing-dialog
      v-if="isShowInfoDialog"
      :title="`${$t('schedule.binding.failedRow')}(${failedRowCount})`"
      :button="$t('schedule.binding.bind')"
      show-both
      @closeDialog="isShowInfoDialog = false"
      @confirmBtn="isShowConfirmDialog = true"
    >
      <p class="reminder">{{ $t('schedule.binding.bindingReminding') }}</p>
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
            <i18n path="schedule.binding.failedRowCountOfColumn">
              <span class="highlight">{{ column.emptyRowIndexes.length }}</span>
            </i18n>
          </div>
          <div
            v-if="column.refErrorRows.length > 0"
            class="error-info"
          >
            <div><b>{{ $t('schedule.binding.failedBecauseOfRef') }}</b>（{{ $t('schedule.binding.failedBecauseOfRefDesc') }}）</div>
            <span class="highlight">{{ concatedValues(parseRefErrorRows(column.refErrorRows)) }}</span>
          </div>
          <div
            v-if="column.typeErrorRowIndexes.length > 0"
            class="error-info"
          >
            <div><b>{{ $t('schedule.binding.failedBecauseOfType') }}</b>（{{ $t('schedule.binding.failedBecauseOfTypeDesc') }}）</div>
            <i18n path="schedule.binding.failedRowCountOfColumn">
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

export default {
  name: 'BindingCheckedInfo',
  components: {
    WritingDialog,
    DecideDialog
  },
  props: {
    info: {
      type: Object,
      default: () => {
        return {
          available: 0,
          columns: [
            {
              displayName: '',
              emptyRowIndexes: [],
              internalName: '',
              refErrorRows: [],
              typeErrorRowIndexes: []
            }
          ],
          headerErrorMessage: '',
          notApplicableRowIndexes: [],
          rows: 0
        }
      },
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
    failedRowCount () {
      return this.info.hasOwnProperty('notApplicableRowIndexes')
        ? this.info.notApplicableRowIndexes.length
        : 0
    },
    failedColumns () {
      return this.info.hasOwnProperty('notApplicableRowIndexes')
        ? this.info.columns.filter(column => column.emptyRowIndexes.length > 0 || column.typeErrorRowIndexes.length > 0 || column.refErrorRows.length > 0)
        : []
    }
  },
  methods: {
    parseRefErrorRows (refErrorRows) {
      // 使用 Set 除去重複值
      const valueSet = new Set(refErrorRows.reduce((acc, cur) => acc.concat(cur.value), []))
      // 畫面上最多顯示幾筆
      const maxShowAmount = 10000
      const exceedMaxShowAmount = valueSet.size > maxShowAmount
      return {
        values: exceedMaxShowAmount ? [ ...valueSet ].slice(0, maxShowAmount) : [ ...valueSet ],
        exceedMaxShowAmount
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
  /deep/ .dialog-box .dialog-inner-box {
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
          .highlight {
            color: $theme-color-warning;
          }
        }
      }
    }
  }
}
</style>
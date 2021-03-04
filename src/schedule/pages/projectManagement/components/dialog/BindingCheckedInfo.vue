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
      {{ $t('schedule.binding.failedRowCount', { count: failedRowCount }) }}
    </span>
    <writing-dialog
      v-if="isShowInfoDialog"
      :title="`${$t('schedule.binding.failedRow')}(${failedRowCount})`"
      :button="$t('schedule.binding.bind')"
      show-both
      @closeDialog="isShowInfoDialog = false"
      @confirmBtn="confirmBind"
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
            {{ $t('schedule.binding.datumIndexes') }}：<span class="highlight">{{ concatedValues(column.emptyRowIndexes) }}</span>
          </div>
          <div
            v-if="column.refErrorRows.length > 0"
            class="error-info"
          >
            <div><b>{{ $t('schedule.binding.failedBecauseOfRef') }}</b>（{{ $t('schedule.binding.failedBecauseOfRefDesc') }}）</div>
            <span class="highlight">{{ concatedValues(flattedValue(column.refErrorRows)) }}</span>
          </div>
          <div
            v-if="column.typeErrorRowIndexes.length > 0"
            class="error-info"
          >
            <div><b>{{ $t('schedule.binding.failedBecauseOfType') }}</b>（{{ $t('schedule.binding.failedBecauseOfTypeDesc') }}）</div>
            {{ $t('schedule.binding.datumIndexes') }}：<span class="highlight">{{ concatedValues(column.typeErrorRowIndexes) }}</span>
          </div>
        </li>
      </ul>
    </writing-dialog>
  </div>
</template>

<script>
import WritingDialog from '@/components/dialog/WritingDialog'

export default {
  name: 'BindingCheckedInfo',
  components: {
    WritingDialog
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
      isShowInfoDialog: false
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
    flattedValue (refErrorRows) {
      return refErrorRows.reduce((acc, cur) => acc.concat(cur.value), [])
    },
    concatedValues (values) {
      const maxShowAmount = 10000 // 畫面上最多顯示幾筆
      return values.length > maxShowAmount
        ? values.slice(0, maxShowAmount).join(', ').concat('...')
        : values.join(', ')
      
    },
    confirmBind () {
      this.$emit('bind')
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
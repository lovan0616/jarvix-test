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
      {{ failedRowCount }}筆資料發生錯誤
    </span>
    <writing-dialog
      v-if="isShowInfoDialog"
      :show-both="false"
      button="知悉"
      @closeDialog="isShowInfoDialog = false"
      @confirmBtn="isShowInfoDialog = false"
    >
      <ul class="info-list">
        <li
          v-for="column in failedColumns"
          :key="column.displayName"
          class="info-list__item"
        >
          <div>欄位名稱:{{ column.displayName }}</div>

          <div v-if="column.emptyRowIndexes.length > 0">
            <div>Empty錯誤</div>
            出現Empty錯誤列位置:{{ column.emptyRowIndexes.join(',') }}
          </div>
          <div v-if="column.typeErrorRowIndexes.length > 0">
            <div>Type錯誤</div>
            出現Type錯誤列位置:{{ column.typeErrorRowIndexes.join(',') }}
          </div>
          <div v-if="column.refErrorRows.length > 0">
            <div>Reference錯誤</div>
            出現Reference位置
            <ul>
              <li
                v-for="(row, index) in column.refErrorRowIndexes"
                :key="index"
              >{{ row }}</li>
            </ul>
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
  }
}
</script>

<style lang="scss" scoped>
.binding-checked-info {
  cursor: pointer;
  color: $theme-color-danger;
  /deep/ .dialog-box .dialog-inner-box {
    text-align: left;
    .info-list {
      max-height: 65vh;
      overflow: auto;
    }
  }
}
</style>
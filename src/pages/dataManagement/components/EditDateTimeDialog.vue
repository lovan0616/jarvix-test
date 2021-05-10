<template>
  <div class="main-date-dialog full-page-dialog">
    <div class="dialog-container">
      <div class="dialog-title">
        {{ $t('editing.mainDateTimeColumnSetting') }}
        <a 
          href="javascript:void(0)" 
          class="close-btn"
          @click="closeDialog"
        ><svg-icon icon-class="close"/></a>
      </div>
      <div class="dialog-header-block">
        <div class="data-frame-name">
          {{ $t('editing.dataFrame') }}：{{ dataFrameInfo.primaryAlias }}
        </div>
        <div class="button-block">
          <button
            v-if="hasColumn"
            :disabled="isSaving"
            type="button"
            class="btn btn-default"
            @click="setMainDateTime"
          >{{ $t('button.save') }}</button>
        </div>
      </div>
      <spinner 
        v-if="isLoading"
        :title="$t('editing.loading')"
        class="spinner-container"
        size="50"
      />
      <div 
        v-else-if="!isLoading && hasColumn"
        class="dialog-content-block"
      >
        <div
          v-for="(column, index) in columnList"
          :key="column.dataColumnId"
          class="input-radio-group"
        >
          <input
            :id="column.dataColumnName"
            :value="column.dataColumnName"
            :checked="column.dataColumnId === selectedColumn.dataColumnId"
            class="input-radio"
            type="radio"
            name="mainDate"
            @change="updateSelect(index)"
          >
          <label
            :for="column.dataColumnName"
            class="input-radio-label"
          >
            {{ `${column.dataColumnPrimaryAlias}` }}
          </label>
        </div>
      </div>
      <empty-info-block
        v-else
        :msg="$t('editing.emptyDateTime')"
        class="empty-info-block"
      />
    </div>
  </div>
</template>
<script>
import { getDateTimeColumns, setMainDateTimeColumn } from '@/API/DataSource'
import EmptyInfoBlock from '@/components/EmptyInfoBlock'
// import { getValueAlias, saveValueAlias } from '@/API/Alias'
// import { getSelfInfo } from '@/API/User'
import { Message } from 'element-ui'
import DataInputVerify from './DataInputVerify'

export default {
  name: 'EditDateTimeDialog',
  inject: ['$validator'],
  components: {
    DataInputVerify,
    EmptyInfoBlock
  },
  props: {
    dataFrameInfo: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      isLoading: true,
      isSaving: false,
      columnList: [],
      selectedColumn: null
    }
  },
  computed: {
    hasColumn () {
      return this.columnList.length > 0
    }
  },
  mounted () {
    this.getDateTimeColumns()
  },
  methods: {
    getDateTimeColumns () {
      const dataFrameId = this.dataFrameInfo.id
      getDateTimeColumns(dataFrameId).then(response => {
        this.columnList = response
        this.selectedColumn = response.find(column => column.isDefault)
      }).finally(() => {
        this.isLoading = false
      })
    },
    setMainDateTime () {
      this.isSaving = true
      const {dataColumnName, dataColumnPrimaryAlias} = this.selectedColumn
      setMainDateTimeColumn(this.dataFrameInfo.id, { dataColumnName, dataColumnPrimaryAlias })
        .then(() => {
          Message({
            message: this.$t('message.saveSuccess'),
            type: 'success',
            duration: 3 * 1000,
            showClose: true
          })
          this.closeDialog()
        })
        .catch(() => { this.isSaving = false })
    },
    closeDialog () {
      this.$emit('close')
    },
    updateSelect (index) {
      this.selectedColumn = this.columnList[index]
    }
  }
}
</script>
<style lang="scss" scoped>
.main-date-dialog {
  .dialog-title {
    position: relative;

    .close-btn {
      position: absolute;
      top: 0;
      right: 0;
      color: #fff;
      font-size: 14px;
    }
  }

  .dialog-header-block {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 12px;

    .data-frame-name {
      font-size: 14px;
      @include text-hidden
    }
  }
  .dialog-content-block {
    max-height: 70vh;

    .input-radio-group {
      display: block;
      background-color: rgba(50, 58, 58, 0.95);
      padding: 24px;
      border-radius: 5px;
      margin-right: 0;

      &:not(:last-of-type) {
        margin-bottom: 12px;
      }
    }
  }
}
</style>

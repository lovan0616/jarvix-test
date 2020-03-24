<template>
  <div class="main-date-dialog full-page-dialog">
    <div class="dialog-container">
      <div class="dialog-title">
        {{ $t('editing.mainDateTimeColumnSetting') }}
        <a href="javascript:void(0)" class="close-btn"
          @click="closeDialog"
        ><svg-icon icon-class="close"></svg-icon></a>
      </div>
      <div class="dialog-header-block">
        <div class="data-frame-name">
          {{ $t('editing.dataFrame') }}：{{ dataFrameInfo.primaryAlias }}
        </div>
        <div class="button-block">
          <button
            type="button"
            class="btn btn-default"
            :disabled="isSaving"
            @click="setMainDateTime"
          >{{ $t('button.save') }}</button>
        </div>
      </div>
      <spinner class="spinner-container"
        v-if="isLoading"
        :title="$t('editing.loading')"
        size="50"
      ></spinner>
      <div class="dialog-content-block"
        v-else
      >
        <div
          class="input-radio-group"
          v-for="(column, index) in columnList"
          :key="column.dataColumnId"
        >
          <input
            class="input-radio"
            type="radio"
            name="mainDate"
            :id="column.dataColumnName"
            :value="column.dataColumnName"
            :checked="column.dataColumnId === selectedColumn.dataColumnId"
            @change="updateSelect(index)"
          >
          <label
            class="input-radio-label"
            :for="column.dataColumnName"
          >
            {{column.dataColumnName}}
          </label>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { getDateTimeColumns, setMainDateTimeColumn } from '@/API/DataSource'
// import { getValueAlias, saveValueAlias } from '@/API/Alias'
// import { getSelfInfo } from '@/API/User'
import { Message } from 'element-ui'
import DataInputVerify from './DataInputVerify'

export default {
  name: 'EditDateTimeDialog',
  inject: ['$validator'],
  components: {
    DataInputVerify
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
  mounted () {
    this.getDateTimeColumns()
  },
  methods: {
    getDateTimeColumns () {
      const dataFrameId = this.dataFrameInfo.id
      getDateTimeColumns(dataFrameId).then(response => {
        this.columnList = response
        this.selectedColumn = response.find(column => column.isDefault)
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
            duration: 3 * 1000
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
    }
  }
  .dialog-content-block {
    max-height: 70vh;

    .input-radio-group {
      display: block;
      background-color: rgba(50, 58, 58, 0.95);
      padding: 24px;
      border-radius: 5px;

      &:not(:last-of-type) {
        margin-bottom: 12px;
      }

      .input-radio {
        position: absolute;
        left: -999999px;
        top: -99999px;

        &:checked + label:before,
        &:not(:checked) + label:before {
          content: '';
          position: absolute;
          top: 50%;
          left: 0;
          transform: translateY(-50%);
          width: 16px;
          height: 16px;
          border: 1px solid #fff;
          border-radius: 100%;
          background-color: transparent;
        }

        &:checked + label:after,
        &:not(:checked) + label:after {
          content: '';
          position: absolute;
          top: 50%;
          left: 5px;
          transform: translateY(-50%);
          width: 8px;
          height: 8px;
          border-radius: 100%;
          background-color: #1EB8C7;
          transition: all 0.2s ease;
        }

        &:not(:checked) + label:after {
          opacity: 0;
        }

        &:checked + label:after {
          opacity: 1;
        }
      }

      .input-radio-label {
        position: relative;
        padding-left: 28px;
      }
    }
  }
}
</style>

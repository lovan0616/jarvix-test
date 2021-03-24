<template>
  <div class="content-setting-dialog">
    <div class="dialog-title">{{ $t('editing.newData') }}</div>
    <upload-process-block
      :step="1"
    />
    <div class="dialog-body">
      <div 
        class="setting-block">
        <div class="setting-block__title">
          {{ $t('editing.sourceOfData') }}
        </div>
        <default-select 
          v-validate="'required'"
          :option-list="dataSourceOptionList"
          :placeholder="$t('miniApp.chooseDataSource')"
          :is-disabled="isLoading"
          v-model="sourceDataSourceId"
          filterable
          class="setting-block__select"
          name="dataframeId"
          @change="fetchDataColumnList"
        />
        <default-select 
          v-validate="'required'"
          :option-list="dataFrameOptionList"
          :placeholder="$t('miniApp.chooseDataFrame')"
          :is-disabled="!sourceDataSourceId"
          v-model="sourceDataframeId"
          filterable
          class="setting-block__select"
          name="dataframeId"
          @change="fetchDataColumnList"
        />
        <!-- <div class="setting-block__warning">
          <svg-icon icon-class="data-explanation" />
          {{ $t('model.upload.argsReminder', {mainScriptName}) }}
        </div> -->
      </div>
    </div>
    <div class="dialog-footer">
      <div class="dialog-button-block">
        <button 
          class="btn btn-outline"
          @click="cancel"
        >{{ $t('button.cancel') }}</button>
        <button 
          class="btn btn-default"
          @click="next"
        >
          {{ $t('button.nextStep') }}
        </button>
      </div>
    </div>
  </div>
</template>
<script>

import UploadProcessBlock from './components/UploadProcessBlock'
import DefaultSelect from '@/components/select/DefaultSelect'
import { getDataSourceList, getDataFrameById } from '@/API/DataSource'
import { statsTypeOptionList } from '@/utils/general'
import { mapState, mapMutations } from 'vuex'
import { v4 as uuidv4 } from 'uuid'


export default {
  name: 'ContentSetting',
  inject: ['$validator'],
  components: {
    UploadProcessBlock,
    DefaultSelect
  },
  data () {
    return {
      isLoading: false,
      statsTypeOptionList,
      dataSourceOptionList: [],
      dataFrameOptionList: [],
      columnList: [],
      modelId: null,
      sourceDataSourceId: null,
      sourceDataframeId: null,
      targetDataframeName: null
    }
  },
  computed: {
    ...mapState('modelManagement', ['currentUploadModelInfo'])
  },
  mounted () {
    this.fetchData()
  },
  methods: {
    ...mapMutations('modelManagement', ['updateCurrentUploadModelInfo', 'updateShowCreateModelDialog']),
    fetchData () {
      getDataSourceList().then(response => {
        console.log('dks')
      })

      // 清空原資料
      // this.columnList = []
      // this.addNewColumnCard()
    },
    addNewColumnCard () {
      this.columnList.push({
        statsType: null,
        modelColumnName: null,
        id: uuidv4()
      })
    },
    updateDataColumn(statesType, selectedColumnCardId) {
      const columnCard = this.columnList.find(columnCard => columnCard.id === selectedColumnCardId)
      columnCard.statsType = statesType
    },
    removeColumnCard(cardId) {
      this.columnList = this.columnList.filter(columnCard => columnCard.id !== cardId)
    },
    cancel () {
      this.updateShowCreateModelDialog(false)
    },
    next () {
      this.$validator.validateAll().then(isValidate => {
        if (!isValidate) return
        this.updateCurrentUploadModelInfo({
          ...this.currentUploadModelInfo,
          ioArgs: {
            input: this.columnList.map(({ modelColumnName, statsType }) => ({ modelColumnName, statsType }))
          }
        })
        this.$emit('next')
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.content-setting-dialog {
  .dialog-title {
    margin-bottom: 16px;
  }

  .setting-block {
    background: rgba(50, 58, 58, 0.95);
    border-radius: 5px;
    padding: 24px;
    &:not(:last-of-type) {
      margin-bottom: 16px;
    }

    &__title {
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-weight: 600;
      font-size: 18px;
      margin-bottom: 16px;
    }

    &__warning {
      margin-bottom: 8px;
      font-size: 13px;
      font-weight: normal;
      color: var(--color-warning);
    }

    &__select {
      &:not(:first-child) {
        margin-left: 16px;
      }
    }

    /deep/ .el-input__inner {
      padding-left: 0;
      border-bottom: 1px solid #FFFFFF;
    }

    /deep/ .el-input {
      &.is-disabled {
        .el-input__inner {
          color: #AAAAAA;
          border-bottom: 1px solid #AAAAAA;
        }

        &::placeholder { 
          font-size: 14px;
          color: #AAAAAA;
        }
      } 
    }

    /deep/ .input-field {
      &__label {
        font-size: 14px;
        color: #CCCCCC;
      }

      .el-input__inner {
        &::placeholder { 
          font-size: 14px;
        }
      }
    }
  }
}
</style>

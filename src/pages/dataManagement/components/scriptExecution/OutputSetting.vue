<template>
  <div class="input-setting-dialog">
    <div class="dialog-title">{{ $t('editing.newData') }}</div>
    <upload-process-block
      :step="3"
      :process-text="processText"
    />
    <div class="dialog-body">
      <div class="setting-block">
        <div class="setting-block__title">
          {{ $t('script.selectOutputColumn') }}
          <div class="setting-block__reminder">
            {{ "*" + $t('script.scriptColumnReminder') }}
          </div>
        </div>
        <output-column-setting-card
          v-for="column in columnList"
          :column-info="column"
          :data-type-option-list="dataTypeOptionList"
          :column-list="columnList"
          :key="column.id"
          :is-processing="isProcessing"
          @updateDataColumn="updateDataColumn($event, column.id)"
          @remove="removeColumnCard"
        />
        <button
          class="btn btn-m btn-outline"
          @click="addNewColumnCard()"
        >
          <svg-icon 
            icon-class="plus" 
            class="icon" />{{ $t('button.add') }}
        </button>
      </div>
    </div>
    <div class="dialog-footer">
      <div class="dialog-button-block">
        <button 
          :disabled="isProcessing"
          class="btn btn-outline"
          @click="cancel"
        >{{ $t('button.cancel') }}</button>
        <button 
          :disabled="isProcessing"
          class="btn btn-default"
          @click="buildData"
        >
          <span v-if="isProcessing">
            <svg-icon 
              v-if="isProcessing" 
              icon-class="spinner"/>
            {{ $t('button.processing') }}
          </span>
          <span v-else>{{ $t('button.buildData') }}</span>
        </button>
      </div>
    </div>
  </div>
</template>
<script>
import { mapState, mapMutations } from 'vuex'
import UploadProcessBlock from './fileUpload/UploadProcessBlock'
import DefaultSelect from '@/components/select/DefaultSelect'
import SingleColumnCard from '@/components/card/SingleColumnCard'
import OutputColumnSettingCard from './OutputColumnSettingCard'
import { v4 as uuidv4 } from 'uuid'
import { scriptInit } from '@/API/Script'

export default {
  name: 'OutputSetting',
  inject: ['$validator'],
  components: {
    UploadProcessBlock,
    DefaultSelect,
    SingleColumnCard,
    OutputColumnSettingCard
  },
  props: {
    processText: {
      type: Array,
      required: true
    }
  },
  data () {
    return {
      columnList: [],
      isProcessing: false
    }
  },
  computed: {
    ...mapState('dataManagement', ['currentUploadScriptInfo']),
    dataTypeOptionList () {
      const acceptedDataTypeList = ['FLOAT', 'STRING', 'INT', 'DATETIME', 'BOOLEAN']
      return acceptedDataTypeList.map(type => ({
        name: type,
        value: type
      }))
    }
  },
  mounted () {
    // 預先新增一個欄位選擇器
    this.addNewColumnCard()
  },
  methods: {
    ...mapMutations('dataManagement', ['updateCurrentUploadScriptInfo']),
    addNewColumnCard () {
      this.columnList.push({
        primaryAlias: null,
        dataColumnId: null,
        dataType: null,
        id: uuidv4()
      })
    },
    updateDataColumn(columnId, selectedColumnCardId) {
      const columnCard = this.columnList.find(columnCard => columnCard.id === selectedColumnCardId)
      const dataColumnInfo = this.dataColumnOptionList.find(column => column.id === columnId)
      columnCard.dataType = dataColumnInfo.dataType
    },
    removeColumnCard(cardId) {
      this.columnList = this.columnList.filter(columnCard => columnCard.id !== cardId)
    },
    cancel () {
      this.$store.commit('dataManagement/updateShowCreateDataSourceDialog', false)
    },
    buildData () {
      this.$validator.validateAll().then(isValidate => {
        if (!isValidate) return
        this.isProcessing = true
        scriptInit({
          ...this.currentUploadScriptInfo,
          ioArgs: {
            ...this.currentUploadScriptInfo.ioArgs,
            output: this.columnList
          },
          type: "ROW_BASED"
        })
        .then(() => {
          // 為了觸發重新撈取資料
          this.$store.commit('dataManagement/updateFileUploadSuccess', true)
          this.$store.commit('dataManagement/updateShowCreateDataSourceDialog', false)
        })
        .catch(() => { this.isProcessing = false })
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.input-setting-dialog {
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

    &__reminder {
      font-size: 12px;
      font-weight: normal;
    }

    /deep/ .el-input__inner {
      padding-left: 0;
      border-bottom: 1px solid #FFFFFF;
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

<template>
  <div class="input-setting-dialog">
    <div class="dialog-title">{{ $t('editing.newData') }}</div>
    <upload-process-block
      :step="4"
    />
    <div class="dialog-body">
      <div class="setting-block">
        <div class="setting-block__title">
          {{ $t('model.upload.outputArgsSetting') }}
          <div class="setting-block__reminder">
            {{ "*" + $t('model.upload.columnReminder') }}
          </div>
        </div>
        <draggable
          v-model="columnList">
          <model-column-setting-card
            v-for="column in columnList"
            :column-info="column"
            :data-type-option-list="statsTypeOptionList"
            :column-list="columnList"
            :key="column.id"
            :is-processing="isProcessing"
            @updateDataColumn="updateDataColumn($event, column.id)"
            @remove="removeColumnCard"
          />
        </draggable> 
        <button
          :disabled="isProcessing"
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
import ModelColumnSettingCard from './components/ModelColumnSettingCard'
import draggable from 'vuedraggable'
import { v4 as uuidv4 } from 'uuid'
import { createModel } from '@/API/Model'
import { statsTypeOptionList } from '@/utils/general'
import { Message } from 'element-ui'

export default {
  name: 'OutputSetting',
  inject: ['$validator'],
  components: {
    UploadProcessBlock,
    DefaultSelect,
    ModelColumnSettingCard,
    draggable
  },
  data () {
    return {
      columnList: [],
      isProcessing: false,
      statsTypeOptionList
    }
  },
  computed: {
    ...mapState('modelManagement', ['currentUploadModelInfo']),
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
    ...mapMutations('modelManagement', ['updateCurrentUploadModelInfo', 'updateShowCreateModelDialog']),
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
    buildData () {
      this.$validator.validateAll().then(isValidate => {
        if (!isValidate) return

        // 檢查欄位名稱是否重複
        const modelColumnNameSet = this.columnList.reduce((acc, cur) => acc.add(cur.modelColumnName), new Set())
        if (modelColumnNameSet.size < this.columnList.length) {
          return Message({
            message: this.$t('model.paramNameDuplicated'),
            type: 'warning',
            duration: 3 * 1000,
            showClose: true
          })
        }

        this.isProcessing = true
        createModel({
          ...this.currentUploadModelInfo,
          ioArgs: {
            ...this.currentUploadModelInfo.ioArgs,
            output: this.columnList.map(({ modelColumnName, statsType }) => ({ modelColumnName, statsType }))
          }
        })
        .then(() => {
          // 為了觸發重新撈取資料
          this.$store.commit('modelManagement/updateModelUploadSuccess', true)
          this.updateShowCreateModelDialog(false)
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

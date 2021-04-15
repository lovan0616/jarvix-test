<template>
  <div class="input-setting-dialog">
    <div class="dialog-title">{{ $t('editing.newData') }}</div>
    <upload-process-block
      :step="3"
    />
    <div class="dialog-body">
      <div 
        class="setting-block">
        <div class="setting-block__title">
          {{ $t('model.upload.inputArgsSetting') }}
          <div class="setting-block__reminder">
            {{ "*" + $t('model.upload.columnReminder') }}
          </div>
        </div>
        <div class="setting-block__warning">
          <svg-icon icon-class="data-explanation" />
          {{ $t('model.upload.argsReminder', {mainScriptName}) }}
        </div>
        <draggable
          v-model="columnList">
          <model-column-setting-card
            v-for="column in columnList"
            :column-info="column"
            :data-type-option-list="statsTypeOptionList"
            :column-list="columnList"
            :key="column.id"
            @updateDataColumn="updateDataColumn($event, column.id)"
            @remove="removeColumnCard"
          />
        </draggable> 
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
import { mapState, mapMutations } from 'vuex'
import UploadProcessBlock from './fileUpload/UploadProcessBlock'
import DefaultSelect from '@/components/select/DefaultSelect'
import ModelColumnSettingCard from './components/ModelColumnSettingCard'
import draggable from 'vuedraggable'
import { v4 as uuidv4 } from 'uuid'
import { statsTypeOptionList } from '@/utils/general'
import { Message } from 'element-ui'

export default {
  name: 'InputSetting',
  inject: ['$validator'],
  components: {
    UploadProcessBlock,
    DefaultSelect,
    ModelColumnSettingCard,
    draggable
  },
  data () {
    return {
      statsTypeOptionList,
      columnList: [],
      mainScriptName: 'main.py'
    }
  },
  computed: {
    ...mapState('modelManagement', ['currentUploadModelInfo'])
  },
  mounted () {
    this.fetchDataFrameList()
  },
  methods: {
    ...mapMutations('modelManagement', ['updateCurrentUploadModelInfo', 'updateShowCreateModelDialog']),
    fetchDataFrameList () {
      // 清空原資料
      this.columnList = []
      this.addNewColumnCard()
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

        // 檢查欄位名稱是否重複
        const modelColumnNameSet = this.columnList.reduce((acc, cur) => acc.add(cur.modelColumnName), new Set())
        if (modelColumnNameSet.size < this.columnList.length) {
          return Message({
            message: this.$t('model.inputParamNameDuplicated'),
            type: 'warning',
            duration: 3 * 1000,
            showClose: true
          })
        }

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
      color: #CCCCCC;
    }

    &__warning {
      margin-bottom: 8px;
      font-size: 13px;
      font-weight: normal;
      color: var(--color-warning);
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

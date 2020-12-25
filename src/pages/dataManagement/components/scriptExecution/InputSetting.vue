<template>
  <div class="input-setting-dialog">
    <div class="dialog-title">{{ $t('editing.newData') }}</div>
    <upload-process-block
      :step="2"
      :process-text="processText"
    />
    <div class="dialog-body">
      <div class="setting-block">
        <div class="setting-block__title">
          {{ $t('script.dataFrame') }}
        </div>
        <default-select 
          v-validate="'required'"
          :option-list="dataFrameOptionList"
          :placeholder="$t('miniApp.chooseDataFrame')"
          :is-disabled="isLoading"
          v-model="selectedInputInfo.dataframeId"
          filterable
          class="input-field__select"
          name="dataframeId"
          @change="fetchDataColumnList"
        />
        <div 
          v-show="errors.has('dataframeId')"
          class="error-text"
        >{{ errors.first('dataframeId') }}</div>
      </div>
      <div 
        v-if="selectedInputInfo.dataframeId" 
        class="setting-block">
        <div class="setting-block__title">
          {{ $t('script.selectInputColumn') }}
          <div class="setting-block__reminder">
            {{ "*" + $t('script.scriptColumnReminder') }}
          </div>
        </div>
        <single-column-card
          v-for="column in selectedInputInfo.columnList"
          :column-info="column"
          :data-column-option-list="dataColumnOptionList"
          :column-list="selectedInputInfo.columnList"
          :key="column.id"
          :has-name="true"
          :is-loading="isLoading"
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
          :disabled="isLoading"
          class="btn btn-outline"
          @click="cancel"
        >{{ $t('button.cancel') }}</button>
        <button 
          :disabled="isLoading"
          class="btn btn-default"
          @click="next"
        >
          <span v-if="isLoading">
            <svg-icon 
              v-if="isLoading" 
              icon-class="spinner"/>
            {{ $t('button.processing') }}
          </span>
          <span v-else>{{ $t('button.nextStep') }}</span>
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
import { 
  getDataFrameById, 
  getDataFrameColumnInfoById
} from '@/API/DataSource'
import { v4 as uuidv4 } from 'uuid'

export default {
  name: 'InputSetting',
  inject: ['$validator'],
  components: {
    UploadProcessBlock,
    DefaultSelect,
    SingleColumnCard
  },
  props: {
    processText: {
      type: Array,
      required: true
    }
  },
  data () {
    return {
      dataSourceId: parseInt(this.$route.params.id),
      isLoading: false,
      dataFrameOptionList: [],
      dataColumnOptionList: [],
      selectedInputInfo: {
        dataframeId: null,
        columnList: []
      },
    }
  },
  computed: {
    ...mapState('dataManagement', ['currentUploadScriptInfo'])
  },
  mounted () {
    this.fetchDataFrameList()
  },
  methods: {
    ...mapMutations('dataManagement', ['updateCurrentUploadScriptInfo']),
    fetchDataFrameList (dataSourceId) {
      this.isLoading = true
      // 清空原資料
      this.dataFrameOptionList = []
      this.selectedInputInfo.dataframeId = null
      this.selectedInputInfo.columnList = []
      const isGetAllStatesDataframe = false
      getDataFrameById(this.$route.params.id, isGetAllStatesDataframe)
        .then(response => {
          this.dataFrameOptionList = response.reduce((acc, cur) => {
            // 待捕：後端會新增一個屬性和值來告知是否可使用
            // 不能單純靠是否為 database 建立和設定 crontab 來判定
            if (cur.originType !== 'database') return acc
            acc.push({
              name: cur.primaryAlias,
              value: cur.id
            })
            return acc
          }, [])
        })
        .finally(() => this.isLoading = false)
    },
    fetchDataColumnList (dataframeId) {
      this.isLoading = true
      // 清空原資料
      this.selectedInputInfo.columnList = []
      this.dataColumnOptionList = []
      const hasFeatureColumn = true
      // 過濾掉分群欄位
      const hasBlockClustering = false
      getDataFrameColumnInfoById(dataframeId, hasFeatureColumn, false, hasBlockClustering)
        .then(response => {
          this.dataColumnOptionList = response.map(column => ({
            ...column,
            name: `${column.primaryAlias || column.name}（${column.statsType}）`,
            value: column.id,
            originalName: column.primaryAlias  || column.name
          }))
        })
        .finally(() => this.isLoading = false)
      // 預先新增一個欄位選擇器
      this.addNewColumnCard()
    },
    addNewColumnCard () {
      this.selectedInputInfo.columnList.push({
        columnId: null,
        dataType: null,
        id: uuidv4()
      })
    },
    updateDataColumn(columnId, selectedColumnCardId) {
      const columnCard = this.selectedInputInfo.columnList.find(columnCard => columnCard.id === selectedColumnCardId)
      const dataColumnInfo = this.dataColumnOptionList.find(column => column.id === columnId)
      columnCard.dataType = dataColumnInfo.dataType
    },
    removeColumnCard(cardId) {
      this.selectedInputInfo.columnList = this.selectedInputInfo.columnList.filter(columnCard => columnCard.id !== cardId)
    },
    cancel () {
      this.$store.commit('dataManagement/updateShowCreateDataSourceDialog', false)
    },
    next () {
      this.$validator.validateAll().then(isValidate => {
        if (!isValidate) return
        this.updateCurrentUploadScriptInfo({
          ...this.currentUploadScriptInfo,
          dataframeId: this.selectedInputInfo.dataframeId,
          ioArgs: {
            input: this.selectedInputInfo.columnList.map(({ columnId: dataColumnId, dataType }) => ({ dataColumnId, dataType }))
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

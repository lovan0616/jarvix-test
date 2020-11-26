<template>
  <div class="create-filter-dialog full-page-dialog">
    <div class="dialog-container">
      <div class="dialog-title">
        {{ title }}
        <a 
          href="javascript:void(0)" 
          class="close-btn"
          @click="closeDialog"
        ><svg-icon icon-class="close"/></a>
      </div>
      <!-- <spinner 
        v-if="isLoading"
        :title="$t('editing.loading')"
        size="50"
      /> -->
      <!-- <empty-info-block
        v-else-if="hasError"
        :msg="$t('message.systemIsError')"
      />  -->
      <template>
        <div class="setting-block">
          <div class="input-field">
            <label class="input-field__label">資料源</label>
            <div class="input-field__input">
              <default-select 
                v-validate="'required'"
                :option-list="dataSourceOptionList"
                :placeholder="$t('batchLoad.chooseColumn')"
                :is-disabled="isProcessing || isLoading"
                v-model="selectedBasicInfo.dataSourceId"
                filterable
                class="input-field__select"
                name="dataSourceId"
                @change="fetchDataFrameList"
              />
              <div 
                v-show="errors.has('dataSourceId')"
                class="error-text"
              >{{ errors.first('dataSourceId') }}</div>
            </div>
          </div>
          <div class="input-field">
            <label class="input-field__label">資料表</label>
            <div class="input-field__input">
              <default-select 
                v-validate="'required'"
                :option-list="dataFrameOptionList"
                :placeholder="$t('batchLoad.chooseColumn')"
                :is-disabled="isProcessing || isLoading"
                v-model="selectedBasicInfo.dataFrameId"
                filterable
                class="input-field__select"
                name="dataFrameId"
                @change="fetchDataColumnList"
              />
              <div 
                v-show="errors.has('dataFrameId')"
                class="error-text"
              >{{ errors.first('dataFrameId') }}</div>
            </div>
          </div>
          <template v-if="selectedBasicInfo.dataFrameId">
            <div class="card__wrapper">
              <div class="card__wrapper-title">欄位與欄位值組合</div>
              <single-column-card
                v-for="(filter, index) in filterInfoList"
                :filter-info="filter"
                :data-column-option-list="dataColumnOptionList"
                :filter-info-list="filterInfoList"
                :key="filter.id"
                :name="index.toString()"
                :is-loading="isLoading"
                :is-processing="isProcessing"
                @updateDataColumn="updateDataColumn($event, filter.id)"
                @remove="removeColumnCard"
              />
            </div>
            <button
              class="btn btn-m btn-outline"
              @click="addNewColumnCard()"
            >
              <svg-icon 
                icon-class="plus" 
                class="icon" />{{ $t('button.add') }}
            </button>
          </template>
        </div>
        <div class="button__block">
          <button 
            class="btn btn-outline"
            @click="closeDialog"
          >{{ $t('button.cancel') }}</button>
          <button 
            :disabled="isProcessing"
            class="btn btn-default"
            @click="createFilter"
          >{{ $t('button.save') }}</button>
        </div>
      </template>
    </div>
  </div>
</template>

<script>
import DefaultSelect from '@/components/select/DefaultSelect'
import DefaultMultiSelect from '@/components/select/DefaultMultiSelect'
import InputBlock from '@/components/InputBlock'
import EmptyInfoBlock from '@/components/EmptyInfoBlock'
import SingleColumnCard from '../card/SingleColumnCard'
import { mapGetters } from 'vuex'
import { 
  getDataFrameById, 
  getDataFrameColumnInfoById
} from '@/API/DataSource'

export default {
  name: 'CreateFilterDialog',
  inject: ['$validator'],
  components: {
    DefaultSelect,
    InputBlock,
    DefaultMultiSelect,
    EmptyInfoBlock,
    SingleColumnCard
  },
  props: {
    isProcessing: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      filterInfoList: [],
      selectedBasicInfo: {
        dataSourceId: null,
        dataSourceName: null,
        dataFrameId: null,
        dataFrameName: null,
      },
      singleFilterGeneralTemplate: {
        id: null,        
        dataSourceId: null,
        dataSourceName: null,
        dataFrameId: null,
        dataFrameName: null,
        columnId: null,
        dataType: null,
        statsType: null,
        columnName: null
      },
      enumColumnValueTemplate: {
        dataValues: []
      },
      rangeColumnValueTemplate: {
        start: null,
        end: null
      },
      isLoading: false,
      hasError: false,
      dataSourceOptionList: [],
      dataFrameOptionList: [],
      dataColumnOptionList: []
    }
  },
  computed: {
    ...mapGetters('dataSource', ['dataSourceList']),
  },
  mounted () {
    this.fetchDataSourceList()
  },
  methods: {
    fetchDataSourceList () {
      this.dataSourceOptionList = this.dataSourceList.reduce((acc, cur) => {
        if (cur.state !== 'ENABLE' || cur.enableDataFrameCount < 1) return acc
        acc.push({
          name: cur.name,
          value: cur.id
        })
        return acc
      }, [])
    },
    fetchDataFrameList (dataSourceId) {
      this.isLoading = true
      // 清空原資料
      this.dataFrameOptionList = []
      this.filterInfoList = []
      this.selectedBasicInfo.dataFrameId = null
      // 補 datasource 名稱
      const dataSourceName = this.dataSourceOptionList.find(datasource => datasource.value === dataSourceId).name
      this.selectedBasicInfo.dataSourceName = dataSourceName
      getDataFrameById(this.selectedBasicInfo.dataSourceId, ['Enable'])
        .then(response => {
          this.dataFrameOptionList = response.map(dataFrame => ({
            name: dataFrame.primaryAlias,
            value: dataFrame.id
          }))
        })
        .finally(() => this.isLoading = false)
    },
    fetchDataColumnList (dataFrameId) {
      this.isLoading = true
      // 清空原資料
      this.filterInfoList = []
      this.dataColumnOptionList = []
      const hasFeatureColumn = true
      // 補 dataframe 名稱
      const dataFrameName = this.dataFrameOptionList.find(dataFrame => dataFrame.value === dataFrameId).name
      this.selectedBasicInfo.dataFrameName = dataFrameName
      // 過濾掉分群欄位
      const hasBlockClustering = false
      getDataFrameColumnInfoById(dataFrameId, hasFeatureColumn, false, hasBlockClustering).then(response => {
        this.dataColumnOptionList = response.reduce((acc, cur) => {
          if (cur.statsType === 'DATETIME') return acc
          acc.push({
            ...cur,
            name: `${cur.primaryAlias || cur.name}（${cur.dataType}）`,
            value: cur.id,
            originalName: cur.primaryAlias  || cur.name
          })
          return acc
        }, [])
      })
      .finally(() => this.isLoading = false)
      this.addNewColumnCard()
    },
    addNewColumnCard () {
      this.filterInfoList.push({
        ...this.singleFilterGeneralTemplate,
        ...this.selectedBasicInfo,
        id: new Date().toString()
      })
    },
    removeColumnCard(cardId) {
      this.filterInfoList = this.filterInfoList.filter(filter => filter.id !== cardId)
    },
    closeDialog () {
      this.$emit('closeDialog')
    },
    updateDataColumn(columnId, filterId) {
      const filterInfo = this.filterInfoList.find(filter => filter.id === filterId)
      const dataColumnInfo = this.dataColumnOptionList.find(column => column.id === columnId)
      filterInfo.dataType = dataColumnInfo.dataType
      filterInfo.statsType = dataColumnInfo.statsType
      filterInfo.columnName = dataColumnInfo.originalName
    },
    createFilter () {
      this.$validator.validateAll().then(isValidate => {
        if (!isValidate) return
        this.$emit('filterCreated', this.filterInfoList)
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.create-filter-dialog {
  &.full-page-dialog {
    .dialog-container {
      width: 40%;
    }
  }

  .dialog {
    &__sub-title {
      margin-bottom: 12px;
      font-size: 14px;
    }
  }
  
  .setting-block {
    position: relative;
    padding: 24px;
    background-color: rgba(50, 58, 58, 0.95);
    border-radius: 5px;
    margin-bottom: 12px;

    &__switch {
      position: absolute;
      right: 24px;
      top: 24px;

      /deep/ .el-switch__label {
        color: #CCCCCC;
      }

      /deep/ .el-switch__core {
        height: 10px;
        border: unset;

        &::after {
          top: 50%;
          transform: translateY(-50%);
        }
      }
    }

    &__title {
      font-weight: 600;
      font-size: 18px;
      line-height: 1;
      margin-bottom: 16px;
    }

    /deep/ .input-field {
      display: flex;
      flex-direction: column;

      &:not(:last-of-type) {
        margin-bottom: 24px;
      }
      
      &__multi-select {
        width: 100%;
      }

      &__label {
        font-size: 14px;
        color: #CCCCCC;
      }

      &__select,
      &__multi-select {
        border-bottom: 1px solid #fff;
      }

      &__input-wrapper {
        margin-top: 8px;
      }
      
      .deletable-checkbox {
        display: flex;
        align-items: center;
        width: fit-content;
        .checkbox-label {
          margin-right: 12px;
        }
      }
      /deep/ .el-input__inner {
        font-size: 14px;
        padding-left: 0;

        &::placeholder {
          color: #AAAAAA;
        }
      }

      /deep/ .el-input {
        &.is-disabled {
          .el-input__inner {
            background-color: transparent;
          }
        }
      }
    }

    .cron-time {
      display: flex;
      flex-direction: row;
      margin-top: 37px;
      height: 360px;

      &__setting {
        width: 50%;
        margin-right: 16px;
      }

      &__input {
        margin-bottom: 37px;

        >>> .input-block .placeholder {
          color: #CCC;
        }
      }

      .cron-info {
        width: 48%;
        padding: 16px;
        background: rgba(72, 84, 84, 0.95);
        border-radius: 8px;
        overflow-y: scroll;
        ::-webkit-scrollbar-track {
          background-color: transparent;
        }

        &__block {
          margin-bottom: 16px;

          ul {
            margin-block-start: 6px;
            margin-block-end: 16px;
            padding-inline-start: 20px !important;
          }
        }

        &__title, &__list {
          font-size: 14px;
          line-height: 20px;
          color: #CCC;
        }

        &__title {
          color: $theme-color-white;
        }

        &__list { 
          &:not(:last-child) {
            margin-bottom: 6px;
          }
        }
      }
    }
  }

  .button {
    &__block {
      display: flex;
      justify-content: flex-end;

      .btn:not(:last-child) {
        margin-right: 20px;
      }
    }
  }

  .input-radio-group {
    display: inline-block;

    &:not(:last-of-type) {
      margin-right: 40px;
    }
    &:last-of-type {
      margin-right: 16px;
    }

    .input-radio-label {
      line-height: 40px;
    }
  }

  .card {
    &__wrapper-title {
      font-size: 14px;
      color: #CCCCCC;
      margin-bottom: 15px;
    }
  }

  /deep/ .sy-multi-select.theme-dark {
    .el-tag {
      border-color: #2AD2E2;
      color: #2AD2E2;
    }

    .el-tag__close.el-icon-close {
      background-color: #2AD2E2;
    }
  }
}
</style>

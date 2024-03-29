<template>
  <div class="create-filter-dialog full-page-dialog">
    <div class="dialog-container">
      <div class="dialog-title">
        {{ title }}
        <a
          href="javascript:void(0)"
          class="close-btn"
          @click="closeDialog"
        ><svg-icon icon-class="close" /></a>
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
            <label class="input-field__label">{{ $t('miniApp.dataSource') }}</label>
            <div class="input-field__input">
              <default-select
                v-validate="'required'"
                :option-list="dataSourceOptionList"
                :placeholder="$t('miniApp.chooseDataSource')"
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
              >
                {{ errors.first('dataSourceId') }}
              </div>
            </div>
          </div>
          <div class="input-field">
            <label class="input-field__label">{{ $t('miniApp.dataFrame') }}</label>
            <div class="input-field__input">
              <default-select
                v-validate="'required'"
                :option-list="dataFrameOptionList"
                :placeholder="$t('miniApp.chooseDataFrame')"
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
              >
                {{ errors.first('dataFrameId') }}
              </div>
            </div>
          </div>
          <template v-if="selectedBasicInfo.dataFrameId">
            <template v-if="!isYAxisController">
              <div class="card__wrapper">
                <div class="card__wrapper-title">
                  <div class="card__wrapper-title--left">
                    {{ $t('miniApp.filterConditions') }}
                  </div>
                  <div
                    v-if="isHierarchicalFilter"
                    class="card__wrapper-title--right"
                  >
                    *{{ $t('miniApp.conditionRelations') }}
                  </div>
                </div>
                <single-column-card
                  v-for="(filter, index) in filterInfoList"
                  :column-info="filter"
                  :data-column-option-list="dataColumnOptionList"
                  :column-list="filterInfoList"
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
                  class="icon"
                />{{ $t('button.add') }}
              </button>
            </template>
            <div
              v-else
              class="input-field"
            >
              <label class="input-field__label">{{ $t('miniApp.yAxisControllerColumns') }}</label>
              <div class="input-field__input">
                <default-multi-select
                  v-validate="'required'"
                  :value="yAxisControllerList"
                  :option-list="dataColumnOptionList"
                  :placeholder="$t('batchLoad.chooseColumn')"
                  :is-disabled="isProcessing || isLoading"
                  filterable
                  multiple
                  class="input-field__multi-select"
                  name="yAxisController"
                  @input="updateYAxisControllerList"
                />
                <div
                  v-show="errors.has('yAxisController')"
                  class="error-text"
                >
                  {{ errors.first('yAxisController') }}
                </div>
              </div>
            </div>
          </template>
        </div>
        <div class="button__block">
          <button
            class="btn btn-outline"
            @click="closeDialog"
          >
            {{ $t('button.cancel') }}
          </button>
          <button
            :disabled="isProcessing"
            class="btn btn-default"
            @click="createFilter"
          >
            {{ $t('button.save') }}
          </button>
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
import SingleColumnCard from '@/components/card/SingleColumnCard'
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
    },
    isSingleChoiceFilter: {
      type: Boolean,
      default: false
    },
    isYAxisController: {
      type: Boolean,
      default: false
    },
    isHierarchicalFilter: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      filterInfoList: [],
      selectedBasicInfo: {
        dataSourceId: null,
        dataSourceName: null,
        dataFrameId: null,
        dataFrameName: null
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
      dataColumnOptionList: [],
      yAxisControllerList: []
    }
  },
  computed: {
    ...mapGetters('dataSource', ['dataSourceList'])
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
      const isGetAllStatesDataframe = false
      getDataFrameById(this.selectedBasicInfo.dataSourceId, isGetAllStatesDataframe)
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
      this.yAxisControllerList = []
      const hasFeatureColumn = true
      // 補 dataframe 名稱
      const dataFrameName = this.dataFrameOptionList.find(dataFrame => dataFrame.value === dataFrameId).name
      this.selectedBasicInfo.dataFrameName = dataFrameName
      // 過濾掉分群欄位
      const hasBlockClustering = false
      getDataFrameColumnInfoById(dataFrameId, hasFeatureColumn, false, hasBlockClustering).then(response => {
        this.dataColumnOptionList = response.reduce((acc, cur) => {
          // 篩選不同情境下顯示的選項
          if (this.isUnavailableOption(cur)) return acc
          acc.push({
            ...cur,
            name: `${cur.primaryAlias || cur.name}（${cur.statsType}）`,
            value: cur.id,
            originalName: cur.primaryAlias || cur.name
          })
          return acc
        }, [])
      })
        .finally(() => this.isLoading = false)
      // 預先新增一個欄位選擇器
      if (!this.isYAxisController) this.addNewColumnCard()
    },
    isUnavailableOption (option) {
      return this.isSingleChoiceFilter && option.statsType !== 'CATEGORY' ||
        this.isYAxisController && option.statsType !== 'NUMERIC'
    },
    addNewColumnCard () {
      this.filterInfoList.push({
        ...this.singleFilterGeneralTemplate,
        ...this.selectedBasicInfo,
        id: Date.now().toString()
      })
    },
    removeColumnCard (cardId) {
      this.filterInfoList = this.filterInfoList.filter(filter => filter.id !== cardId)
    },
    closeDialog () {
      this.$emit('closeDialog')
    },
    updateDataColumn (columnId, filterId) {
      const filterInfo = this.filterInfoList.find(filter => filter.id === filterId)
      const dataColumnInfo = this.dataColumnOptionList.find(column => column.id === columnId)
      filterInfo.dataType = dataColumnInfo.dataType
      filterInfo.statsType = dataColumnInfo.statsType
      filterInfo.columnName = dataColumnInfo.originalName
    },
    createFilter () {
      this.$validator.validateAll().then(isValidate => {
        if (!isValidate) return
        if (this.isYAxisController) {
          this.$emit('filterCreated', this.filterInfoList)
        } else if (this.isHierarchicalFilter) {
          this.$emit('filterCreated', [this.filterInfoList])
        } else {
          this.$emit('filterCreated', this.filterInfoList.map(filter => ([filter])))
        }
      })
    },
    updateYAxisControllerList (columnIdList) {
      this.yAxisControllerList = columnIdList
      this.filterInfoList = columnIdList.map(id => {
        const dataColumnInfo = this.dataColumnOptionList.find(column => column.id === id)
        return {
          ...this.singleFilterGeneralTemplate,
          ...this.selectedBasicInfo,
          id: Date.now().toString(),
          columnId: id,
          dataType: dataColumnInfo.dataType,
          statsType: dataColumnInfo.statsType,
          columnName: dataColumnInfo.originalName
        }
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

      ::v-deep .el-switch__label {
        color: #CCCCCC;
      }

      ::v-deep .el-switch__core {
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

    ::v-deep .input-field {
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
      ::v-deep .el-input__inner {
        font-size: 14px;
        padding-left: 0;

        &::placeholder {
          color: #AAAAAA;
        }
      }

      ::v-deep .el-input {
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
      display: flex;
      justify-content: space-between;
      &--left {
        line-height: 25px;
        font-size: 14px;
        color: #CCCCCC;
        margin-bottom: 15px;
      }
      &--right {
        line-height: 25px;
        font-size: 12px;
        color: #FFFFFF;
      }
    }
  }

  ::v-deep .sy-multi-select.theme-dark {
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

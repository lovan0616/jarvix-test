<template>
  <section class="formula-setting">
    <div class="setting setting--top">
      <div class="setting__title">
        {{ $t('miniApp.sourceOfData') }}
      </div>
      <div class="setting__content">
        <div class="input-field">
          <label class="input-field__label">{{ $t('miniApp.dataSource') }}</label>
          <div class="input-field__input-box">
            <default-select 
              v-validate="'required'"
              :option-list="dataSourceOptionList"
              :placeholder="$t('miniApp.chooseDataSource')"
              :is-disabled="isLoading"
              v-model="formulaSetting.dataSourceId"
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
          <label class="input-field__label">{{ $t('miniApp.dataFrame') }}</label>
          <div class="input-field__input-box">
            <default-select 
              v-validate="'required'"
              :option-list="dataFrameOptionList"
              :placeholder="$t('miniApp.chooseDataFrame')"
              :is-disabled="isLoading"
              v-model="formulaSetting.dataFrameId"
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
      </div>
    </div>
    <!--運算式設定-->
    <div class="setting setting--middle">
      <div class="setting__title">
        {{ $t('miniApp.formulaSetting') }}
      </div>
      <div class="setting__content">
        <div class="input-field">
          <label class="input-field__label">{{ $t('miniApp.selectFormula') }}</label>
          <div class="input-field__input-box">
            <default-select 
              v-validate="'required'"
              :option-list="formulaOptionList"
              :placeholder="$t('miniApp.chooseDataSource')"
              :is-disabled="isLoading"
              v-model="formulaSetting.formulaId"
              filterable
              class="input-field__select"
              name="formula"
              @change="updateFormulaSetting"
            />
            <div 
              v-show="errors.has('formula')"
              class="error-text"
            >{{ errors.first('formula') }}</div>
          </div>
        </div>
        <div 
          v-if="formulaSetting.formulaId !== null" 
          class="input-field">
          <label class="input-field__label">{{ $t('miniApp.formulaPreview') }}</label>
          <div class="input-field__display">
            {{ formulaSetting.displayedFormula }}
          </div>
        </div>
        <div
          v-for="(input, index) in formulaSetting.inputList"
          :key="formulaSetting.dataFrameId + '-' + formulaSetting.formulaId + '-' + index"
          class="input-field"
        >
          <label class="input-field__label">{{ '$' + (index + 1) + $t('miniApp.setting') }}</label>
          <div class="input-field__input-box">
            <default-select 
              v-validate="'required'"
              :option-list="getDataColumnOptionList(input.dataType)"
              :placeholder="$t('miniApp.chooseDataFrame')"
              :is-disabled="isLoading"
              :key="formulaSetting.dataFrameId + '-' + formulaSetting.formulaId + '-' + index"
              :value="input.dcId"
              :name="'input' + formulaSetting.formulaId + '-' + index"
              filterable
              class="input-field__select"
              @change="updateFormulaInput(input.id, $event)"
            />
            <div 
              v-show="errors.has('input' + formulaSetting.formulaId + '-' + index)"
              class="error-text"
            >{{ errors.first('input' + formulaSetting.formulaId + '-' + index) }}</div>
          </div>
        </div>
      </div>
    </div>
    <!--其他設定-->
    <div class="setting setting--bottom">
      <div class="setting__title">
        {{ $t('miniApp.otherSettings') }}
      </div>
      <div class="setting__content">
        <div class="input-field">
          <label class="input-field__label">{{ $t('miniApp.displayedUnit') }}</label>
          <div class="input-field__input-box">
            <input
              :disabled="isLoading"
              v-model.trim="currentComponent.indexInfo.unit"
              :placeholder="$t('miniApp.pleaseEnterUnitName')"
              class="input input-field__input"
            >
          </div>
        </div>
        <div 
          v-if="formulaSetting.formulaId !== null" 
          class="input-field">
          <label class="input-field__label">{{ $t('miniApp.formulaPreview') }}</label>
          <div class="input-field__display">
            {{ formulaSetting.displayedFormula }}
          </div>
        </div>
        <div
          v-for="(input, index) in formulaSetting.inputList"
          :key="formulaSetting.dataFrameId + '-' + formulaSetting.formulaId + '-' + index"
          class="input-field"
        >
          <label class="input-field__label">{{ '$' + (index + 1) + $t('miniApp.setting') }}</label>
          <div class="input-field__input-box">
            <default-select 
              v-validate="'required'"
              :option-list="getDataColumnOptionList(input.dataType)"
              :placeholder="$t('miniApp.chooseDataFrame')"
              :is-disabled="isLoading"
              :key="formulaSetting.dataFrameId + '-' + formulaSetting.formulaId + '-' + index"
              :value="input.dcId"
              :name="'input' + formulaSetting.formulaId + '-' + index"
              filterable
              class="input-field__select"
              @change="updateFormulaInput(input.id, $event)"
            />
            <div 
              v-show="errors.has('input' + formulaSetting.formulaId + '-' + index)"
              class="error-text"
            >{{ errors.first('input' + formulaSetting.formulaId + '-' + index) }}</div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import DefaultSelect from '@/components/select/DefaultSelect'
import { 
  getDataFrameById, 
  getDataFrameColumnInfoById
} from '@/API/DataSource'
import { mapGetters } from 'vuex'

const dummyFormulaData = [
  {
    id: 1,
    name: 'this is the name of the formula',
    formula: 'avg($1-1) + avg($1-2)',
    inputList: [
      { id: 1, dataType: 'NUMERIC' },
      { id: 2, dataType: 'NUMERIC' },
      { id: 3, dataType: 'NUMERIC' }
    ]
  },
  {
    id: 2,
    name: 'this is the name of the formula',
    formula: 'avg($1-1) + avg($1-2)',
    inputList: [
      { id: 1, dataType: 'NUMERIC' },
      { id: 3, dataType: 'NUMERIC' }
    ]
  }
]

export default {
  inject: ['$validator'],
  name: 'FormulaSetting',
  components: {
    DefaultSelect
  },
  props: {
    formulaSetting: {
      type: Object,
      default: () => ({
        dataSourceId: null,
        dataFrameId: null,
        formulaId: null,
        displayedFormula: null,
        inputList: []
      })
    },
    currentComponent: {
      type: Object,
      required: true
    },
  },
  data () {
    return {
      isLoading: false,
      dataSourceOptionList: [],
      dataFrameOptionList: [],
      formulaOptionList: [],
      dataColumnOptionList: []
    }
  },
  computed: {
    ...mapGetters('dataSource', ['dataSourceList']),
  },
  mounted () {
    this.fetchDataSourceList()
    this.getFormulaData()
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
      this.formulaSetting.dataFrameId = null
      this.formulaSetting.formulaId = null
      this.formulaSetting.inputList = []
      this.displayedFormula = null

      const isGetAllStatesDataframe = false
      getDataFrameById(this.formulaSetting.dataSourceId, isGetAllStatesDataframe)
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
      this.dataColumnOptionList = []
      this.formulaSetting.formulaId = null
      this.formulaSetting.inputList = []
      this.displayedFormula = null

      const hasFeatureColumn = true
      
      // 過濾掉分群欄位
      const hasBlockClustering = false
      getDataFrameColumnInfoById(dataFrameId, hasFeatureColumn, false, hasBlockClustering).then(response => {
        this.dataColumnOptionList = response.map(column => ({
          ...column,
          name: `${column.primaryAlias || column.name}（${column.statsType}）`,
          value: column.id,
          originalName: column.primaryAlias  || column.name,
          dcId: column.id
        }))
      })
      .finally(() => this.isLoading = false)
      // 預先新增一個欄位選擇器
    },
    getFormulaData () {
      this.formulaOptionList = dummyFormulaData.map(formula => ({
        ...formula,
        name: formula.name,
        value: formula.id
      }))
    },
    updateFormulaSetting (selectedId) {
      const selectedFormula = this.formulaOptionList.find(formula => formula.id === selectedId)
      this.formulaSetting.displayedFormula = selectedFormula.name
      this.formulaSetting.formulaId = selectedFormula.id
      this.formulaSetting.inputList = selectedFormula.inputList.map(input => ({ 
        id: input.id, 
        dataType: 'NUMERIC',
        dcId: null
      }))
    },
    getDataColumnOptionList (dataType) {
      return this.dataColumnOptionList.filter(column => column.statsType === dataType)
    },
    updateFormulaInput(inputId, columnId) {
      const selectedInput = this.formulaSetting.inputList.find(input => input.id === inputId)
      selectedInput.dcId = columnId
    }
  }
}
</script>

<style lang="scss" scoped>
.formula-setting {
  padding: 24px 17px;

  .setting {
    &:not(:last-of-type) {
      margin-bottom: 16px;
    }

    &__title {
      font-weight: 600;
      font-size: 18px;
      color: #FFFFFF;
      margin-bottom: 8px;
    }

    &__content {
      background: #1C292B;
      border-radius: 12px;
      padding: 25px 17px;
    }

    /deep/ .input-field {
      display: flex;
      align-items: center;

      &:not(:last-of-type) {
        margin-right: 58px;
      }

      &__label {
        font-size: 14px;
        color: #AAAAAA;
        width: 90px;
      }

      &__input-box {
        position: relative;
      }

      &__input {
        height: 40px;
        font-size: 14px;
        border-color: #FFFFFF;
        width: 232px;

        &::placeholder {
          color: #AAAAAA;
        }
      }

      &__select {
        border-bottom: 1px solid #fff;
        width: 232px;
      }

      &__display {
        font-size: 14px;
      }

      .error-text {
        position: absolute;
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

    &--top {
      .setting__content {
        display: flex;
      }
    }

    &--middle
    &--bottom {
      .input-field {
        &:not(:last-of-type) {
          margin-bottom: 25px;
        }
      }
    }
  }
}
</style>
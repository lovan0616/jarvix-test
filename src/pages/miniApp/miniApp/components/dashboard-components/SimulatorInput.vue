<template>
  <!--CATEGORY or BOOLEAN-->
  <div 
    v-if="inputData.statsType === 'CATEGORY' || inputData.statsType === 'BOOLEAN'" 
    class="input-field">
    <label class="input-field__label">{{ inputData.columnName }}</label>
    <div class="input-field__input">
      <default-select 
        v-validate="'required'"
        :option-list="inputData.valueList"
        :placeholder="$t('miniApp.pleaseSelect')"
        :is-disabled="isProcessing"
        v-model="columnInfo.userInput"
        :name="'category' + inputData.columnName"
        filterable
        class="input-field__select"
      />
      <div 
        v-show="errors.has('category' + inputData.columnName)"
        class="error-text"
      >{{ errors.first('category' + inputData.columnName) }}</div>
    </div>
  </div>
  <!--NUMERIC-->
  <div 
    v-else-if="inputData.statsType === 'NUMERIC'" 
    class="input-field">
    <label class="input-field__label">{{ getNumericTitle }}</label>
    <div class="input-field__input">
      <input-verify
        v-validate="'required'"
        v-model.number="columnInfo.userInput"
        :is-disabled="isProcessing"
        :type="'Number'"
        :name="'input' + inputData.columnName"
      />
    </div>
  </div>
  <!-- DATETIME -->
  <div
    v-else-if="inputData.statsType === 'DATETIME'"
    class="input-field">
    <label class="input-field__label">{{ inputData.columnName }}</label>
    <div class="input-field__input">
      <el-date-picker
        v-model="columnInfo.userInput"
        :format="inputData.datetimeInfo.datePattern"
        :value-format="inputData.datetimeInfo.datePattern"
        :clearable="false"
        :picker-options="pickerOptions"
        type="datetime"
      />
    </div>
  </div>
</template>

<script>
import { dataValueSearch } from '@/API/DataSource'
import { searchColumnDefaultValue, searchNumericColumnValueRange } from '@/API/Model'
import DefaultSelect from '@/components/select/DefaultSelect'
import EmptyInfoBlock from '@/components/EmptyInfoBlock'
import InputVerify from '@/components/InputVerify'

export default {
  inject: ['$validator'],
  name: "SimulatorInput",
  components: {
    DefaultSelect,
    EmptyInfoBlock,
    InputVerify
  },
  props: {
    columnInfo: {
      type: Object,
      required: true
    },
    isProcessing: {
      type: Boolean,
      default: false
    },
    modelId: {
      type: Number,
      required: true
    },
    restrictions: {
      type: Array,
      default: () => ([])
    }
  },
  data () {
    return {
      inputData: {}
    }
  },
  computed: {
    getNumericTitle () {
      if (!this.inputData.statsType || this.inputData.statsType !== 'NUMERIC') return
      return this.inputData.columnName + '(' + this.$t('miniApp.minAndMax', { 
        min: Math.round(this.inputData.valueList.min * 100) / 100, 
        max: Math.round(this.inputData.valueList.max  * 100) / 100
      }) + ')'
    },
    pickerOptions () {
      const vm = this
      return {
        disabledDate (time) {
          return time.getTime() > vm.inputData.datetimeInfo.end || time.getTime() < vm.inputData.datetimeInfo.start
        }
      }
    }
  },
  watch: {
    
  },
  mounted () {
    this.configInputData()
  },
  methods: {
    configInputData () {
      Promise.all([
        ...(this.columnInfo.statsType === 'NUMERIC' && [searchNumericColumnValueRange(this.modelId, this.columnInfo.columnId, {
          restrictions: this.restrictions.length > 0 ? this.restrictions : null 
        })]),
        ...((this.columnInfo.statsType === 'CATEGORY' || this.columnInfo.statsType === 'BOOLEAN') && [this.searchValue(this.columnInfo.columnId, '')]),
        searchColumnDefaultValue(this.modelId, this.columnInfo.columnId, {
          restrictions: this.restrictions
        })
      ])
        .then(([columnValueInfo, defaultValue]) => {
          this.handleColumnValue(columnValueInfo, defaultValue)
        })
        .catch(() => {
          this.$emit('failed')
        })
    },
    async handleColumnValue (columnInfo, defaultValue) {
      const inputData = {}
      inputData.statsType = this.columnInfo.statsType
      inputData.columnName = this.columnInfo.originalName

      if(inputData.statsType === 'CATEGORY' || inputData.statsType === 'BOOLEAN') {
        inputData.valueList = columnInfo.fuzzySearchResult
        inputData.valueList = inputData.valueList.map(element => ({
          value: element,
          name: element
        }))
        this.columnInfo.userInput = defaultValue
      } else if (inputData.statsType === 'NUMERIC') {
        this.columnInfo.userInput = defaultValue
        this.inputData.valueList = columnInfo
      } else if (inputData.statsType === 'DATETIME') {
        this.columnInfo.userInput = defaultValue
        inputData.datetimeInfo = {
          ...columnInfo.datetime,
          datePattern: 'yyyy-MM-dd hh:mm:ss' // 目前後端給的 datePattern 沒有用到，前端先暫定這種
        }
      }

      this.$emit('done')
      this.inputData = {
        ...this.inputData,
        ...inputData
      }
    },
    searchValue (columnId, searchString) {
      return dataValueSearch(columnId, {
        page: 0,
        searchString,
        size: 200,
        restrictions: this.restrictions.length > 0 ? this.restrictions : null
      })
    },
  },

}
</script>

<style lang="scss" scoped>
.input-field {
  &__label {
    color: #AAAAAA;
    font-weight: 600;
    font-size: 14px;
  }

  /deep/ .el-select-dropdown {
    width: 100%;
  }
  
  .el-input {
    width: 100%;
  }
  /deep/ .el-input__inner {
    padding-left: 0 !important; // 為了蓋掉 element-ui 樣式
    border-bottom: 1px solid #FFFFFF;
    border-radius: 0;
    background: transparent;
    font-size: 16px;
    &::placeholder {
      color: #AAAAAA;
      font-weight: normal;
      font-size: 16px;
    } 
  }
  /deep/ .el-select {
    width: 100%;
  }

  /deep/ .input-verify .input-verify-text {
    margin-bottom: 0;
    color: #ffffff;
  }

  /deep/ .input-error.error-text {
    bottom: -17px;
  }
}
</style>
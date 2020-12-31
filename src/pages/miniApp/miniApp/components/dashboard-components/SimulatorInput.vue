<template>
  <div 
    v-if="inputData.statsType === 'CATEGORY'" 
    class="input-field">
    <label class="input-field__label">{{ inputData.columnName }}</label>
    <!--CATEGORY-->
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
</template>

<script>
import { getDataColumnValue, dataValueSearch } from '@/API/DataSource'
import { getColumnAliasInfoById } from '@/API/Alias'
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
    }
  },
  watch: {
    
  },
  mounted () {
    this.getInputListInfo()
  },
  methods: {
    getInputListInfo () {
      this.isLoading = true
      Promise.all([
        getDataColumnValue(this.columnInfo.columnId),
        getColumnAliasInfoById(this.columnInfo.columnId)
      ])
        .then(([columnValueInfo, columnAliasInfo]) => {
          this.handleColumnValue(columnValueInfo)
          this.inputData.columnName = columnAliasInfo[0].dataValue
        })
        .catch(() => {
          this.$emit('failed')
        })
    },
    async handleColumnValue (columnInfo) {
      const inputData = {}
      inputData.statsType = columnInfo.type
      
      inputData.valueList = inputData.statsType === 'BOOLEAN' && columnInfo['bool']
        ? ["true", "false"]
        : columnInfo[inputData.statsType.toLowerCase()]

      if(inputData.statsType === 'CATEGORY') {
        /// CATEGORY 值超過 200 筆時候會回傳 null
        if(!inputData.valueList) {
          try {
            const response = await this.searchValue(this.columnInfo.columnId, '')
            inputData.valueList = response.fuzzySearchResult
          } catch (e) {
            this.$emit('failed', e.message || this.$t('message.systemIsError'))
          }
        }
        inputData.valueList = inputData.valueList.map(element => ({
          value: element,
          name: element
        }))
        this.columnInfo.userInput = inputData.valueList[0].value
      } else if (inputData.statsType === 'NUMERIC') {
        this.columnInfo.userInput = inputData.valueList.min
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
        restrictions: null
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

  /deep/ .el-input__inner {
    padding-left: 0;
    border-bottom: 1px solid #FFFFFF;
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

  /deep/ .input-error .error-text {
    bottom: -17px;
  }
}
</style>
<template>
  <div class="setting-block">
    <div 
      :class="{'has-change': true}"
      class="section-block"
    >
      <div class="setting-input-block">
        <label 
          class="input-label" 
          for="">{{ $t('etl.dataType') }}</label>
        <div class="setting-cascader-container">
          <el-cascader
            v-model="editColumnInfo.statsType"
            :is-disabled="isReviewMode"
            :show-all-levels="false"
            :options="cascaderStatsTypeOptions"
            :props="{ expandTrigger: 'hover', label: 'name', children: 'pattern' }"
            filterable
            popper-class="setting-cascader__popper"
            class="sy-select theme-dark setting-cascader"
            @change="changeStatsType(editColumnInfo, editColumnInfo.statsType)"
          >
            <template #default="{ node, data }">
              <svg-icon
                v-if="statsTypeList.includes(data.value)"
                :icon-class="getStatsTypeIcon(data.value)"
                class="statsType__icon" />
              <span class="statsType__label">{{ data.name }}</span>
            </template>
          </el-cascader>
          <svg-icon 
            :icon-class="getStatsTypeIcon(editColumnInfo.statsType[0])"
            class="setting-cascader-icon" />
        </div>
      </div>
      <div class="setting-input-block">
        <label 
          class="input-label" 
          for="">{{ $t('etl.emptyStringReplaceValue') }}</label>
        <default-select 
          v-model="stringReplaceObject.newValue"
          :is-disabled="isReviewMode"
          :option-list="replaceTypeOptionList"
          class="replace-type-select"
        />
        <input-verify
          v-validate="'required'"
          v-if="stringReplaceObject.newValue === 'CUSTOM'"
          v-model="stringReplaceObject.customValue"
          :type="replaceValueInputType"
          :placeholder="$t('etl.replaceValuePlaceholder')"
          name="stringReplaceObject"
        />
      </div>
      <div class="setting-input-block">
        <label 
          class="input-label" 
          for="">{{ $t('etl.nullReplaceValue') }}</label>
        <default-select 
          v-model="nullReplaceObject.newValue"
          :is-disabled="isReviewMode"
          :option-list="replaceTypeOptionList"
          class="replace-type-select"
        />
        <input-verify
          v-validate="'required'"
          v-if="nullReplaceObject.newValue === 'CUSTOM'"
          v-model="nullReplaceObject.customValue"
          :type="replaceValueInputType"
          :placeholder="$t('etl.replaceValuePlaceholder')"
          name="nullReplaceObject"
        />
      </div>
      <div class="setting-input-block">
        <label 
          class="input-label" 
          for="">{{ $t('etl.errorReplaceValue') }}</label>
        <default-select 
          v-model="errorDefaultObject.newValue"
          :is-disabled="isReviewMode"
          :option-list="replaceTypeOptionList"
          class="replace-type-select"
        />
        <input-verify
          v-validate="'required'"
          v-if="errorDefaultObject.newValue === 'CUSTOM'"
          v-model="errorDefaultObject.customValue"
          :type="replaceValueInputType"
          :placeholder="$t('etl.replaceValuePlaceholder')"
          name="errorDefaultObject"
        />
      </div>
      <div 
        v-if="!isReviewMode" 
        class="setting-input-block">
        <label 
          class="input-label" 
          for="">{{ $t('etl.customDataManagement') }}</label>
        <div class="input-list">
          <div 
            v-for="(replaceValue, index) in replaceValueList"
            :key="replaceValue.id"
            class="inline-input-block"
          >
            <input-verify
              v-validate="'required'"
              :name="replaceValue.id + '-0'"
              v-model="replaceValue.value"
              :placeholder="$t('etl.columnValue')"
            />
            <svg-icon 
              icon-class="go-right" 
              class="arrow-icon"/>
            <default-select
              v-if="editColumnInfo.statsType === 'BOOLEAN'"
              :option-list="booleanOptionList"
              v-model="replaceValue.newValue"
            />
            <input-verify
              v-else
              :name="replaceValue.id + '-1'"
              v-model="replaceValue.newValue"
              :type="replaceValueInputType"
              :placeholder="$t('etl.replaceValue')"
            />
            <a 
              href="javascript:void(0)" 
              class="link remove-link"
              @click="removeReplaceValue(index)"
            >{{ $t('button.remove') }}</a>
          </div>
        </div>
        <button 
          class="btn btn-outline"
          @click="addReplaceValue"
        >{{ $t('button.create') }}</button>
      </div>
    </div>
    <div 
      v-if="!isReviewMode" 
      class="submit-block" >
      <div class="button-block">
        <button 
          class="btn btn-default"
          @click="saveSetting"
        >{{ $t('button.keepSave') }}</button>
        <button 
          class="btn btn-outline"
          @click="reset"
        >{{ $t('button.resumeDefault') }}</button>
      </div>
      <span class="remark-info">{{ $t('etl.remarkToSave') }}</span>
    </div>
  </div>
</template>
<script>
import { statsTypeList, statsTypeOptionList, booleanOptionList } from '@/utils/general'
import InputVerify from '@/components/InputVerify'
import DefaultSelect from '@/components/select/DefaultSelect'
import { mapState } from 'vuex'
import { Message } from 'element-ui'

export default {
  name: 'SingleColumnSetting',
  inject: ['$validator'],
  components: {
    InputVerify,
    DefaultSelect
  },
  props: {
    columnInfo: {
      type: Object,
      default: () => {}
    },
    summaryData: {
      type: Object,
      default: () => {}
    },
    isReviewMode: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      editColumnInfo: JSON.parse(JSON.stringify(this.columnInfo)),
      dataSummaryOption: [],
      categoryOptionList: [
        { value: 'CUSTOM', name: this.$t('etl.custom') }
      ],
      numericOptionList: [
        // { value: 'max', name: this.$t('etl.maxValue') },
        // { value: 'min', name: this.$t('etl.minValue') },
        // { value: 'average', name: this.$t('etl.avgValue') },
        // { value: 'standardDeviation', name: this.$t('etl.sdValue') },
        // { value: 'sum', name: this.$t('etl.sumValue') },
        { value: 'CUSTOM', name: this.$t('etl.custom') }
      ],
      booleanOptionList,
      datetimeOptionList: [
        { value: 'CUSTOM', name: this.$t('etl.custom') }
      ],
      replaceValueInputType: '',
      replaceValueObjest: {
        value: null,
        newValue: null,
        type: 'VALUE_REPLACEMENT',
        active: true
      },
      nullReplaceObject: null,
      stringReplaceObject: null,
      errorDefaultObject: null,
      replaceId: 0,
      statsTypeList,
      originalStatsType: ''
    }
  },
  computed: {
    ...mapState('dataManagement', ['datetimePatterns']),
    statsTypeOptions () {
      return statsTypeOptionList.filter((option) => {
        return this.editColumnInfo.originalStatsType === 'BOOLEAN'
          ? option.value !== 'DATETIME'
          : option
      })
    },
    cascaderStatsTypeOptions () {
      if (this.editColumnInfo.originalStatsType === 'BOOLEAN') return this.statsTypeOptions
      return this.statsTypeOptions.map(item => {
        if(item.value !== 'DATETIME') return item
        else return {
          ...item,
          pattern: this.datetimePatterns.map(pattern => {
            return {
              value: pattern.datetimePattern,
              name: pattern.datetimePattern
            }
          })
        }
      })
    },
    replaceTypeOptionList () {
      return [
        { value: null, name: this.$t('etl.null') },
        ...this.dataSummaryOption
      ]
    },
    replaceValueList () {
      return this.editColumnInfo.values.filter(element => {
        return (element.type !== 'MISSING_VALUE' && element.type !== 'ERROR_DEFAULT_VALUE')
      })
    },
    currentTableIndex () {
      return this.$store.state.dataManagement.currentTableIndex
    }
  },
  watch: {
    'editColumnInfo.statsType': {
      handler (newVal) {
        if (newVal === 'BOOLEAN') {
          this.dataSummaryOption = this.booleanOptionList
        } else if (newVal === 'CATEGORY') {
          this.dataSummaryOption = this.categoryOptionList
          this.replaceValueInputType = 'text'
        } else if (newVal === 'NUMERIC') {
          this.dataSummaryOption = this.numericOptionList
          this.replaceValueInputType = 'number'
        } else if (newVal === 'DATETIME') {
          this.dataSummaryOption = this.datetimeOptionList
          this.replaceValueInputType = 'text'
        }
      },
      immediate: true
    }
  },
  mounted () {
    this.editColumnInfo.values = this.editColumnInfo.values.map(element => {
      return {
        ...element,
        id: this.replaceId++
      }
    })
    this.editColumnInfo.values.forEach(element => {
      if (element.type === 'MISSING_VALUE' && element.value === null) {
        this.nullReplaceObject = element
      } else if (element.type === 'MISSING_VALUE' && element.value === '') {
        this.stringReplaceObject = element
      } else if (element.type === 'ERROR_DEFAULT_VALUE' && element.value === null) {
        this.errorDefaultObject = element
      }
    })
    // 因應 cascader 的資料型態, 需轉成 Array
    this.originalStatsType = this.stateTypeConverter(this.columnInfo.statsType)
    this.editColumnInfo.statsType = this.originalStatsType
  },
  methods: {stateTypeConverter (type) {
      let statsType = JSON.parse(JSON.stringify(type))
      if (statsType === 'DATETIME') statsType = ['DATETIME', this.columnInfo.datetimePatterns[0]]
      else statsType = [statsType]
      return statsType
    },
    columnInfoFormatter (cascaderColumnInfo) {
      const tempColumnInfo = JSON.parse(JSON.stringify(cascaderColumnInfo))
      tempColumnInfo.statsType = cascaderColumnInfo.statsType[0]
      tempColumnInfo.datetimePatterns = cascaderColumnInfo.statsType[0] === 'DATETIME' 
        ? [cascaderColumnInfo.statsType[1]]
        : []
      return tempColumnInfo
    },
    getStatsTypeIcon (statesType) {
      const currentStatesType = Array.isArray(statesType) ? statesType[0] : statesType
      switch (currentStatesType) {
        case 'CATEGORY':
          return 'character-a'
        case 'NUMERIC':
          return 'numeric'
        case 'BOOLEAN':
          return 'checked'
        case 'DATETIME':
          return 'calendar'
        default:
          return 'check-circle'
      }
    },
    addReplaceValue () {
      this.editColumnInfo.values.push({
        ...this.replaceValueObjest,
        id: this.replaceId++,
        newValue: this.editColumnInfo.statsType === 'BOOLEAN' ? true : null
      })
    },
    removeReplaceValue (index) {
      this.editColumnInfo.values.splice(index + 3, 1)
    },
    saveSetting () {
      this.$validator.validateAll().then(result => {
        if (!result) return

        // let numTypes = ['average', 'min', 'max', 'sum', 'standardDeviation']

        this.editColumnInfo.hasChanged = true
        this.editColumnInfo.values.forEach(el => {
          // 將自訂值指定為 newValue
          if (el.customValue) {
            el.newValue = el.customValue
            delete el.customValue
          }
          // Numeric型別時，將實際值指定給 newValue
          // if (numTypes.includes(el.newValue)) {
          //   el.newValue = this.summaryData.data[1].data[numTypes]
          // }
        })
        this.$emit('updateInfo', this.columnInfoFormatter(this.editColumnInfo))

        Message({
          message: this.$t('message.etlSettingTempSave'),
          type: 'success',
          duration: 3 * 1000,
          showClose: true
        })

        this.$emit('back')
      })
    },
    changeStatsType (column, targetStatsType) {
      column.statsType = targetStatsType
      switch (targetStatsType[0]) {
        case 'NUMERIC':
          column.targetDataType = 'FLOAT'
          break
        case 'CATEGORY':
          column.targetDataType = 'STRING'
          break
        case 'DATETIME':
          column.targetDataType = 'DATETIME'
          break
        case 'BOOLEAN':
          column.targetDataType = 'BOOLEAN'
          break
      }
      this.cleanReplacements()
    },
    reset () {
      this.editColumnInfo.hasChanged = false
      this.editColumnInfo.statsType = this.editColumnInfo.originalStatsType
      this.editColumnInfo.statsType = this.originalStatsType
      this.editColumnInfo.targetDataType = this.editColumnInfo.originalDataType
      this.cleanReplacements()

      this.updateSetting(this.columnInfoFormatter(this.editColumnInfo))
    },
    cleanReplacements () {
      this.editColumnInfo.values = this.editColumnInfo.values.filter(el => el.type !== 'VALUE_REPLACEMENT')
      this.editColumnInfo.values.forEach(function (el) { el.newValue = null })
    },
    updateSetting (info) {
      this.$store.commit('dataManagement/updateReplaceValue', {
        tableIndex: this.currentTableIndex,
        columnIndex: info.index,
        info
      })
    }
  },
}
</script>
<style lang="scss" scoped>
.setting-block {
  position: relative;
  .section-block {
    background: rgba(67, 76, 76, 0.95);
    border-radius: 5px;
    padding: 12px 16px;
    max-height: 544px;
    overflow: auto;
    margin-bottom: 12px;
  }

  .setting-cascader-container {
    position: relative;
    .setting-cascader-icon {
      position: absolute;
      top: 20%;
      left: 6px;
      font-size: 16px;
    } 

    .setting-cascader.el-cascader {
      background-color: transparent;
      border-radius: unset;

      & >>> .el-input {
        padding-left: 30px;
      }
    }
  }

  .setting-input-block {
    .input-label {
      display: block;
    }

    .replace-type-select {
      width: 40%;
      & + .input-verify {
        display: inline-block;
        >>> .input-verify-text {
          height: 41px; // 與select高度對齊
        }
        >>> .input-error.error-text {
          bottom: 2px;
        }
      }
    }
    & >>> .input-verify .input-verify-text {
      margin-bottom: 20px;
    }
  }

  .sy-select {
    width: 40%;
    border-bottom: 1px solid;
    margin: 0 20px 20px 0;
    &>>> .el-input--suffix .el-input__inner {
      padding-left: 0;
    }
  }

  .inline-input-block {
    display: flex;

    & >>> .input-verify {
      flex: 1;

      .input-error {
        bottom: 2px;
      }
    }

    .arrow-icon {
      margin-top: 12px;
      width: 28px;
    }

    .remove-link {
      line-height: 1;
      margin-top: 12px;
      margin-left: 8px;
    }
  }

  .submit-block {
    display: flex;
    align-items: center;
    width: 100%;
    background-color: transparent;

    .button-block {
      white-space: nowrap;
      flex: unset;
      .btn:not(:last-child) {
        margin-right: 12px;
      }
    }

    .remark-info {
      font-size: 14px;
      color: #FFDF6F;
      margin-left: 8px;
    }
  }
}

// 移除 type="number"時的上下箭頭
/* Chrome, Safari, Edge, Opera */
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

/* Firefox */
input[type=number] {
  -moz-appearance: textfield;
}
</style>

<template>
  <div class="setting-block">
    <div class="section-block"
      :class="{'has-change': true}"
    >
      <div class="setting-input-block">
        <label class="input-label" for="">{{ $t('etl.dataType') }}</label>
        <default-select class="data-type-select"
          v-model="editColumnInfo.statsType"
          :option-list="statsTypeOptions"
          @change="changeStatsType(editColumnInfo, editColumnInfo.statsType)"
        ></default-select>
      </div>
      <div class="setting-input-block">
        <label class="input-label" for="">{{ $t('etl.emptyStringReplaceValue') }}</label>
        <default-select class="replace-type-select"
          v-model="stringReplaceObject.newValue"
          :option-list="replaceTypeOptionList"
        ></default-select>
        <input-verify
          name="stringReplaceObject"
          v-if="stringReplaceObject.newValue === 'CUSTOM'"
          v-model="stringReplaceObject.customValue"
          :type="replaceValueInputType"
          :placeholder="$t('etl.replaceValuePlaceholder')"
          v-validate="'required'"
        ></input-verify>
      </div>
      <div class="setting-input-block">
        <label class="input-label" for="">{{ $t('etl.nullReplaceValue') }}</label>
        <default-select class="replace-type-select"
          v-model="nullReplaceObject.newValue"
          :option-list="replaceTypeOptionList"
        ></default-select>
        <input-verify
          name="nullReplaceObject"
          v-if="nullReplaceObject.newValue === 'CUSTOM'"
          v-model="nullReplaceObject.customValue"
          :type="replaceValueInputType"
          :placeholder="$t('etl.replaceValuePlaceholder')"
          v-validate="'required'"
        ></input-verify>
      </div>
      <div class="setting-input-block">
        <label class="input-label" for="">{{ $t('etl.errorReplaceValue') }}</label>
        <default-select class="replace-type-select"
          v-model="errorDefaultObject.newValue"
          :option-list="replaceTypeOptionList"
        ></default-select>
        <input-verify
          name="errorDefaultObject"
          v-if="errorDefaultObject.newValue === 'CUSTOM'"
          v-model="errorDefaultObject.customValue"
          :type="replaceValueInputType"
          :placeholder="$t('etl.replaceValuePlaceholder')"
          v-validate="'required'"
        ></input-verify>
      </div>
      <div class="setting-input-block">
        <label class="input-label" for="">{{ $t('etl.customDataManagement') }}</label>
        <div class="input-list">
          <div class="inline-input-block"
            v-for="(replaceValue, index) in replaceValueList"
            :key="replaceValue.id"
          >
            <input-verify
              :name="replaceValue.id + '-0'"
              v-model="replaceValue.value"
              v-validate="'required'"
              :placeholder="$t('etl.columnValue')"
            ></input-verify>
            <svg-icon icon-class="go-right" class="arrow-icon"></svg-icon>
            <input-verify
              :name="replaceValue.id + '-1'"
              v-model="replaceValue.newValue"
              v-validate="'required'"
              :placeholder="$t('etl.replaceValue')"
            ></input-verify>
            <a href="javascript:void(0)" class="link remove-link"
              @click="removeReplaceValue(index)"
            >{{ $t('button.remove') }}</a>
          </div>
        </div>
        <button class="btn btn-outline"
          @click="addReplaceValue"
        >{{ $t('button.create') }}</button>
      </div>
    </div>
    <div class="submit-block">
      <div class="button-block">
        <button class="btn btn-default"
          @click="saveSetting"
        >{{ $t('button.keepSave') }}</button>
        <button class="btn btn-outline"
          @click="reset"
        >{{ $t('button.resumeDefault') }}</button>
      </div>
      <span class="remark-info">{{ $t('etl.remarkToSave') }}</span>
    </div>
  </div>
</template>
<script>
import { statsTypeOptionList, booleanOptionList } from '@/utils/general'
import InputVerify from '@/components/InputVerify'
import DefaultSelect from '@/components/select/DefaultSelect'
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
    }
  },
  data () {
    return {
      editColumnInfo: JSON.parse(JSON.stringify(this.columnInfo)),
      booleanOptionList,
      dataSummaryOption: [],
      categoryOptionList: [
        { value: 'CUSTOM', name: this.$t('etl.custom') }
      ],
      numericOptionList: [
        { value: 'max', name: this.$t('etl.maxValue') },
        { value: 'min', name: this.$t('etl.minValue') },
        { value: 'average', name: this.$t('etl.avgValue') },
        { value: 'standardDeviation', name: this.$t('etl.sdValue') },
        { value: 'sum', name: this.$t('etl.sumValue') },
        { value: 'CUSTOM', name: this.$t('etl.custom') }
      ],
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
      replaceId: 0
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
  },
  computed: {
    statsTypeOptions () {
      return statsTypeOptionList.filter((option) => {
        return this.editColumnInfo.originalStatsType === 'DATETIME'
          ? option
          : option.value !== 'DATETIME'
      })
    },
    replaceTypeOptionList () {
      return [
        { value: null, name: this.$t('etl.nullAction') },
        ...this.dataSummaryOption
      ]
    },
    replaceValueList () {
      return this.editColumnInfo.values.filter(element => {
        return (element.type !== 'MISSING_VALUE' && element.type !== 'ERROR_DEFAULT_VALUE')
      })
    },
    etlTableList () {
      return this.$store.state.dataManagement.etlTableList
    },
    currentTableIndex () {
      return this.$store.state.dataManagement.currentTableIndex
    },
    currentColumnIndex () {
      return this.$store.state.dataManagement.currentColumnIndex
    }
  },
  methods: {
    addReplaceValue () {
      this.editColumnInfo.values.push({
        ...this.replaceValueObjest,
        id: this.replaceId++
      })
    },
    removeReplaceValue (index) {
      this.editColumnInfo.values.splice(index + 3, 1)
    },
    saveSetting () {
      this.$validator.validateAll().then(result => {
        if (!result) return

        let numTypes = ['average', 'min', 'max', 'sum', 'standardDeviation']

        this.editColumnInfo.hasChanged = true
        this.editColumnInfo.values.forEach(el => {
          // 將自訂值指定為 newValue
          if (el.customValue) {
            el.newValue = el.customValue
            delete el.customValue
          }
          // Numeric型別時，將實際值指定給 newValue
          if (numTypes.includes(el.newValue)) {
            el.newValue = this.summaryData.data[1].data[numTypes]
          }
        })
        this.$emit('updateInfo', this.editColumnInfo)

        Message({
          message: this.$t('message.etlSettingTempSave'),
          type: 'success',
          duration: 3 * 1000
        })
      })
    },
    changeStatsType (column, targetStatsType) {
      column.statsType = targetStatsType
      switch (targetStatsType) {
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
      this.editColumnInfo.targetDataType = this.editColumnInfo.originalDataType
      this.cleanReplacements()

      this.updateSetting(this.editColumnInfo)
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
  }
}
</script>
<style lang="scss" scoped>
.setting-block {
  position: relative;
  height: 100%;
  .section-block {
    background: rgba(67, 76, 76, 0.95);
    border-radius: 5px;
    padding: 12px 16px;
    max-height: 544px;
    overflow: auto;
    margin-bottom: 12px;
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

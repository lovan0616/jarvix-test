<template>
  <div class="setting-block">
    <div class="section-block"
      :class="{'has-change': true}"
    >
      <div class="setting-input-block">
        <label class="input-label" for="">{{ $t('etl.dataType') }}</label>
        <default-select class="data-type-select"
          v-model="editColumnInfo.targetDataType"
          :option-list="dataTypeOptionList(editColumnInfo.originalDataType)"
          @change="changeDataType(editColumnInfo, editColumnInfo.targetDataType)"
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
          v-model="stringReplaceObject.newCustomValue"
          :placeholder="$t('etl.replaceValuePlaceholder')"
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
          v-model="nullReplaceObject.newCustomValue"
          :placeholder="$t('etl.replaceValuePlaceholder')"
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
          v-model="errorDefaultObject.newCustomValue"
          :placeholder="$t('etl.replaceValuePlaceholder')"
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
    </div>
  </div>
</template>
<script>
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
  data () {
    return {
      dataTypeList: [
        {
          name: 'FLOAT',
          value: 'FLOAT'
        },
        {
          name: 'STRING',
          value: 'STRING'
        },
        {
          name: 'INT',
          value: 'INT'
        },
        {
          name: 'DATETIME',
          value: 'DATETIME'
        },
        {
          name: 'BOOLEAN',
          value: 'BOOLEAN'
        }
      ],
      booleanOptionList: [
        {
          name: 'true',
          value: true
        },
        {
          name: 'false',
          value: false
        }
      ],
      replaceTypeOptionList: [
        // TODO 待API出來要再加上其他補值方式，例如常見值
        { value: null, name: '無動作' },
        { value: 'CUSTOM', name: '自訂' },
        { value: 'DROP', name: '刪除整列' }
      ],
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
    },
    editColumnInfo () {
      return this.etlTableList[this.currentTableIndex].columns[this.currentColumnIndex]
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
        if (result) {
          this.$emit('updateInfo', this.editColumnInfo)

          Message({
            message: this.$t('message.etlSettingTempSave'),
            type: 'success',
            duration: 3 * 1000
          })
        }
      })
    },
    dataTypeOptionList (type) {
      if (type === 'DATETIME') {
        return this.dataTypeList
      } else {
        return this.dataTypeList.filter(element => element.value !== 'DATETIME')
      }
    },
    changeDataType (column, dataType) {
      column.targetDataType = dataType
      switch (dataType) {
        case 'FLOAT':
        case 'INT':
          column.statsType = 'NUMERIC'
          break
        case 'STRING':
          column.statsType = 'CATEGORY'
          break
        case 'DATETIME':
          column.statsType = 'DATETIME'
          break
        case 'BOOLEAN':
          column.statsType = 'BOOLEAN'
          break
      }
    },
    reset () {}
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
    height: 297px;
    overflow: auto;
    margin-bottom: 12px;
  }
  .has-change {
    padding-bottom: 62px;
  }

  .setting-input-block {
    .input-label {
      display: block;
    }

    .replace-type-select {
      width: 40%;
      & + .input-verify {
        display: inline-block;
        height: 41px; // 與select高度對齊
        margin-left: 20px;
      }
    }
    & >>> .input-verify .input-verify-text {
      margin-bottom: 20px;
    }
  }

  .data-type-select, .replace-type-select {
    width: 40%;
    border-bottom: 1px solid;
    margin-bottom: 20px;

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
  }
}
</style>

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
        <input-verify
          name="stringReplaceObject"
          v-model="stringReplaceObject.newValue"
          :placeholder="$t('etl.replaceValuePlaceholder')"
        ></input-verify>
      </div>
      <div class="setting-input-block">
        <label class="input-label" for="">{{ $t('etl.nullReplaceValue') }}</label>
        <input-verify
          name="nullReplaceObject"
          v-model="nullReplaceObject.newValue"
          :placeholder="$t('etl.replaceValuePlaceholder')"
        ></input-verify>
      </div>
      <div class="setting-input-block">
        <label class="input-label" for="">{{ $t('etl.errorReplaceValue') }}</label>
        <input-verify
          name="errorDefaultObject"
          v-model="errorDefaultObject.newValue"
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
        >{{ $t('button.new') }}</button>
      </div>
    </div>
    <div class="submit-block">
      <button class="btn-m btn-default"
        @click="saveSetting"
      >{{ $t('button.keepSave') }}</button>
      <span class="remark-info">{{ $t('etl.remarkToSave') }}</span>
    </div>
  </div>
</template>
<script>
import InputVerify from '@/components/InputVerify'
import DefaultSelect from '@/components/select/DefaultSelect'

export default {
  name: 'SingleColumnSetting',
  inject: ['$validator'],
  props: {
    columnInfo: {
      type: Object,
      default: () => {}
    }
  },
  components: {
    InputVerify,
    DefaultSelect
  },
  data () {
    return {
      editColumnInfo: JSON.parse(JSON.stringify(this.columnInfo)),
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
      replaceValueObjest: {
        value: null,
        newValue: null,
        type: 'VALUE_REPLACEMENT',
        active: true
      },
      nullReplaceObject: null,
      stringReplaceObject: null,
      errorDefaultObject: null,
      replaceValueList: [],
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
    this.replaceValueList = this.editColumnInfo.values.filter(element => {
      if (element.type === 'MISSING_VALUE' && element.value === null) {
        this.nullReplaceObject = element
      } else if (element.type === 'MISSING_VALUE' && element.value === '') {
        this.stringReplaceObject = element
      } else if (element.type === 'ERROR_DEFAULT_VALUE' && element.value === null) {
        this.errorDefaultObject = element
      } else {
        return element
      }
    })
  },
  methods: {
    addReplaceValue () {
      this.replaceValueList.push({
        ...this.replaceValueObjest,
        id: this.replaceId++
      })
    },
    removeReplaceValue (index) {
      this.replaceValueList.splice(index, 1)
    },
    saveSetting () {
      this.$validator.validateAll().then(result => {
        if (result) {
          this.$emit('updateInfo', this.editColumnInfo)
        }
      })
    },
    dataTypeOptionList (type) {
      if (type === 'STRING') {
        return [
          {
            name: 'STRING',
            value: 'STRING'
          }
        ]
      } else {
        return [
          {
            name: type,
            value: type
          },
          {
            name: 'STRING',
            value: 'STRING'
          }
        ]
      }
    },
    changeDataType (column, dataType) {
      column.targetDataType = dataType
      column.targetStatsType = (dataType === 'STRING') ? 'CATEGORY' : column.originalStatsType
    }
  }
}
</script>
<style lang="scss" scoped>
.setting-block {
  position: relative;
  background: rgba(67, 76, 76, 0.95);
  border-radius: 5px;
  padding: 12px 16px;

  .has-change {
    padding-bottom: 62px;
  }

  .setting-input-block {
    .input-label {
      display: block;
    }

    & >>> .input-verify .input-verify-text {
      margin-bottom: 20px;
    }
  }

  .data-type-select {
    width: 100%;
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
    position: absolute;
    bottom: 0;
    left: 0;
    display: flex;
    align-items: center;
    width: 100%;
    background-color: rgba(67, 76, 76, 0.85);
    padding: 16px;

    .remark-info {
      font-size: 14px;
      color: #FFDF6F;
      margin-left: 8px;
    }
  }
}
</style>

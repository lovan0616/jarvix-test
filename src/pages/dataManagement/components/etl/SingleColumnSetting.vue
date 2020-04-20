<template>
  <div class="setting-block">
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
        
        :placeholder="$t('etl.replaceValuePlaceholder')"
      ></input-verify>
    </div>
    <div class="setting-input-block">
      <label class="input-label" for="">{{ $t('etl.nullReplaceValue') }}</label>
      <input-verify
        :placeholder="$t('etl.replaceValuePlaceholder')"
      ></input-verify>
    </div>
    <div class="setting-input-block">
      <label class="input-label" for="">{{ $t('etl.errorReplaceValue') }}</label>
      <input-verify
        :placeholder="$t('etl.replaceValuePlaceholder')"
      ></input-verify>
    </div>
    <div class="setting-input-block">
      <label class="input-label" for="">{{ $t('etl.customDataManagement') }}</label>
      <div class="input-list">
        <div class="inline-input-block">
          <input-verify
            :placeholder="$t('etl.columnValue')"
          ></input-verify>
          <svg-icon icon-class="go-right" class="arrow-icon"></svg-icon>
          <input-verify
            :placeholder="$t('etl.replaceValue')"
          ></input-verify>
          <a href="javascript:void(0)" class="link remove-link">{{ $t('button.remove') }}</a>
        </div>
      </div>
      <button class="btn btn-outline">{{ $t('button.addNew') }}</button>
    </div>
  </div>
</template>
<script>
import InputVerify from '@/components/InputVerify'
import DefaultSelect from '@/components/select/DefaultSelect'

export default {
  name: 'SingleColumnSetting',
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
      }
    }
  },
  mounted () {

  },
  methods: {
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
  background: rgba(67, 76, 76, 0.95);
  border-radius: 5px;
  padding: 12px 16px;

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
}
</style>

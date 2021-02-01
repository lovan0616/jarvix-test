<template>
  <div class="message-editor">
    <div class="message-editor__description">
      <div class="message-editor__param-examples">
        <div class="message-editor__param-item-example">{{ $t('alert.messageColumnParamSyntaxDescription') }}</div>
        <div class="message-editor__param-item-example">{{ $t('alert.messageIndicatorParamSyntaxDescription') }}</div>
      </div>
      <div class="message-editor__description-example">
        <div class="title">{{ $t('alert.messageExampleDescription') }}</div>
        <i18n
          path="alert.messageTemplateSettingExample"
          tag="div"
        >
          <span class="is-highlighted">{{ $t('alert.param1NameExample') }}</span>
          <span class="is-highlighted">{{ $t('alert.param2NameExample') }}</span>
        </i18n>
        <i18n
          path="alert.messageTemplatePreviewExample"
          tag="div"
        >
          <span class="is-highlighted">{{ $t('alert.param1ValueExample') }}</span>
          <span class="is-highlighted">{{ $t('alert.param2ValueExample') }}</span>
        </i18n>
      </div>
    </div>
    <div class="message-editor__setting">
      <div
        v-for="(message, lang) in messageOfAllLangs"
        :key="lang"
        class="input-field"
      >
        <label class="input-field__label">{{ languages[lang] + $t('alert.alertMessageContent') }}</label>
        <div class="params-helper">
          <default-select
            :option-list="paramOptions"
            :placeholder="$t('alert.insertColumnAsParams')"
            class="params-helper__selector"
            @change="insertParam(lang, $event)"
          />
        </div>
        <div class="input-field__input">
          <input-block
            v-model="message.message"
            :placeholder="$t('alert.enterAlertMessage')"
          />
        </div>
      </div>
    </div>
    <div
      v-if="isEdit"
      class="message-editor__action"
    >
      <button
        :disabled="isProcessing"
        class="btn btn-outline"
        @click="$emit('close')"
      >{{ $t('button.cancel') }}</button>
      <button 
        :disabled="isProcessing"
        class="btn btn-default"
        @click="patchAlertMessage"
      >{{ $t('button.save') }}</button>
    </div>
  </div>
</template>

<script>
import InputBlock from '@/components/InputBlock'
import DefaultSelect from '@/components/select/DefaultSelect'
import { Message } from 'element-ui'
import { patchConditionMessageParams } from '@/API/Alert'
import { getDataFrameColumnInfoById } from '@/API/DataSource'
import { mapState, mapGetters } from 'vuex'

export default {
  name: 'AlertConditionMessageEditor',
  components: {
    InputBlock,
    DefaultSelect
  },
  props: {
    conditionId: {
      type: Number,
      default: null
    },
    condition: {
      type: Object,
      default: null
    },
    propParamOptions: {
      type: Array,
      default: () => null
    },
    isEdit: {
      // 再編輯示警訊息
      type: Boolean,
      default: false
    },
    isManualSetPropOptions: {
      // 手動組參數選項（例：元件轉示警）
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      messageOfAllLangs: null,
      messageOfAllLangsAsArray: [],
      isProcessing: false,
      isLoadingpropParamOptions: false,
      localParamOptions: []
    }
  },
  computed: {
    ...mapGetters('userManagement', ['hasPermission']),
    ...mapState('setting', ['locale', 'languages']),
    paramOptions () {
      return this.propParamOptions || this.localParamOptions
    }
  },
  watch: {
    conditionId (id) {
      // 當外層創建示警條件後，這邊會拿到 condition id，要去 PATCH 示警訊息
      if (typeof id === 'number') this.patchAlertMessage()
    },
    propParamOptions: {
      deep: true,
      handler () {
        this.initMessageTemplates()
      }
    }
  },
  created () {
    this.initMessageTemplates()
    if (this.isEdit && !this.isManualSetPropOptions) this.fetchDataColumnList()
  },
  methods: {
    initMessageTemplates () {
      this.messageOfAllLangs = {
        'zh-TW': { message: this.condition ? this.condition.alertMessageTW : '' },
        'zh-CN': { message: this.condition ? this.condition.alertMessageCN : '' },
        ...(this.hasPermission('english_ui') && {'en-US': { message: this.condition ? this.condition.alertMessageUS : '' }})
      }
    },
    insertParam (lang, id) {
      const param = this.paramOptions.find(item => item.value === id)
      const sign = param.type === 'indicator' ? '#' : '$'
      this.messageOfAllLangs[lang].message += sign + '{' + param.originalName + '}'
    },
    formatPatchMessageParams () {
      this.messageOfAllLangsAsArray = []
      for (let language in this.messageOfAllLangs) {
        const message = this.messageOfAllLangs[language].message
        if (message.length > 0) {
          const columnTypeRegex = /\${.*?}/g
          const indicatorTypeRegex = /#{.*?}/g
          const columnTypeParamTokens = message.match(columnTypeRegex) || []
          const indicatorTypeParamTokens = message.match(indicatorTypeRegex) || []
          const columnTypeParams = columnTypeParamTokens.map(item => item.substring(2, item.length - 1))
          this.messageOfAllLangsAsArray.push({
            language: language.replace('-', '_'),
            message: columnTypeParamTokens.length > 0 || indicatorTypeParamTokens.length > 0 ? this.formatMessage(message, columnTypeParamTokens, indicatorTypeParamTokens) : message,
            dataColumnIds: this.getColumnIdsByColumnNames(columnTypeParams)
          })
        }
      }
    },
    formatMessage (message, columnTypeParamTokens, indicatorTypeParamTokens) {
      columnTypeParamTokens.forEach(match => message = message.replace(match, '${}'))
      indicatorTypeParamTokens.forEach(match => {
        message = message.replace(match, match.replace('#', '$'))
        const indicatorText = match.substring(2, match.length - 1)
        const indicatorKey = this.propParamOptions.find(param => param.type === 'indicator' && param.name === indicatorText).value
        message = message.replace(indicatorText, indicatorKey)
      })
      return message
    },
    getColumnIdsByColumnNames (columnNames) {
      return columnNames.reduce((acc, cur) => {
        const column = this.paramOptions.find(item => item.type === 'column' && item.originalName === cur)
        return column ? acc.concat(column.value) : acc
      }, [])
    },
    fetchDataColumnList () {
      this.isLoadingpropParamOptions = true

      // 清空原資料
      this.localParamOptions = []

      const hasFeatureColumn = true
      const hasBlockClustering = false
      getDataFrameColumnInfoById(this.condition.dataFrameId, hasFeatureColumn, false, hasBlockClustering).then(response => {
        this.localParamOptions = response.reduce((acc, cur) => {
          acc.push({
            type: 'column',
            name: `${cur.primaryAlias || cur.name}（${cur.statsType}）`,
            value: cur.id,
            originalName: cur.primaryAlias  || cur.name,
          })
          return acc
        }, [])
      })
      .finally(() => this.isLoadingpropParamOptions = false)
    },
    patchAlertMessage () {
      this.formatPatchMessageParams()
      if (this.messageOfAllLangsAsArray.length === 0) {
        if (this.isEdit) {
          return Message({
            message: this.$t('miniApp.allMessageSettingsAreEmpty'),
            type: 'warning',
            duration: 3 * 1000,
            showClose: true
          })
        }
        return this.$emit('done')
      }

      const patchPromises = this.messageOfAllLangsAsArray.map(item => patchConditionMessageParams(this.conditionId || this.condition.id, item))
      Promise.all(patchPromises)
        .then(() => {
          Message({
            message: this.$t('alert.alertMessageSuccessfullyPatched'),
            type: 'success',
            duration: 3 * 1000,
            showClose: true
          })
        })
        .catch(() => {})
        .finally(() => this.$emit('done'))
    }
  }
}
</script>

<style lang="scss" scoped>
.message-editor .message-editor {
  &__description {
    font-size: 14px;
    line-height: 1.5;
    &-example {
      padding: 16px;
      margin-top: 8px;
      margin-bottom: 16px;
      background: rgba(0, 0, 0, 0.55);
      border-radius: 5px;
      .title {
        font-weight: bold;
      }
      .is-highlighted {
        color: $theme-color-warning;
      }
    }
  }
  &__param-examples {
    display: flex;
  }
  &__param-item-example {
    &:not(:last-of-type) {
      margin-right: 16px;
    }
  }
  &__setting {
    .input-field {
      position: relative;
      background: rgba(72, 84, 84, 0.95);
      border-radius: 8px;
      padding: 16px 20px;
      &:not(:last-of-type) {
        margin-bottom: 16px;
      }
      &__input {
        /deep/ .input-block .input {
          &::placeholder {
            font-size: 14px;
          }
        }
      }
      &__label {
        font-size: 14px;
      }
      /deep/ .params-helper {
        position: absolute;
        top: 16px;
        right: 16px;
        cursor: pointer;
        &__selector {
          .el-input__inner {
            text-align: right;
            font-size: 14px;
            padding-right: 0;
            &::placeholder {
              color: $theme-color-primary;
            }
          }
          .el-input__suffix {
            display: none;
          }
        }
      }
    }
  }
  &__action {
    display: flex;
    justify-content: flex-end;
    margin-top: 24px;

    .btn:not(:last-child) {
      margin-right: 20px;
    }
  }
}
</style>
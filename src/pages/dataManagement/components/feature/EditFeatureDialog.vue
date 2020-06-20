<template>
  <div class="edit-feature-dialog full-page-dialog">
    <div class="dialog-container">
      <div class="dialog-title">
        {{ $t('feature.createFeature') }}
      </div>
      <div class="feature-block">
        <div class="block-title">Step1: {{ $t('editing.chooseDataFrame') }}</div>
        <div 
          :class="{'has-error': errors.has('dataFrameName')}"
          class="input-block name"
        >
          <default-select 
            v-validate="'required'"
            v-model="featureInfo.dataFrameId"
            :option-list="dataFrameList"
            :placeholder="$t('editing.chooseDataFrame')"
            class="data-frame-select"
            name="dataFrameName"
            @change="getDataFrameColumnInfo"
          />
          <div 
            v-show="errors.has('dataFrameName')"
            class="error-text"
          >{{ errors.first('dataFrameName') }}</div>
        </div>
      </div>
      <div class="feature-block">
        <div class="block-title">Step2: {{ $t('feature.featureColumnName') }}（{{ $t('editing.isRequired') }}）</div>
        <div class="input-block name">
          <input-block
            v-validate="`required|max:${max}`"
            v-model="featureInfo.name"
            name="featureName"
          />
        </div>
      </div>
      <div class="feature-block">
        <div class="block-title">Step3: {{ $t('feature.featureSetting') }}（{{ $t('editing.isRequired') }}）</div>
        <!-- <div class="setting">
          <div class="rule">{{ $t('feature.value') }} = <span class="token value">100</span></div>
          <div class="rule">{{ $t('feature.columnValue') }} = <span class="token column">“{{ $t('editing.columnName') }}”</span></div>
          <div class="rule">{{ $t('feature.plus') }} = <span class="token operator">+</span></div>
          <div class="rule">{{ $t('feature.minus') }} = <span class="token operator">-</span></div>
          <div class="rule">{{ $t('feature.multiple') }} = <span class="token operator">*</span></div>
          <div class="rule">{{ $t('feature.divide') }} = <span class="token operator">/</span></div>
        </div>
        <div class="setting last">
          <div class="rule">{{ $t('feature.parentheses') }} = <span class="token bracket">(</span><span class="token bracket">)</span></div>
          <div class="rule">{{ $t('feature.bracket') }} = <span class="token bracket">[</span><span class="token bracket">]</span></div>
          <div class="rule">{{ $t('feature.braces') }} = <span class="token bracket">{</span><span class="token bracket">}</span></div>
        </div>
        <div class="hint-info-block">
          <span class="hint-title"><svg-icon icon-class="lamp"></svg-icon> {{ $t('feature.hint') }}:</span>
          <span
            v-for="(rule, index) in $t('feature.forbiddenRule')"
            :key="index"
          >{{ rule }}</span>
        </div> -->
        <hint-info-block
          :msg-list="[$t('feature.chooseOptionHint'), $t('feature.maxColumn', {number: 3})]"
        />
        <!-- <div class="hint-info-block">
          <div class="hint-info"><span class="hint-title"><svg-icon icon-class="lamp"/> {{ $t('feature.hint') }}:</span>{{ $t('feature.chooseOptionHint') }}</div>
          <div class="hint-info"><span class="hint-title"><svg-icon icon-class="lamp"/> {{ $t('feature.hint') }}:</span>{{ $t('feature.maxColumn', {number: 3}) }}</div>
        </div> -->
        <div class="setting">
          <div class="rule">{{ $t('feature.value') }}: <span 
            class="token value"
            @click="setOption('numeric', null)"
          >100</span></div>
          <div class="rule">{{ $t('feature.columnValue') }}: <span 
            class="token column"
            @click="setOption('column', null)"
          >“{{ $t('editing.columnName') }}”</span></div>
          <div class="rule">{{ $t('feature.plus') }}: <span 
            class="token operator"
            @click="setOption('operator', '+')"
          >+</span></div>
          <div class="rule">{{ $t('feature.minus') }}: <span 
            class="token operator"
            @click="setOption('operator', '-')"
          >-</span></div>
          <div class="rule">{{ $t('feature.multiple') }}: <span 
            class="token operator"
            @click="setOption('operator', '*')"
          >*</span></div>
          <div class="rule">{{ $t('feature.divide') }}: <span 
            class="token operator"
            @click="setOption('operator', '/')"
          >/</span></div>
        </div>
        <div class="setting last">
          <div class="rule">{{ $t('feature.parentheses') }}: <span 
            class="token bracket"
            @click="setOption('operator', '(')"
          >(</span><span 
            class="token bracket"
            @click="setOption('operator', ')')"
          >)</span></div>
        </div>
        <div 
          class="feature-input-block">
          <div
            v-if="featureFormula.length === 0"
            class="placeholder"
          >{{ $t('feature.inputPlaceholder') }}</div>
          <draggable 
            v-model="featureFormula"
            class="feature-container"
            @start="drag=true"
            @end="drag=false"
          >
            <div 
              v-for="(element, index) in featureFormula"
              :key="index"
              class="operator"
            >
              <template
                v-if="element.type === 'column'"
              >
                <default-select
                  v-model="element.value"
                  :option-list="numericColumnList"
                  :placeholder="$t('editing.chooseDataColumn')"
                  class="data-column-select"
                />
              </template>
              <template
                v-else-if="element.type === 'numeric'"
              >
                <input-block
                  :name="element.value + '-' + index"
                  :placeholder="$t('editing.numericOnly')"
                  v-model="element.value"
                  class="numeric-input"
                  type="number"
                />
              </template>
              <template
                v-else
              >
                {{ element.value }}
              </template>
              <a 
                href="javascript:void(0)" 
                class="delete-btn"
                @click="removeOption(index)"
              >
                <svg-icon 
                  icon-class="close" 
                  class="delete-icon"/>
              </a>
            </div>
          </draggable>
        </div>
      </div>
      <div class="button-block">
        <button 
          class="btn btn-outline"
          @click="cancelEdit"
        >{{ $t('button.cancel') }}</button>
        <button 
          class="btn btn-default"
          @click="saveFeature"
        >{{ $t('button.create') }}</button>
      </div>
    </div>
  </div>
</template>
<script>
import DefaultSelect from '@/components/select/DefaultSelect'
import InputBlock from '@/components/InputBlock'
import HintInfoBlock from '@/components/display/HintInfoBlock'
import { getDataFrameById, getDataFrameColumnInfoById } from '@/API/DataSource'
import { createCustomFeature, updateCustomFeature } from '@/API/Feature'
import { Message } from 'element-ui'
import draggable from 'vuedraggable'

export default {
  name: 'EditFeatureDialog',
  inject: ['$validator'],
  components: {
    DefaultSelect,
    InputBlock,
    draggable,
    HintInfoBlock
  },
  props: {
    editFeatureInfo: {
      type: Object,
      default: () => {}
    }
  },
  data () {
    return {
      dataFrameList: [],
      dataSourceId: parseInt(this.$route.params.id),
      featureInfo: {
        dataColumnIdList: [],
        dataFrameId: null,
        dataSourceId: parseInt(this.$route.params.id),
        name: null,
        description: null,
        operator: null
      },
      numericColumnList: [],
      featureFormula: []
    }
  },
  computed: {
    max () {
      return this.$store.state.validation.fieldCommonMaxLength
    }
  },
  mounted () {
    if (this.editFeatureInfo) {
      this.featureInfo = this.editFeatureInfo
      this.featureFormula = JSON.parse(this.editFeatureInfo.description)
      this.getDataFrameColumnInfo(this.featureInfo.dataFrameId)
    }
    this.getDataFrameList()
  },
  methods: {
    getDataFrameList () {
      getDataFrameById(this.dataSourceId).then(response => {
        this.dataFrameList = response.map(element => {
          return {
            name: element.primaryAlias,
            value: element.id
          }
        })
      })
    },
    getDataFrameColumnInfo (value) {
      // 過濾掉特徵欄位
      let hasFeature = false
      getDataFrameColumnInfoById(value, hasFeature).then(response => {
        // 只能選擇數值類型的欄位
        this.numericColumnList = response.filter(element => {
          return element.dataType === 'INT' || element.dataType === 'FLOAT'
        }).map(element => {
          return {
            ...element,
            value: element.id
          }
        })
      })
    },
    setOption (type, value) {
      this.featureFormula.push({
        type,
        value
      })
    },
    removeOption (index) {
      this.featureFormula.splice(index, 1)
    },
    validFeatureFormula () {
      let validateMsg = ''
      const columnList = this.featureFormula.filter(element => element.type === 'column')
      const numericList = this.featureFormula.filter(element => element.type === 'numeric')
      if(columnList.some(element => element.value === null))
        validateMsg = this.$t('message.emptyDataColumn')
      if(columnList.length == 0)
        validateMsg = this.$t('message.emptyColumn')
      if(this.featureFormula.length == 0)
        validateMsg = this.$t('message.emptyFeatureFormula')
      if (numericList.some(element => element.value === null || element.value === ''))
        validateMsg = this.$t('message.emptyNumeric')
      if(validateMsg) {
        Message({
          message: validateMsg,
          type: 'error',
          duration: 3 * 1000
        })
        return false
      }
      return true
    },
    saveFeature () {
      this.$validator.validateAll().then(result => {
        if (result) {
          this.featureInfo.description = JSON.stringify(this.featureFormula)
          this.featureInfo.dataColumnIdList = this.featureFormula.filter(element => element.type === 'column').map(element => element.value)
          this.featureInfo.operator = this.featureFormula.reduce((acc, cur) => {
            if (cur.type === 'column') {
              return acc + '#column'
            } else {
              return acc + cur.value
            }
          }, '')

          if (!this.validFeatureFormula()) return

          let promise = this.featureInfo.id ? updateCustomFeature(this.featureInfo) : createCustomFeature(this.featureInfo)
          promise.then(() => {
            Message({
              message: this.$t('message.saveSuccess'),
              type: 'success',
              duration: 3 * 1000
            })
            this.$emit('update')
          }).catch(() => {})
        }
      })
    },
    cancelEdit () {
      this.$emit('cancel')
    }
  }
}
</script>
<style lang="scss" scoped>
.edit-feature-dialog {
  .feature-block {
    padding: 24px;
    background-color: rgba(50, 58, 58, 0.95);
    border-radius: 5px;
    margin-bottom: 12px;

    &:last-child {
      margin-bottom: 16px;
    }

    .block-title {
      font-weight: 600;
      font-size: 18px;
      line-height: 1;
      margin-bottom: 10px;
    }

    & >>> .input-block {

      &.name {
        width: 300px;
      }

      &.has-error {
        .data-frame-select {
          border-color: $theme-color-danger;
        }

        .error-text {
          bottom: -10px;
        }
      }
    }

    .data-frame-select {
      width: 100%;
      border-bottom: 1px solid #fff;
    }
  }

  .setting {
    font-size: 14px;
    line-height: 1;
    display: flex;
    flex-wrap: wrap;
    margin-bottom: 8px;

    &.last {
      margin-bottom: 16px;
    }

    .rule {
      display: flex;
      align-items: center;
      margin-right: 20px;
    }
  }

  .token {
    min-width: 40px;
    padding: 8px 8px;
    background: rgba(0, 0, 0, 0.55);
    border-radius: 5px;
    font-size: 16px;
    margin-left: 4px;
    cursor: pointer;
    transition: transform 0.3s;
    text-align: center;

    &:hover {
      transform: translateY(-3px);
    }

    &.value {
      color: #FF9559;
    }
    &.column {
      color: #FFDF6F;
    }
    &.operator {
      color: #44D2FF;
    }
    &.bracket {
      color: #CA66DA;
    }
  }

  .feature-input-block {
    width: 100%;
    line-height: 40px;
    border-bottom: 1px solid #fff;
    padding: 8px 0;
    position: relative;

    .placeholder {
      color: #aaa;
    }
  }

  .feature-container {
    width: 100%;
    display: flex;
    align-items: center;

    .operator {
      position: relative;
      min-width: 40px;
      text-align: center;
      background-color: rgba(0, 0, 0, 0.15);
      border-radius: 5px;
      transition: color 0.3s;
      cursor: move;
      transition: background-color 0.3s;

      &:hover {
        background-color: rgba(0, 0, 0, 0.55);

        .delete-btn {
          display: flex;
        }
      }

      &:not(:last-child) {
        margin-right: 8px;
      }

      .delete-btn {
        position: absolute;
        top: -6px;
        right: -6px;
        width: 16px;
        height: 16px;
        display: none;
        justify-content: center;
        align-items: center;
        background-color: $button-color;
        border-radius: 50px;
      }
      .delete-icon {
        color: #fff;
        width: 6px;
      }
    }
  }

  .numeric-input {
    padding: 0 15px;

    & >>> .input {
      width: 130px;
      border: none;
    }
  }

  .button-block {
    display: flex;
    justify-content: flex-end;
    padding-bottom: 64px;

    .btn:not(:last-child) {
      margin-right: 20px;
    }
  }
}
</style>

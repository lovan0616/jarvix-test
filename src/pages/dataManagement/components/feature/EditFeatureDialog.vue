<template>
  <div class="edit-feature-dialog full-page-dialog">
    <div class="dialog-container">
      <div class="dialog-title">
        {{ $t('feature.createFeature') }}
      </div>
      <div class="feature-block">
        <div class="block-title">{{ $t('editing.tableName') }}</div>
        {{ currentDataFrameInfo.name }}
      </div>
      <div class="feature-block">
        <div class="block-title">Step1: {{ $t('feature.featureColumnName') }}（{{ $t('editing.isRequired') }}）</div>
        <div class="input-block name">
          <input-block
            v-validate="`required|max:${max}`"
            v-model="featureInfo.name"
            name="featureName"
          />
        </div>
      </div>
      <div class="feature-block">
        <div class="block-title">Step2: {{ $t('feature.featureSetting') }}（{{ $t('editing.isRequired') }}）</div>
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
          :disabled="isLoading"
          class="btn btn-default"
          @click="saveFeature"
        >
          <span v-if="isLoading"><svg-icon icon-class="spinner"/>{{ $t('button.processing') }}</span>
          <span v-else>{{ $t('button.create') }}</span>
        </button>
      </div>
    </div>
  </div>
</template>
<script>
import DefaultSelect from '@/components/select/DefaultSelect'
import InputBlock from '@/components/InputBlock'
import HintInfoBlock from '@/components/display/HintInfoBlock'
import { getDataFrameColumnInfoById } from '@/API/DataSource'
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
    },
    currentDataFrameInfo: {
      type: Object,
      default: () => { 
        return {
          name: '',
          value: null
        }
      }
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
      featureFormula: [],
      isLoading: false
    }
  },
  computed: {
    max () {
      return this.$store.getters['validation/fieldCommonMaxLength']
    }
  },
  mounted () {
    if (this.editFeatureInfo) {
      this.featureInfo = this.editFeatureInfo
      this.featureFormula = JSON.parse(this.editFeatureInfo.description)
      this.getDataFrameColumnInfo(this.featureInfo.dataFrameId)
      this.dataSourceId = this.editFeatureInfo.dataSourceId
    } else {
      this.featureInfo.dataFrameId = this.currentDataFrameInfo.value
      this.getDataFrameColumnInfo (this.featureInfo.dataFrameId)
    } 
  },
  methods: {
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
          duration: 3 * 1000,
          showClose: true
        })
        return false
      }
      return true
    },
    saveFeature () {
      if (this.isLoading) return
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

          this.isLoading = true
          let promise = this.featureInfo.id ? updateCustomFeature(this.featureInfo) : createCustomFeature(this.featureInfo)
          promise.then(() => {
            Message({
              message: this.$t('message.saveSuccess'),
              type: 'success',
              duration: 3 * 1000,
              showClose: true
            })
            this.$emit('update', { dataFrameId: this.featureInfo.dataFrameId })
          }).catch(() => {}).finally(() => {
            this.isLoading = false
          })
        }
      })
    },
    cancelEdit () {
      this.$emit('cancel')
    }
  }
}
</script>

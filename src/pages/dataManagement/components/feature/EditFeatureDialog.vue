<template>
  <div class="edit-feature-dialog full-page-dialog">
    <div class="dialog-container">
      <div class="dialog-title">
        {{ $t('editing.createFeature') }}
      </div>
      <div class="feature-block">
        <div class="block-title">Step1: {{ $t('editing.chooseDataFrame') }}</div>
        <div class="input-block">
          <default-select class="data-frame-select"
            v-model="featureInfo.dataFrameId"
            :option-list="dataFrameList"
            v-validate="'required'"
          ></default-select>
        </div>
      </div>
      <div class="feature-block">
        <div class="block-title">Step2: {{ $t('editing.featureColumnName') }}（{{ $t('editing.isRequired') }}）</div>
        <div class="input-block">
          <input-block
            v-model="featureInfo.name"
            v-validate="'required'"
          ></input-block>
        </div>
      </div>
      <div class="feature-block">
        <div class="block-title">Step3: {{ $t('editing.featureSetting') }}（{{ $t('editing.isRequired') }}）</div>
        <div class="input-container">
          
        </div>
        <div class="setting">
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
        </div>
      </div>
      <div class="button-block">
        <button class="btn btn-outline">{{ $t('button.cancel') }}</button>
        <button class="btn btn-default">{{ $t('button.create') }}</button>
      </div>
    </div>
  </div>
</template>
<script>
import DefaultSelect from '@/components/select/DefaultSelect'
import InputBlock from '@/components/InputBlock'
import { getDataFrameById } from '@/API/DataSource'

export default {
  name: 'EditFeatureDialog',
  props: {
    featureId: {
      type: Number,
      default: null
    }
  },
  components: {
    DefaultSelect,
    InputBlock
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
        operator: null
      }
    }
  },
  mounted () {
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

    .input-block {
      width: 300px;
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
      margin-right: 12px;
    }
  }

  .token {
    padding: 6px 8px;
    background: rgba(0, 0, 0, 0.55);
    border-radius: 5px;
    margin-left: 4px;

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

  .hint-info-block {
    background-color: rgba(0, 0, 0, 0.55);
    border-radius: 5px;
    padding: 11px;
    font-size: 14px;
    line-height: 1;

    .hint-title {
      color: #FFDF6F;
    }
  }

  .button-block {
    display: flex;
    justify-content: flex-end;

    .btn:not(:last-child) {
      margin-right: 20px;
    }
  }
}
</style>

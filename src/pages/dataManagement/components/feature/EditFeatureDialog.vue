<template>
  <div class="edit-feature-dialog full-page-dialog">
    <div class="dialog-container">
      <div class="dialog-title">
        {{ $t('editing.createFeature') }}
        
      </div>
      <div class="feature-block">
        <div class="block-title">Step1: {{ $t('editing.chooseDataFrame') }}</div>
        <div class="select-block">
          <default-select class="data-frame-select"
            v-validate="'required'"
          ></default-select>
        </div>
      </div>
      <div class="feature-block">
        <div class="block-title">Step2: {{ $t('editing.featureColumnName') }}（{{ $t('editing.isRequired') }}）</div>
      </div>
      <div class="feature-block">
        <div class="block-title">Step3: {{ $t('editing.featureSetting') }}（{{ $t('editing.isRequired') }}）</div>
      </div>
    </div>
  </div>
</template>
<script>
import DefaultSelect from '@/components/select/DefaultSelect'

export default {
  name: 'EditFeatureDialog',
  components: {
    DefaultSelect
  },
  data () {
    return {
      dataFrameList: [],
      dataSourceId: null,
      featureInfo: {
        dataColumnIdList: [
          0
        ],
        dataFrameId: 0,
        dataSourceId: 0,
        name: null,
        operator: null
      }
    }
  },
  mounted () {

  },
  methods: {
    getDataFrameList () {

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
    }
  }
}
</style>

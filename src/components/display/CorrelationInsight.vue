<template>
  <div class="insight-wrapper">
    <div class="title">
      <svg-icon
        :icon-class="'len-with-line-chart'"
      />
      {{ $t('resultDescription.dataInsight') }}
    </div>
    <div
      v-if="info"
      class="info"
      v-html="textTransform(info)"
    />
    <div
      class="insight-wrapper__body"
      v-if="subComponents.length"
    >
      <div
        class="insight"
        v-for="(insight, insightIndex) in subComponents"
        :key="insightIndex"
      >
        <p
          class="insight__description"
          v-for="(description, index) in insight.dataset.descriptions"
          :key="index"
        >
          {{ insight.dataset.descriptions.length > 1 ? (index + 1) + '. ' + description : description }}
        </p>
        <div class="insight__chart">
          <DisplayBarChart
            :is-show-legend="isShowLegend"
            :is-show-toolbox="isShowToolbox"
            :dataset="insight.dataset"
            :height="height"
            :title="insight.title"
          />
        </div>
      </div>
    </div>
    <div
      class="insight-wrapper__body"
      v-else
    >
      <div class="insight">
        <p
          class="insight__description"
          v-for="(description, index) in dataset.descriptions"
          :key="index"
        >
          {{ dataset.descriptions.length > 1 ? (index + 1) + '. ' + description : description }}
        </p>
        <div class="insight__chart">
          <DisplayBarChart
            :is-show-legend="isShowLegend"
            :is-show-toolbox="isShowToolbox"
            :dataset="dataset"
            :height="height"
            :has-pagination="hasPagination"
            :arrow-btn-right="arrowBtnRight"
            :title="title"
          />
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'CorrelationInsight',
  props: {
    info: {
      type: String,
      default: null
    },
    dataset: {
      type: Object,
      default: () => {}
    },
    subComponents: {
      type: Array,
      default: () => []
    },
    title: {
      type: Object,
      default: () => {}
    },
    isShowLegend: {
      type: Boolean,
      default: true
    },
    isShowToolbox: {
      type: Boolean,
      default: true
    },
    height: { type: String, default: '300px' }
  },
  methods: {
    textTransform (text) {
      return this.info ? text.replace('^2', '<sup>2</sup>') : ''
    }
  }
}
</script>
<style lang="scss" scoped>
.insight-wrapper {
  background-color: #141c1d;
  border-radius: 8px;
  padding: 16px;
  line-height: 24px;
  color: #ccc;
  .title {
    font-size: 18px;
    color: #eee;
  }

  .info {
    padding: 10px;
  }

  .info ~ .insight-wrapper__body {
    .insight {
      border-top: 1px solid #52696a;
    }
  }

  .insight {
    display: flex;
    &__description {
      width: 35%;
      padding: 10px;
      font-size: 13px;
      line-height: 24px;
    }
    &__chart {
      flex: 1;
    }
  }
}
</style>

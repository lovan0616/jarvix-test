<template>
  <div class="insight-wrapper">
    <div class="insight-wrapper__title">
      <svg-icon
        :icon-class="titleIconName"
      />
      {{ $t('resultDescription.dataInsight') }}
    </div>
    <div class="insight-wrapper__body">
      <div class="insight__description">
        <p
          v-for="(description, index) in dataset.descriptions"
          :key="index"
          class="insight__description--item"
        >
          {{ dataset.descriptions.length > 1 ? (index + 1) + '. ' + description : description }}
        </p>
      </div>
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
</template>

<script>
import DisplayBarChart from '@/components/display/DisplayBarChart'

export default {
  name: 'DisplayDifferenceInsight',
  components: {
    DisplayBarChart
  },
  props: {
    dataset: {
      type: Object,
      default: () => ({})
    },
    isShowLegend: {
      type: Boolean,
      default: true
    },
    isShowToolbox: {
      type: Boolean,
      default: true
    },
    titleIconName: {
      type: String,
      default: 'len-with-line-chart'
    },
    title: {
      type: Object,
      default: () => ({})
    },
    height: { type: String, default: '300px' },
    hasPagination: {
      type: Boolean,
      default: false
    },
    arrowBtnRight: {
      type: Number,
      default: 80
    }
  }
}
</script>

<style lang="scss" scoped>
.insight-wrapper {
  background-color: #141c1d;
  padding: 20px;
  border-radius: 8px;
  &__title {
    font-size: 18px;
  }
  &__body {
    display: flex;
  }
}

.insight {
  &__chart {
    flex: 1;
  }
  &__description {
    width: 35%;
    padding: 10px;
    &--item {
      font-size: 13px;
      line-height: 24px;
    }
  }
}
</style>

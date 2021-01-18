<template>
  <div 
    v-if="featureInfoList.length > 0"
    class="feature-information-block"
  >
    <div
      v-for="(feature, index) in featureInfoList"
      :key="index"
      class="single-feature feature"
    >
      <div class="feature__title">{{ $t(`chart.feature.${feature.name}`) }}</div>
      <div class="feature__value">{{ feature.value === 'Infinity' ? '&#8734;' : formatComma(roundNumber(feature.value, 4)) }}</div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'FeatureInformationBlock',
  props: {
    featureInformation: {
      type: Object,
      default: () => ({})
    }
  },
  data () {
    return {
      featureInfoList: []
    }
  },
  mounted () {
    this.featureInfoList = Object.keys(this.featureInformation).map((name) => {
      return {
        name: name,
        value: this.featureInformation[name]
      }
    })
  }
}
</script>
<style lang="scss" scoped>
.feature-information-block {
  display: flex;
  flex-wrap: wrap;
  width: 100%;
  margin-top: 16px;
  padding: 8px 20px;
  background: #141C1D;
  border-radius: 8px;

  .feature {
    display: flex;
    flex-direction: row;
    margin: 8px 0;
    width: 25%;
    min-width: 130px;
    color: #DDDDDD;

    &__title {
      margin-right: 8px;
      max-width: 130px;
      font-weight: 600;
      font-size: 14px;
      line-height: 24px;
    }

    &__value {
      flex: 1;
      font-size: 14px;
      line-height: 24px;
      color: #CCCCCC;
    }
  }
}

</style>

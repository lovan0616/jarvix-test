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
      <div class="feature__value">{{ formatFeatureValue(feature.value) }}</div>
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
      featureInfoList: [],
      PValueOrderList: [
        "clusteringPValue", "mixturesPValue", "trendsPValue", "oscillationPValue"
      ]
    }
  },
  mounted () {
    let isNeedOrder = false
    this.featureInfoList = Object.keys(this.featureInformation).map((name) => {
      isNeedOrder = this.PValueOrderList.includes(name)
      return {
        name: name,
        value: this.featureInformation[name]
      }
    })
    if (isNeedOrder) this.featureInfoList.sort((a,b) => this.PValueOrderList.findIndex(name => name === a.name) - this.PValueOrderList.findIndex(name => name === b.name))
  },
  methods: {
    formatFeatureValue (val) {
      if (val === null || typeof val === 'string') return `${val}`
      return this.formatComma(this.roundNumber(val, 4))
    }
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
  overflow-y: auto;
  
  .feature {
    display: flex;
    flex-direction: row;
    margin: 8px 8px 8px 0;
    width: 22%;
    min-width: 130px;
    color: #DDDDDD;

    &__title {
      margin-right: 8px;
      max-width: 130px;
      font-weight: 600;
      font-size: 14px;
      line-height: 16px;
      display: inline-flex;
      align-items: center;
      overflow: hidden;
      // @include text-hidden;
    }

    &__value {
      display: inline-flex;
      align-items: center;
      flex: 1;
      min-width: 50px;
      font-size: 14px;
      line-height: 16px;
      color: #CCCCCC;
    }
  }
}

</style>

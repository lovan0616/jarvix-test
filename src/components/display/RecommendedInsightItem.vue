<template>
  <div class="recommended-insights__card">
    <div class="card__header">
      <div class="header__title">{{ title }}</div>
      <button 
        class="header__link btn btn-outline" 
        @click="learnMore">{{ $t('editing.moreInfo') }}</button>
    </div>
    <div class="card__body">
      <!-- 有API之後這邊會改成動態組件 -->
      <task
        :component-id="197209"
        :show-toolbox="false"
        :custom-chart-style="customChartStyle"
      />
    </div>
  </div>
</template>

<script>
export default {
  name: 'RecommendedInsightItem',
  data () {
    return {
      title: 'wood', // TODO 串API
      customChartStyle: {
        width: '100%',
        height: '240px'
      }
    }
  },
  methods: {
    learnMore () {
      this.$store.commit('dataSource/setAppQuestion', this.title)
      this.$store.dispatch('dataSource/updateResultRouter', 'key_in')
    },
  }
}
</script>

<style lang="scss" scoped>
.recommended-insights__card {
  background: rgba(0, 0, 0, 0.55);
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.12);
  border-radius: 8px;
  overflow: hidden;

  .card {
    &__header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 14px 20px;
      background: rgba(50, 75, 78, 0.6);
      &__title {
        color: red;
      }
      &__link {
        color: red;
      }
    }
    &__body {
      padding: 20px;
    }
  }
}
</style>
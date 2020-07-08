<template>
  <div class="recommended-insights__card">
    <div class="card__header">
      <div class="header__title">{{ question }}</div>
      <button 
        class="header__link btn btn-outline" 
        @click="learnMore">{{ $t('editing.moreInfo') }}</button>
    </div>
    <div class="card__body">
      <task
        :component-id="componentId"
        :show-toolbox="false"
        :custom-chart-style="{ width: '100%', height: '240px' }"
        :arrow-btn-right="20"
        intend="recommended_insight"
        @setQuestion="setQuestion"
      />
    </div>
  </div>
</template>

<script>
export default {
  name: 'RecommendedInsight',
  props: {
    componentId: {
      type: Number,
      default: null
    }
  },
  data () {
    return {
      question: ''
    }
  },
  methods: {
    learnMore () {
      this.$store.commit('dataSource/setAppQuestion', this.question)
      this.$store.dispatch('dataSource/updateResultRouter', 'key_in')
    },
    setQuestion (question) {
      this.question = question
    }
  }
}
</script>

<style lang="scss" scoped>
.recommended-insights__card {
  background: rgba(35, 61, 64, 0.6);
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.12);
  border-radius: 8px;
  overflow: hidden;
  height: 100%;
  width: 0; // 讓卡片能響應式縮小
  height: 342px;
  flex-basis: calc(50% - 10px);
  &:first-child {
    margin-bottom: 20px;
  }

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
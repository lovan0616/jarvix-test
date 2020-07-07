<template>
  <div class="recommended-insights__card">
    <div class="card__header">
      <div class="header__title">{{ title }}</div>
      <button 
        class="header__link btn btn-outline" 
        @click="learnMore">{{ $t('editing.moreInfo') }}</button>
    </div>
    <div class="card__body">
      <slot/>
    </div>
  </div>
</template>

<script>
export default {
  name: 'RecommendedInsightItem',
  props: {
    title: {
      type: String,
      default: '我沒有標題!!'
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
  background: rgba(35, 61, 64, 0.6);
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.12);
  border-radius: 8px;
  overflow: hidden;
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
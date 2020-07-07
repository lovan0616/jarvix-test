<template>
  <div class="recommended-insights__card">
    <div class="card__header">
      <div class="header__title">客戶年齡與訂單金額的概況</div>
      <button class="header__link btn btn-outline">瞭解更多</button>
    </div>
    <div class="card__body">
      <!-- TODO: Remove mock data -->
      <task :component-id="196548"/>
    </div>
  </div>
</template>

<script>
export default {
  name: 'RecommendedInsightItem',
  data () {
    return {
    }
  },
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
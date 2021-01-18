<template>
  <div 
    v-show="isTaskComplete" 
    class="recommended-insights__card"
    @click="learnMore">
    <div class="card__header">
      <div class="header__title">{{ question }}</div>
    </div>
    <div class="card__body">
      <task
        :key="componentId"
        :component-id="componentId"
        :is-show-toolbox="false"
        :custom-chart-style="{ width: '100%', height: '240px' }"
        :arrow-btn-right="20"
        intend="recommended_insight"
        @setQuestion="setQuestion"
        @failed="setTaskStatus(false)"
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
      question: '',
      isTaskComplete: true
    }
  },
  methods: {
    learnMore () {
      this.$store.commit('dataSource/setAppQuestion', this.question)
      this.$store.dispatch('dataSource/updateResultRouter', 'key_in')
    },
    setQuestion (question) {
      this.question = question
    },
    setTaskStatus (value) {
      this.isTaskComplete = value
    }
  }
}
</script>

<style lang="scss" scoped>
.recommended-insights__card {
  @include card();
  background: rgba(35, 61, 64, 0.6);
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.12);
  border-radius: 8px;
  overflow: hidden;
  height: 100%;
  width: 0; // 讓卡片能響應式縮小
  height: auto;
  flex-basis: calc(50% - 10px);
  cursor: pointer;

  &:first-child, &:nth-child(2) {
    margin-bottom: 20px;
  }

  .card {
    &__header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 14px 20px;
      background: rgba(50, 75, 78, 0.6);
    }
    &__body {
      padding: 20px;
      .task {
        pointer-events: none;
      }
    }
  }
}
</style>
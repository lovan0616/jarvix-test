<template>
  <div class="selected-region">
    <div class="region-title-block">
      <div class="region-title">
        <svg-icon
          icon-class="filter"
          class="filter-icon"
        />{{ title }}：
      </div>
      <div class="region-reminder">
        <span class="warning">
          <svg-icon icon-class="lamp" />
          {{ $t('resultDescription.prompt') }}:
        </span>
        <span>{{ $t('resultDescription.saveFilterReminding') }}</span>
      </div>
      <button
        class="btn-m btn-outline"
        @click="save"
      >{{ $t('resultDescription.saveFilterCondition') }}</button>
    </div>
    <slot name="selectedFilterRegion"/>
  </div>
</template>

<script>
import { mapMutations, mapState, mapActions } from 'vuex'
export default {
  name: 'SelectedRegion',
  props: {
    title: {
      type: String,
      default: null
    }
  },
  computed: {
    ...mapState('dataFrameAdvanceSetting', ['isShowSettingBox']),
    ...mapState('dataSource', ['currentQuestionDataFrameId', 'dataFrameId']),
  },
  methods: {
    ...mapActions('dataSource', ['triggerColumnDataCalculation']),
    ...mapMutations('dataFrameAdvanceSetting', ['toggleSettingBox', 'setDisplaySection']),
    async save () {
      // 如果 store 中的 dataframe id 與當前結果的 dataframe 不同須先切換
      if (this.currentQuestionDataFrameId !== this.dataFrameId) {
        await this.$store.dispatch('dataSource/changeDataFrameById', this.currentQuestionDataFrameId )
        // 更新 URL 中的 dataframe id
        this.$router.replace({
          name: 'PageResult',
          params: this.$route.params,
          query: {
            ...this.$route.query,
            dataFrameId: String(this.currentQuestionDataFrameId)
          }
        })
      }
      if (this.$route.name === 'PageResult') {
        // 預先觸發重新計算 column summary 和 column correlation
        this.triggerColumnDataCalculation()
        this.setDisplaySection('filter')
        if (!this.isShowSettingBox) this.toggleSettingBox(true)
      }
      this.$emit('save')
    },
  }
}
</script>
<style lang="scss" scoped>
.selected-region {
  margin-bottom: 16px;
  background: linear-gradient(270deg, #4BCBF1 0%, $filter-color 100%);
  border-radius: 8px;
  padding: 14px 20px;
  margin-top: 16px;

  .region-title-block {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;
  }

  .region-title {
    font-size: 14px;
  }
  .region-reminder {
    flex: 1;
    font-size: 14px;
    line-height: 1.2;
    text-align: right;
    margin-right: 12px;
    padding-left: 20px;
    .warning {
      color: $theme-color-warning;
    }
  }
  .filter-icon {
    margin-right: 4px;
  }
  .filter-description {
    display: flex;
    flex-wrap: wrap;
    font-size: 13px;

    .column-name {
      margin-right: 4px;
    }
  }
}
</style>

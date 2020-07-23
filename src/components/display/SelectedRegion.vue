<template>
  <div class="selected-region">
    <div class="region-title-block">
      <div class="region-title">
        <svg-icon
          icon-class="filter"
          class="filter-icon"
        />{{ title }}：
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
import { mapMutations, mapState } from 'vuex'
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
    ...mapMutations('dataFrameAdvanceSetting', ['toggleSettingBox', 'setDisplaySection']),
    async save () {
      // store ?? dataframe id ???? dataframe ???????
      if (this.currentQuestionDataFrameId !== this.dataFrameId) {
        await this.$store.dispatch('dataSource/changeDataFrameById', this.currentQuestionDataFrameId )
        // ?? URL ?? dataframe id
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
  }

  .region-title {
    font-size: 14px;
    margin-bottom: 16px;
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

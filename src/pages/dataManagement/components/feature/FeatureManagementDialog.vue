<template>
  <div class="feature-management-dialog full-page-dialog">
    <div class="dialog-container">
      <div class="dialog-title">
        {{ $t('editing.featureManagement') }}
        <a href="javascript:void(0)" class="close-btn"
          @click="closeDialog"
        ><svg-icon icon-class="close"></svg-icon></a>
      </div>
      <el-tabs class="ask-helper-tab"
        type="card"
        v-model="activeTab"
      >
        <el-tab-pane
          :label="$t('editing.customFeature')"
          :name="$t('editing.customFeature')"
        >
          <custom-feature-list></custom-feature-list>
        </el-tab-pane>
        <el-tab-pane
          :label="$t('editing.recommendFeature')"
          :name="$t('editing.recommendFeature')"
        >
          <system-recommend-list></system-recommend-list>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>
<script>
import CustomFeatureList from './CustomFeatureList'
import SystemRecommendList from './SystemRecommendList'

export default {
  name: 'FeatureManagementDialog',
  components: {
    CustomFeatureList,
    SystemRecommendList
  },
  data () {
    return {
      activeTab: this.$t('editing.customFeature')
    }
  },
  methods: {
    closeDialog () {

    }
  }
}
</script>
<style lang="scss" scoped>

</style>

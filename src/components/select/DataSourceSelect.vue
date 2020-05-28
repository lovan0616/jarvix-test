<template>
  <div class="data-source-select-block">
    <svg-icon 
      icon-class="folder" 
      class="data-source-select-icon"/>
    <sy-select 
      :selected="dataSourceId"
      :items="buildDataSourceList"
      :placeholder="$t('editing.chooseDataSource')"
      class="data-source-select"
      @update:selected="onDataSourceChange"
    />
  </div>
</template>
<script>
import SySelect from '@/components/select/SySelect'
import { mapGetters } from 'vuex'

export default {
  name: 'DataSourceSelect',
  components: {
    SySelect
  },
  computed: {
    dataSourceId () {
      return this.$store.state.dataSource.dataSourceId
    },
    ...mapGetters('dataSource', ['dataSourceList']),
    // 過濾掉正在 build 的 bookmark
    buildDataSourceList () {
      return this.dataSourceList.filter(dataSource => {
        return dataSource.state === 'ENABLE' && dataSource.enableDataFrameCount
      })
    }
  },
  methods: {
    onDataSourceChange (dataSourceId) {
      this.$store.dispatch('dataSource/changeDataSourceById', dataSourceId)
        .then(() => {
          if (this.$route.name !== 'PageIndex') this.$router.push('/')
        })
    }
  }
}
</script>
<style lang="scss" scoped>
.data-source-select-block {
  display: inline-block;
  position: relative;
  background-color: $theme-bg-lighter-color;
  color: #fff;
  border-radius: 4px;

  .data-source-select-icon {
    position: absolute;
    top: 10px;
    left: 8px;
  }
}
</style>
<style lang="scss">
.data-source-select.sy-select.theme-default {
  .el-input__inner {
    padding-left: 36px;
  }
}
</style>

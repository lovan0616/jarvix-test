<template>
  <div class="bookmark-select-block">
    <svg-icon icon-class="folder" class="bookmark-select-icon"></svg-icon>
    <sy-select class="bookmark-select"
      :selected="dataSourceId"
      :items="buildDataSourceList"
      :placeholder="$t('editing.choiceDataSource')"
      @update:selected="onDataSourceChange"
    >
    </sy-select>
  </div>
</template>
<script>
import SySelect from '@/components/select/SySelect'
export default {
  name: 'BookmarkSelect',
  components: {
    SySelect
  },
  computed: {
    dataSourceId () {
      return this.$store.state.dataSource.dataSourceId
    },
    dataSourceList () {
      return this.$store.state.dataSource.dataSourceList
    },
    // 過濾掉正在 build 的 bookmark
    buildDataSourceList () {
      return this.dataSourceList.filter(dataSource => {
        return dataSource.state === 'ENABLE'
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
.bookmark-select-block {
  display: inline-block;
  position: relative;
  background-color: $theme-bg-lighter-color;
  color: #fff;
  border-radius: 4px;

  .bookmark-select-icon {
    position: absolute;
    top: 10px;
    left: 8px;
  }
}
</style>
<style lang="scss">
.bookmark-select.sy-select.theme-default {
  .el-input__inner {
    padding-left: 36px;
  }
}
</style>

<template>
  <div class="data-frame-select">
    <svg-icon 
      icon-class="table" 
      class="data-frame-select__icon"/>
    <sy-select 
      :selected="dataFrameId"
      :items="buildDataFrameList"
      :placeholder="$t('editing.chooseDataFrame')"
      class="data-frame-select__dropdown"
      @update:selected="onDataFrameChange"
    />
  </div>
</template>
<script>
import SySelect from '@/components/select/SySelect'

export default {
  name: 'DataFrameSelect',
  components: {
    SySelect
  },
  computed: {
    dataFrameId () {
      return this.$store.state.dataSource.dataFrameId
    },
    buildDataFrameList () {
      const dataFrameList = this.$store.state.dataSource.dataFrameList
      const defaultOption = {
        name: this.$t('editing.allDataFrames'),
        id: ''
      }
      return dataFrameList.reduce((acc, cur) => {
        if (cur.state !== 'Enable') return acc
        acc.push({name: cur.primaryAlias, id: cur.id})
        return acc
      }, [defaultOption])
    }
  },
  methods: {
    onDataFrameChange (dataFrameId) {
      this.$store.dispatch('dataSource/changeDataFrameById', dataFrameId)
    }
  }
}
</script>
<style lang="scss" scoped>
.data-frame-select {
  display: inline-block;
  position: relative;
  background-color: #233131;
  color: #fff;
  border-radius: 4px;

  &__icon {
    position: absolute;
    top: 10px;
    left: 8px;
  }

  &__dropdown {
    /deep/ &.sy-select.theme-default {
      .el-input__inner {
        padding-left: 36px;
      }
    }
  }
  
  /deep/ .el-select {
    flex: 1;
  }
}
</style>
<template>
  <div class="data-frame-select">
    <svg-icon 
      icon-class="table" 
      class="data-frame-select__icon"/>
    <sy-select 
      :selected="dataFrameId"
      :items="availableDataFrames"
      :placeholder="$t('editing.chooseDataFrame')"
      class="data-frame-select__dropdown"
      @update:selected="onDataFrameChange"
    />
  </div>
</template>
<script>
import SySelect from '@/components/select/SySelect'
import { mapGetters } from 'vuex'

export default {
  name: 'DataFrameSelect',
  components: {
    SySelect
  },
  computed: {
    ...mapGetters('userManagement', ['getCurrentGroupId']),
    dataFrameId () {
      return this.$store.state.dataSource.dataFrameId
    },
    availableDataFrames () {
      const dataFrameList = this.$store.state.dataSource.dataFrameList
      if (dataFrameList.length === 0) return []
      const defaultOption = {
        name: this.$t('editing.allDataFrames'),
        id: 'all'
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
      .then(() => {
        this.$router.push({ 
          name: 'PageIndex', 
          params: { 
            'group_id': this.getCurrentGroupId
          },
          query: {
            dataSourceId: this.$route.query.dataSourceId,
            dataFrameId
          }
        })
      })
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
    left: 14px;
  }

  &__dropdown {
    /deep/ &.sy-select.theme-default {
      .el-input__inner {
        padding-left: 42px;
      }
    }
  }
  
  /deep/ .el-select {
    flex: 1;
  }

  /deep/ .el-input__icon {
    width: 40px;
  }
}
</style>
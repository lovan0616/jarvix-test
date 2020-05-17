<template>
  <el-table
    :data="etlTableList" style="width: 100%">
    <el-table-column
      v-for="(column, index) in etlTableList[currentTableIndex].columns"
      :key="index" label="label" width="240">
      <template slot="header">
        <slot :column="column" :index="index"></slot>
      </template>

    </el-table-column>
  </el-table>
</template>

<script>
export default {
  props: {
    currentTableIndex: {
      type: Number,
      default: 0
    }
  },
  computed: {
    etlTableList () {
      return this.$store.state.dataManagement.etlTableList
    }
  }
}
</script>

<style lang="scss" scoped></style>

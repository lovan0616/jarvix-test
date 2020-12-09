<template>
  <div class="sy-table-block">
    <el-table
      :data="tableData"
      height="260px"
      class="sy-table"
      style="width: 100%"
      @row-click="rowClick">
      <el-table-column
        prop="warningRule"
        label="警示條件"
        width="240"/>
      <el-table-column
        prop="warningMessage"
        label="警示訊息"/>
      <el-table-column
        prop="detail"
        label="詳細內容"
        width="100"/>
        <!-- <el-table-column
        fixed="right"
        label="前往關聯"
        width="100">
        <template slot-scope="scope">
          <button
            class="btn btn-default"
            type="text" 
            size="small" 
            @click="handleClick">Detail</button>
        </template>
      </el-table-column> -->
    </el-table>
  </div>
</template>

<script>
export default {
  name: 'MonitorWarningTable',
  data() {
    return {
      // MOCK DATA，之後改成呼叫示警 API
      tableData: []
    }
  },
  mounted () {
    while (this.tableData.length < 20) {
      this.tableData.push({
        warningRule: '2330 + 0050總和低於490',
        warningMessage: '危機入市',
        detail: '399, 89'
      })
    }
  },
  methods: {
    handleClick () {},
    rowClick (warningInfo) {
      console.log(warningInfo)
    }
  }
}
</script>

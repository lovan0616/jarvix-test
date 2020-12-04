<template>
  <div>
    <div class="sy-table-block">
      <el-table
        :data="tableData"
        height="500px"
        class="sy-table"
        style="width: 100%"
        @row-click="rowClick">
        <el-table-column
          prop="datetime"
          label="時間"
          width="220"/>
        <el-table-column
          prop="warningRule"
          label="警示條件"/>
        <el-table-column
          prop="warningMessage"
          label="警示訊息"/>
        <el-table-column
          prop="warningCode"
          label="警示代號"
          width="120px"/>
        <el-table-column
          label="前往關聯"
          width="100">
          <template slot-scope="scope">
            <a 
              class="link" 
              @click="handleClick">前往看版</a>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
export default {
  name: 'WarningLog',
  data() {
    return {
      // MOCK DATA，之後改成呼叫示警 API
      tableData: []
    }
  },
  mounted () {
    while (this.tableData.length < 20) {
      this.tableData.push({
        datetime: '2020/11/03 13:44:56',
        warningRule: 'X < 0',
        warningMessage: '異物遮擋',
        warningCode: "ERR001"
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
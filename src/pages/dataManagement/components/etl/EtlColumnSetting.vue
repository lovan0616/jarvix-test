<template>
  <div class="etl-column-setting">
    <div class="section data-frame">
      <div class="title">{{ $t('etl.dataFrameList') }}</div>
      <div class="data-frame-list">
        <div class="single-data-frame"
          v-for="(table, index) in tableOptionList"
          :key="table.originForeignId"
          :class="{active: currentTableIndex === index}"
          @click="chooseDataFrame(index)"
        >{{ table.name }}</div>
      </div>
    </div>
    <div class="section data-column">
      <div class="title has-icon"><svg-icon icon-class="arrow-right" class="icon"></svg-icon><span class="data-frame-name">{{ tableOptionList[currentTableIndex].name }}</span>{{ $t('etl.columnList') }}</div>
      <div class="data-column-list">
        <label class="single-column"
          v-for="(column, index) in columnOptionList"
          :key="currentTableIndex + '-' + index"
        >
          <div class="checkbox">
            <div class="checkbox-label">
              <input type="checkbox" :name="'column' + index"
                :value="true"
                :checked="column.active"
                @change="chooseColumn(index)"
              >
              <div class="checkbox-square"></div>
            </div>
          </div>
          <div class="data-frame-info">
            <div class="data-frame-name">{{ column.primaryAlias }}</div>
          </div>
        </label>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'EtlColumnSetting',
  data () {
    return {
      currentTableIndex: 0
    }
  },
  methods: {
    chooseDataFrame (index) {
      this.currentTableIndex = index
    },
    chooseColumn (index) {
      this.$store.commit('dataManagement/chooseColumn', {
        dataFrameIndex: this.currentTableIndex,
        columnIndex: index
      })
    }
  },
  computed: {
    tableOptionList () {
      if (this.etlTableList.length === 0) return []
      return this.etlTableList.map(element => {
        return {
          name: element.name,
          originForeignId: element.originForeignId
        }
      })
    },
    columnOptionList () {
      if (this.etlTableList.length === 0) return []
      return this.etlTableList.filter((element, index) => index === this.currentTableIndex)[0].columns.filter(element => element.active)
    },
    etlTableList () {
      return this.$store.state.dataManagement.etlTableList
    }
  }
}
</script>
<style lang="scss" scoped>
.etl-column-setting {

  .data-column-list {
    .checkbox {
      margin-right: 8px;
    }
  }
}
</style>

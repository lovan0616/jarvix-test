<template>
  <div class="etl etl-column-setting">
    <div class="section data-frame">
      <div class="title">{{ $t('etl.dataFrameList') }}</div>
      <div class="data-frame-list section-block">
        <div class="single-data-frame"
          v-for="(table, index) in tableOptionList"
          :key="table.originForeignId + '-' + index"
          :class="{active: currentTableIndex === index}"
          @click="chooseDataFrame(index)"
        >{{ table.name }}</div>
      </div>
    </div>
    <div class="section data-column">
      <div class="title has-icon"><svg-icon icon-class="arrow-right" class="icon"></svg-icon><span class="data-frame-name">{{ tableOptionList[currentTableIndex].name || '' }}</span>{{ $t('etl.columnList') }}</div>
      <div class="data-column-list section-block">
        <div class="single-column"
          v-for="(column, index) in columnOptionList"
          :key="currentTableIndex + '-' + index"
          :class="{active: currentColumnIndex === index}"
          @click="chooseDataColumn(index)"
        >
          <div class="data-frame-name">{{ column.primaryAlias }}</div>
          <div class="data-type">{{ column.originalDataType }}</div>
        </div>
      </div>
    </div>
    <div class="section section-setting">
      <div class="title has-icon"><svg-icon icon-class="arrow-right" class="icon"></svg-icon><span class="data-frame-name">{{ currentColumnInfo.primaryAlias || '' }}</span>{{ $t('etl.etlSetting') }}</div>
      <single-column-setting
        :key="currentTableIndex + '_' + currentColumnIndex"
        :column-info="currentColumnInfo"
        @updateInfo="updateSetting"
      ></single-column-setting>
    </div>
  </div>
</template>
<script>
import SingleColumnSetting from './SingleColumnSetting'

export default {
  name: 'EtlColumnSetting',
  components: {
    SingleColumnSetting
  },
  data () {
    return {
      currentTableIndex: 0,
      currentColumnIndex: 0
    }
  },
  methods: {
    chooseDataFrame (index) {
      this.currentTableIndex = index
      this.currentColumnIndex = 0
    },
    chooseDataColumn (index) {
      this.currentColumnIndex = index
    },
    updateSetting (info) {
      this.$store.commit('dataManagement/updateReplaceValue', {
        tableIndex: this.currentTableIndex,
        columnIndex: info.index,
        info
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
    },
    currentColumnInfo () {
      if (this.columnOptionList.length === 0) return []
      return this.columnOptionList[this.currentColumnIndex]
    }
  },
  watch: {
    currentTableIndex () {
      this.$el.querySelector('.data-column-list').scrollTop = 0
    }
  }
}
</script>
<style lang="scss" scoped>
.etl.etl-column-setting {
  .section {
    &.data-frame {
      flex: initial;
      width: 190px;
    }
    &.data-column {
      flex: initial;
      width: 230px;
    }
  }

  .title {
    .data-frame-name {
      max-width: 150px;
    }
  }

  .data-column-list {
    // 這邊是與選擇欄位共用的，只是在這邊方向不同
    .single-column {
      position: relative;
      flex-direction: column;
      align-items: flex-start;
      border: 2px solid rgba(67, 76, 76, .95);

      &:before {
        content: "";
        display: block;
        position: absolute;
        top: 16px;
        right: 16px;
        width: 8px;
        height: 8px;
        background-color: #6C7273;
        border-radius: 50%;
      }

      &.active {
        border: 2px solid #2AD2E2;
      }

      .data-type {
        font-size: 12px;
        line-height: 17px;
        color: #ccc;
      }
    }
  }
}
</style>

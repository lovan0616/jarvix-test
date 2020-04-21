<template>
  <div class="etl etl-choose-column">
    <div class="section data-frame">
      <div class="title">{{ $t('etl.dataFrameList') }}</div>
      <div class="data-frame-list section-block">
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
      <div class="data-column-list section-block">
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
  name: 'EtlChooseColumn',
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
      return this.etlTableList.filter((element, index) => index === this.currentTableIndex)[0].columns
    },
    etlTableList () {
      return this.$store.state.dataManagement.etlTableList
    }
  }
}
</script>
<style lang="scss" scoped>
.etl-choose-column {
  display: flex;

  .section {
    flex: 1;

    &:not(:last-child) {
      margin-right: 20px;
    }

    &.data-frame {
      flex: initial;
      width: 250px;
    }
  }

  .data-frame-name {
    margin-right: 4px;
  }

  .title {
    margin-bottom: 12px;

    &.has-icon {
      position: relative;

      .icon {
        position: absolute;
        top: 4px;
        left: -20px;
        color: #999;
      }
    }

    .data-frame-name {
      max-width: 455px;
    }
  }

  .data-frame-list {
    height: 400px;
    overflow: auto;

    .single-data-frame {
      background-color: rgba(67, 76, 76, 0.95);
      border-radius: 5px;
      font-size: 14px;
      line-height: 20px;
      padding: 12px 16px;
      cursor: pointer;

      &:not(:last-child) {
        margin-bottom: 12px;
      }

      &.active {
        background-color: #2AD2E2;
      }
    }
  }

  .data-column-list {
    .single-column {
      .checkbox {
        margin-right: 8px;
      }
    }
  }
}
</style>

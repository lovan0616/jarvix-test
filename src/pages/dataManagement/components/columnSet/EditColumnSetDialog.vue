<template>
  <div class="column-set-alias-dialog full-page-dialog">
    <div class="dialog-container">
      <div class="dialog-title">
        {{ $t('editing.columnSetSetting') }}
        <a href="javascript:void(0)" class="close-btn"
          @click="closeDialog"
        ><svg-icon icon-class="close"></svg-icon></a>
      </div>
      <div class="dialog-header-block">
        <div class="header-button-block">
          <button class="btn btn-secondary btn-has-icon add-btn"><svg-icon icon-class="plus" class="icon"></svg-icon>{{ $t('button.addColumnSet') }}</button>
          <div class="data-frame-name">{{ $t('editing.dataFrame') }}：{{ dataFrameInfo.primaryAlias }}</div>
        </div>
        <div class="button-block">
          <!-- <span class="remark-text">{{ $t('editing.rebuildRemark') }}</span> -->
          <button type="button" class="btn btn-default"
          >{{ $t('button.saveAndBuild') }}</button>
        </div>
      </div>
      <div class="dialog-content-block">
        <single-column-set
          v-for="singleColumnSet in columnSetList"
          :key="singleColumnSet.id"
          :column-list="columnList"
        ></single-column-set>
      </div>
    </div>
  </div>
</template>
<script>
import { getColumnSetList } from '@/API/ColumnSet'
import { getDataFrameColumnInfoById } from '@/API/DataSource'
import SingleColumnSet from './SingleColumnSet'

export default {
  name: 'EditColumnSetDialog',
  components: {
    SingleColumnSet
  },
  props: {
    dataFrameInfo: {
      type: Object,
      default: () => {
        return {
          primaryAlias: null,
          id: null
        }
      }
    }
  },
  data () {
    return {
      columnList: [],
      columnSetList: [],
      singleColumnSetConfig: {
        dataColumnList: [],
        dataFrameId: null,
        dataSourceId: null,
        id: null,
        primaryAlias: null
      }
    }
  },
  mounted () {
    this.fetchColumnInfo()
  },
  methods: {
    fetchColumnInfo () {
      getDataFrameColumnInfoById(this.dataFrameInfo.id).then(response => {
        console.log(response, 'column')
        this.columnList = response

        getColumnSetList(this.dataFrameInfo.id).then(columnSetInfo => {
          if (columnSetInfo.length === 0) {
            this.columnSetList.push(JSON.parse(JSON.stringify(this.singleColumnSetConfig)))
          } else {

          }
        })
      })
    },
    closeDialog () {
      this.$emit('close')
    }
  }
}
</script>
<style lang="scss" scoped>
.column-set-alias-dialog {
  .dialog-title {
    position: relative;

    .close-btn {
      position: absolute;
      top: 0;
      right: 0;
      color: #fff;
      font-size: 14px;
    }
  }

  .dialog-header-block {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 12px;

    .header-button-block {
      display: flex;
      align-items: center;
    }

    .add-btn {
      margin-right: 16px;
    }

    .data-frame-name {
      font-size: 14px;
    }

    .remark-text {
      color: $theme-color-warning;
      font-size: 14px;
      margin-right: 12px;
    }
  }
  .dialog-content-block {
    display: flex;
    max-height: 70vh;
  }
}
</style>

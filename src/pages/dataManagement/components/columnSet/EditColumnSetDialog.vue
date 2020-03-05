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
          <button class="btn btn-secondary btn-has-icon add-btn"
            @click="addColumnSet"
          ><svg-icon icon-class="plus" class="icon"></svg-icon>{{ $t('button.addColumnSet') }}</button>
          <div class="data-frame-name">{{ $t('editing.dataFrame') }}：{{ dataFrameInfo.primaryAlias }}</div>
        </div>
        <div class="button-block">
          <!-- <span class="remark-text">{{ $t('editing.rebuildRemark') }}</span> -->
          <!-- <button type="button" class="btn btn-default"
          >{{ $t('button.saveAndBuild') }}</button> -->
        </div>
      </div>
      <div class="dialog-content-block">
        <spinner
          v-if="isLoading"
        ></spinner>
        <single-column-set
          v-for="(singleColumnSet, index) in columnSetList"
          :key="columnSetList.length - index"
          :column-list="columnList"
          :column-set="singleColumnSet"
          @remove="removeColumnSet(index)"
        ></single-column-set>
        <empty-info-block
          class="empty-info-block"
          v-if="columnSetList.length === 0"
          :msg="$t('message.emptyColumnSet')"
        ></empty-info-block>
      </div>
    </div>
  </div>
</template>
<script>
import { getColumnSetList } from '@/API/ColumnSet'
import { getDataFrameColumnInfoById } from '@/API/DataSource'
import SingleColumnSet from './SingleColumnSet'
import EmptyInfoBlock from '@/components/EmptyInfoBlock'

export default {
  name: 'EditColumnSetDialog',
  components: {
    SingleColumnSet,
    EmptyInfoBlock
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
        dataFrameId: this.dataFrameInfo.id,
        id: null,
        primaryAlias: null
      },
      isLoading: false
    }
  },
  mounted () {
    this.fetchColumnInfo()
  },
  methods: {
    fetchColumnInfo () {
      this.isLoading = true
      getDataFrameColumnInfoById(this.dataFrameInfo.id).then(response => {
        this.columnList = response

        getColumnSetList(this.dataFrameInfo.id).then(columnSetInfo => {
          this.isLoading = false
          if (columnSetInfo.length === 0) {
            this.columnSetList.push(JSON.parse(JSON.stringify(this.singleColumnSetConfig)))
          } else {
            this.columnSetList = columnSetInfo
          }
        }).catch(() => {
          this.isLoading = false
        })
      })
    },
    addColumnSet () {
      this.columnSetList.unshift(JSON.parse(JSON.stringify(this.singleColumnSetConfig)))
    },
    removeColumnSet (index) {
      this.columnSetList.splice(index, 1)
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
    max-height: 70vh;

    & >>> .empty-info-block {
      background: rgba(50, 58, 58, 0.95);
      font-size: 18px;
    }
  }
}
</style>

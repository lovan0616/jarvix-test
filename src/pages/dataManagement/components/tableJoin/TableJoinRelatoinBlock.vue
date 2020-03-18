<template>
  <div class="single-relation-block">
    <!-- <div class="action-block">
      <div class="title">{{ $t('editing.columnCorrelation') }}</div>
      <a href="javascript:void(0)" class="link"
        @click="checkDeleteRelations(relationInfo.id)"
      ><svg-icon icon-class="delete" class="delete-icon"></svg-icon>{{ $t('button.delete') }}</a>
      <tooltip-dialog class="confirm-delete-dialog"
        v-if="showConfirmDeleteDialog"
        @cancel="cancelDelete"
        @confirm="deleteRelations"
      ></tooltip-dialog>
    </div> -->
    <div class="input-block">
      <label for="" class="label">*{{ $t('editing.tableName') }}</label>
      <input type="text" class="input"
        v-if="!relationInfo.id"
        :placeholder="$t('editing.pleaseEnterName')"
        v-model="relationInfo.name"
      >
      <div
        v-else
      >{{ relationInfo.name }}</div>
    </div>
    <div class="input-block select">
      <label for="" class="label">*{{ $t('editing.selectJoinType') }}</label>
      <default-select class="tag-select input"

      ></default-select>
    </div>
    <div class="correlation-block">
      <div class="select-block">
        <custom-select
          :key="new Date().getTime()+'-left-top'"
          icon="table"
          :default-msg="$t('editing.selectForeign')"
          :option-list="tableList"
          v-model="relationInfo.leftDataFrameId"
        ></custom-select>
        <custom-select
          :key="new Date().getTime()+'-left-down'"
          icon="column"
          :default-msg="$t('editing.selectColumn')"
          :option-list="leftTableColumnList"
          v-model="relationInfo.leftDataColumnId"
        ></custom-select>
      </div>
      <svg-icon icon-class="table-correlation" class="correlation-icon"></svg-icon>
      <div class="select-block">
        <custom-select
          :key="new Date().getTime()+'-right-top'"
          icon="table"
          :default-msg="$t('editing.selectForeign')"
          :option-list="tableList"
          v-model="relationInfo.rightDataFrameId"
        ></custom-select>
        <custom-select
          :key="new Date().getTime()+'-right-down'"
          icon="column"
          :default-msg="$t('editing.selectColumn')"
          :option-list="rightTableColumnList"
          v-model="relationInfo.rightDataColumnId"
        ></custom-select>
      </div>
    </div>
    <div class="button-block footer-button-block">
      <div class="control-button-block">
        <button type="button" class="btn btn-default"
          @click="saveRelations"
        >{{ $t('button.save') }}</button>
      </div>
    </div>
  </div>
</template>
<script>
import CustomSelect from '../CustomSelect'
import TooltipDialog from '@/components/dialog/TooltipDialog'
import DefaultSelect from '@/components/select/DefaultSelect'
import { getDataFrameColumnInfoById, saveDataFrameRelation, updateDataFrameRelationById } from '@/API/DataSource'
import { Message } from 'element-ui'

export default {
  name: 'TableJoinRelationBlock',
  components: {
    CustomSelect,
    TooltipDialog,
    DefaultSelect
  },
  props: {
    relationInfo: {
      type: Object
    },
    tableList: {
      type: Array
    },
    index: {
      type: Number
    }
  },
  data () {
    return {
      deleteJoinId: null,
      showConfirmDeleteDialog: false,
      leftTableColumnList: [],
      rightTableColumnList: []
    }
  },
  mounted () {
    if (this.relationInfo.leftDataFrameId) {
      this.relationInfo.leftDataFrameId = parseInt(this.relationInfo.leftDataFrameId)
      getDataFrameColumnInfoById(this.relationInfo.leftDataFrameId).then(response => {
        this.leftTableColumnList = response
      })
    }
    if (this.relationInfo.rightDataFrameId) {
      this.relationInfo.rightDataFrameId = parseInt(this.relationInfo.rightDataFrameId)
      getDataFrameColumnInfoById(this.relationInfo.rightDataFrameId).then(response => {
        this.rightTableColumnList = response
      })
    }
  },
  methods: {
    checkDeleteRelations () {
      this.showConfirmDeleteDialog = true
    },
    cancelDelete () {
      this.showConfirmDeleteDialog = false
    },
    deleteRelations () {
      this.$emit('deleteRelations', this.index)
    },
    saveRelations () {
      let promise
      if (this.relationInfo.id) {
        promise = updateDataFrameRelationById(this.relationInfo.id, this.relationInfo)
      } else {
        promise = saveDataFrameRelation(this.relationInfo)
      }

      promise.then(() => {
        Message({
          message: this.$t('message.saveSuccess'),
          type: 'success',
          duration: 3 * 1000
        })
      })
    }
  },
  watch: {
    'relationInfo.leftDataFrameId' (value) {
      this.relationInfo.leftDataColumnId = null
      getDataFrameColumnInfoById(value).then(response => {
        this.leftTableColumnList = response
      })
    },
    'relationInfo.rightDataFrameId' (value) {
      this.relationInfo.rightDataColumnId = null
      getDataFrameColumnInfoById(value).then(response => {
        this.rightTableColumnList = response
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.single-relation-block {
  padding: 24px 32px;
  border-radius: 4px;
  background-color: rgba(50, 58, 58, 0.95);

  &:not(:last-child) {
    margin-bottom: 12px;
  }

  &:last-child {
    margin-bottom: 16px;
  }

  .action-block {
    position: relative;
    margin-bottom: 16px;
    display: flex;
    justify-content: space-between;

    .link {
      line-height: 19px;
    }

    .delete-icon {
      margin-right: 8px;
    }
  }

  .input-block {
    width: 290px;
    margin-bottom: 20px;
    display: inline-block;

    &.select {
      width: 170px;
      margin-left: 15px;
    }

    .label {
      display: block;
      font-size: 14px;
      line-height: 20px;
      color: #ccc;
      margin-bottom: 8px;
    }

    .input {
      height: 40px;
    }
  }

  .confirm-delete-dialog {
    right: 0;
  }

  .correlation-block {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 16px;

    .correlation-icon {
      width: 60px;
      font-size: 60px;
      color: $theme-color-primary;
    }
  }

  .select-block {
    flex: 1;
    border: 2px solid $theme-color-primary;
    padding: 16px;
    border-radius: 8px;

    & >>> .custom-select-block {
      width: 100%;

      &:not(:last-child) {
        margin-bottom: 12px;
      }
    }

    .join-icon {
      font-size: 24px;
    }
  }

  .button-block {
    display: flex;
    justify-content: space-between;

    &.footer-button-block {
      justify-content: flex-end;
    }

    .control-button-block {
      .btn:not(:last-child) {
        margin-right: 16px;
      }
    }
  }
}

>>> .tag-select.el-select {
  .el-input__inner {
    height: 32px;
    line-height: 33px;
    font-size: 16px;
  }
  .el-input__icon {
    line-height: 32px;
  }
}
</style>

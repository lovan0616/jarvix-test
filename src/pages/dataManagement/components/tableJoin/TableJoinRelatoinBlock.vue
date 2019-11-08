<template>
  <div class="single-relation-block">
    <div class="action-block">
      <div class="title">{{ $t('editing.columnCorrelation') }}</div>
      <a href="javascript:void(0)" class="link"
        @click="checkDeleteRelations(relationInfo.id)"
      ><svg-icon icon-class="delete" class="delete-icon"></svg-icon>{{ $t('button.delete') }}</a>
      <tooltip-dialog class="confirm-delete-dialog"
        v-if="deleteJoinId"
        @cancel="cancelDelete"
        @confirm="deleteRelations"
      ></tooltip-dialog>
    </div>
    <div class="correlation-block">
      <div class="select-block">
        <custom-select
          icon="table"
          :default-msg="$t('editing.selectForeign')"
          :option-list="tableList"
          v-model="relationInfo.leftDataFrameId"
        ></custom-select>
        <custom-select
          icon="column"
          :default-msg="$t('editing.selectColumn')"
          :option-list="leftTableColumnList"
          v-model="relationInfo.leftDataColumnId"
        ></custom-select>
      </div>
      <svg-icon icon-class="table-correlation" class="correlation-icon"></svg-icon>
      <div class="select-block">
        <custom-select
          icon="table"
          :default-msg="$t('editing.selectForeign')"
          :option-list="tableList"
          v-model="relationInfo.rightDataFrameId"
        ></custom-select>
        <custom-select
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
import { getDataFrameColumnInfoById, saveDataFrameRelation } from '@/API/DataSource'

export default {
  name: 'TableJoinRelationBlock',
  components: {
    CustomSelect,
    TooltipDialog
  },
  props: {
    relationInfo: {
      type: Object
    },
    tableList: {
      type: Array
    }
  },
  data () {
    return {
      deleteJoinId: null,
      leftTableColumnList: [],
      rightTableColumnList: []
    }
  },
  methods: {
    checkDeleteRelations (value) {
      this.deleteJoinId = value
    },
    cancelDelete () {
      this.deleteJoinId = null
    },
    deleteRelations () {
      this.$emit('deleteRelations', this.deleteJoinId)
    }
  },
  watch: {
    'relationInfo.leftDataFrameId' (value) {
      console.log(value, 'value')
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
</style>

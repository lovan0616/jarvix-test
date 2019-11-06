<template>
  <div class="single-relation-block">
    <div class="action-block">
      <a href="javascript:void(0)" class="link"
        @click="checkDeleteRelations(relationInfo.id)"
      ><svg-icon icon-class="delete" class="delete-icon"></svg-icon>{{ $t('editing.deleteForeign') }}</a>
      <tooltip-dialog
        v-if="deleteJoinId"
        @cancel="cancelDelete"
        @confirm="deleteRelations"
      ></tooltip-dialog>
    </div>
    <div class="inline-select-block">
      <custom-select
        icon="table"
        :default-msg="$t('editing.selectForeign')"
        :option-list="tableList"
        v-model="relationInfo.left_tbl"
      ></custom-select>
      <svg-icon icon-class="link" class="join-icon"></svg-icon>
      <custom-select
        icon="table"
        :default-msg="$t('editing.selectForeign')"
        :option-list="tableList"
        v-model="relationInfo.right_tbl"
      ></custom-select>
    </div>
    <div class="inline-select-block">
      <custom-select
        icon="column"
        :default-msg="$t('editing.selectColumn')"
        :option-list="leftTableColumnList"
        v-model="relationInfo.foreign_keys[0].left_column"
      ></custom-select>
      <svg-icon icon-class="equal" class="join-icon"></svg-icon>
      <custom-select
        icon="column"
        :default-msg="$t('editing.selectColumn')"
        :option-list="rightTableColumnList"
        v-model="relationInfo.foreign_keys[0].right_column"
      ></custom-select>
    </div>
  </div>
</template>
<script>
import CustomSelect from '../CustomSelect'
import TooltipDialog from '@/components/dialog/TooltipDialog'

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
      deleteJoinId: null
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
  computed: {
    leftTableColumnList () {
      if (!this.relationInfo.left_tbl) return []
      let columnObject = this.tableList.find(element => {
        return element.id === this.relationInfo.left_tbl
      }).columns
      return this.objectToArray(columnObject)
    },
    rightTableColumnList () {
      if (!this.relationInfo.right_tbl) return []
      let columnObject = this.tableList.find(element => {
        return element.id === this.relationInfo.right_tbl
      }).columns
      return this.objectToArray(columnObject)
    }
  },
  watch: {
    'relationInfo.left_tbl' () {
      this.relationInfo.foreign_keys[0].left_column = null
    },
    'relationInfo.right_tbl' () {
      this.relationInfo.foreign_keys[0].right_column = null
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
    margin-bottom: 32px;
  }

  .action-block {
    position: relative;
    margin-bottom: 16px;
    display: flex;
    justify-content: flex-end;

    .link {
      line-height: 19px;
    }

    .delete-icon {
      margin-right: 8px;
    }
  }

  .inline-select-block {
    display: flex;
    align-items: center;
    justify-content: space-between;

    &:not(:last-child) {
      margin-bottom: 16px;
    }

    & >>> .custom-select-block {
      width: 45%;
    }

    .join-icon {
      font-size: 24px;
    }
  }
}
</style>

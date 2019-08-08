<template>
  <div class="edit-table-join-relation-dialog full-page-dialog">
    <div class="dialog-container">
      <div class="dialog-title">资料表关联</div>
      <div class="button-block">
        <button type="button" class="btn btn-default">新增关联</button>
        <div class="control-button-block">
          <button type="button" class="btn btn-outline"
            @click="closeDialog"
          >取消</button>
          <button type="button" class="btn btn-default">储存</button>
        </div>
      </div>
      <div class="empty-info-block">此资料表未建立任何关联</div>
      <div class="single-relation-block">
        <div class="action-block">
          <a href="javascript:void(0)" class="link">清除</a>
          <a href="javascript:void(0)" class="link"><svg-icon icon-class="delete" class="delete-icon"></svg-icon>删除关联</a>
        </div>
        <div class="inline-select-block">
          <custom-select
            icon="table"
            default-msg="选择关联资料表"
          ></custom-select>
          <svg-icon icon-class="link" class="join-icon"></svg-icon>
          <custom-select
            icon="table"
            default-msg="选择关联资料表"
          ></custom-select>
        </div>
        <div class="inline-select-block">
          <custom-select
            icon="column"
            default-msg="选择栏位"
          ></custom-select>
          <svg-icon icon-class="equal" class="join-icon"></svg-icon>
          <custom-select
            icon="column"
            default-msg="选择栏位"
          ></custom-select>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import CustomSelect from './CustomSelect'

export default {
  name: 'EditTableJoinRelationDialog',
  components: {
    CustomSelect
  },
  methods: {
    closeDialog () {
      this.$emit('cancel')
    }
  }
}
</script>
<style lang="scss" scoped>
.edit-table-join-relation-dialog {
  .button-block {
    display: flex;
    justify-content: space-between;
    margin-bottom: 32px;

    .control-button-block {
      .btn:not(:last-child) {
        margin-right: 16px;
      }
    }
  }

  .empty-info-block {
    padding: 24px 0;
    border-radius: 4px;
    background-color: $theme-bg-lighter-color;
    text-align: center;
    margin-bottom: 16px;
  }

  .single-relation-block {
    padding: 24px 32px;
    border-radius: 4px;
    background-color: $theme-bg-lighter-color;

    .action-block {
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

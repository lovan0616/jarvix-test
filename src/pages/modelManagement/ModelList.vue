<template>
  <div class="data-management">
    <div class="page-title-row">
      <h1 class="title">
        <div class="title-left">{{ $t('sideNav.modelList') }}</div>
      </h1>
    </div>
    <div class="table-board">
      <div class="board-title-row">
        <div class="board-title-row__left">
          <div class="button-block">
            <button 
              class="btn-m btn-default btn-has-icon"
            >
              <svg-icon 
                icon-class="plus" 
                class="icon"/>{{ $t('model.newModel') }}
            </button>
          </div>
        </div>
      </div>
      <crud-table
        :headers="tableHeaders"
        :data-list.sync="modelData"
        :loading="isLoading"
      >
        <!-- <template v-slot:action="{ data }">
          <a
            :disabled="false"
            class="link action-link"
            @click="">{{ $t('model.managementSetting') }}</a>
          <a
            :disabled="false"
            class="link action-link"
            @click="isShowDeleteDialog = true">{{ $t('button.delete') }}</a>
        </template> -->
      </crud-table>
    </div>
  </div>
</template>
<script>
import CrudTable from '@/components/table/CrudTable'

export default {
  name: 'ModelList',
  components: {
    CrudTable
  },
  data () {
    return {
      isLoading: false,
      isShowDeleteDialog: false,
      modelData: [{
        createTime: "2021-02-26T08:03:34.961+0000",
        creator: "exist02593",
        id: 2015,
        name: "-v-",
        updateTime: "2021-03-02T06:42:53.382+0000",
        createMethodLabel: '使用者上傳'
      }],
      tableHeaders: [
        {
          text: this.$t('model.id'),
          value: 'id',
          width: '65px',
          sort: true,
        },
        {
          text: this.$t('model.modelName'),
          value: 'name',
          width: '130px'
        },
        {
          text: this.$t('model.creator'),
          value: 'creator',
          width: '100px'
        },
        {
          text: this.$t('model.createTime'),
          value: 'createTime',
          width: '165px',
          time: 'YYYY-MM-DD HH:mm'
        },
        {
          text: this.$t('editing.createdMethod'),
          value: 'createMethodLabel',
          width: '90px'
        },
        {
          text: this.$t('model.updateTime'),
          value: 'updateTime',
          width: '165px',
          time: 'YYYY-MM-DD HH:mm'
        },
        {
          text: this.$t('editing.action'),
          value: 'action',
          width: '140px',
          action: [
            {
              type: 'link',
              name: this.$t('model.managementSetting'),
              value: 'rename',
              link: {
                name: 'ModelDetail',
                paramName: 'model_id'
              }
            },
            {
              type: 'event',
              name: this.$t('button.delete'),
              value: 'delete'
            }
          ]
        }
      ]
    }
  }
}
</script>

<template>
  <div class="page-algorithm">
    <div class="page-title-row">
      <h1 class="title">演算法管理</h1>
      <div class="bread-crumb">
        演算法
      </div>
    </div>
    <div class="table-board">
      <div class="board-title-row">
        <div class="button-block">
          <button class="btn-m btn-default btn-has-icon"
            @click="createAlgorithm"
          >
            <svg-icon icon-class="folder-plus" class="icon"></svg-icon>新增演算法
          </button>
        </div>
      </div>
      <data-table
        :headers="tableHeaders"
        :data-list="algorithms"
        :loading="false"
        empty-message="點擊建立您的演算法"
        @edit="editAlgorithm($event)"
        @create="createAlgorithm"
        @delete="deleteAlgorithm"
      >
      </data-table>
    </div>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import DataTable from '@/components/table/DataTable'

export default {
  name: 'PageAlgorithmList',
  components: {
    DataTable
  },
  methods: {
    editAlgorithm (e) {
      this.$router.push({
        path: `algorithm/${e.id}`
      })
    },
    createAlgorithm () {
      this.$router.push({
        path: `algorithm/create`
      })
    },
    deleteAlgorithm (e) {
      this.$store.dispatch('algorithm/deleteAlgorithm', e)
    }
  },
  computed: {
    ...mapGetters('algorithm', ['algorithms']),
    tableHeaders () {
      return [
        {
          text: '演算法',
          value: 'name',
          sort: true
        //   link: {
        //     name: 'PageDataFileList'
        //   }
        },
        {
          text: '目標資料表',
          value: 'dataframe',
          sort: true
        //   link: {
        //     name: 'PageDataFileList'
        //   }
        },
        {
          text: '建立者',
          value: 'creator',
          sort: true
        },
        {
          text: this.$t('editing.createDate'),
          value: 'createDate',
          sort: true,
          width: '90px',
          time: 'YYYY-MM-DD'
        },
        {
          text: this.$t('editing.updateDate'),
          value: 'updateDate',
          sort: true,
          width: '90px',
          time: 'YYYY-MM-DD'
        },
        {text: this.$t('editing.status'), value: 'status', width: '7.26%'},
        {
          text: this.$t('editing.action'),
          value: 'action',
          width: '180px',
          action: [
            {
              name: '執行',
              value: 'excute'
            }, {
              name: this.$t('button.edit'),
              value: 'edit'
            }, {
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
<style lang="scss" scoped>
.page-algorithm {
  .title-link {
    color: $theme-color-primary;
    text-decoration: underline;
  }
  .divider {
    margin: 0 8px;
    color: #979797;
  }

  .status-block {
    width: 140px;
    position: absolute;
    top: 60px;
    right: 0;
    left: 0;
    margin: auto;
    padding: 6px 0;
    border-radius: 8px;
    background-color: $theme-bg-darker-color;
    box-shadow:  0px 4px 24px rgba(26, 56, 62, 0.5);
    text-align: center;

    .spinner-icon {
      margin-right: 8px;
    }
  }
}
</style>

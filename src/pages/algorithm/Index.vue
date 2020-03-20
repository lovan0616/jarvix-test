<template>
  <div class="page-algorithm">
    <div class="page-title-row">
      <h1 class="title">演算法管理</h1>
      <div class="bread-crumb">
        演算法
        <!-- <router-link to="/data-management" class="title-link">{{ $t('editing.dataSource') }}</router-link>
        <span class="divider">/</span>hello -->
      </div>
    </div>
    <div class="table-board">
      <div class="board-title-row">
        <div class="button-block">
          <button class="btn-m btn-default btn-has-icon"
          >
            <svg-icon icon-class="folder-plus" class="icon"></svg-icon>新增演算法
          </button>
        </div>
      </div>
      <data-table
        :headers="tableHeaders"
        :data-list="dataList"
        :loading="false"
        :empty-message="$t('editing.clickToCreateDataSource')"
        @edit="editAlgorithm($event)"
      >
      </data-table>
    </div>
  </div>
</template>
<script>
import DataTable from '@/components/table/DataTable'

export default {
  name: 'PageAlgorithmList',
  components: {
    DataTable
  },
  data () {
    return {
      dataList: [
        {
          id: 1,
          name: '預測性維修',
          creator: 'sygps',
          createDate: '2020/3/20',
          updateDate: '2020/3/20',
          status: '可執行',
        },
        {
          id: 2,
          name: '第二個演算法',
          creator: 'sygps',
          createDate: '2020/3/20',
          updateDate: '2020/3/20',
          status: '可執行',

        }
      ],
    }
  },
  mounted () {
    
  },
  methods: {
    editAlgorithm (e) {
      this.$router.push({
        path: `algorithm/${e.id}`
      })
    }
  },
  computed: {
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

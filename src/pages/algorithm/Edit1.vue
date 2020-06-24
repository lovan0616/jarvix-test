<template>
  <div class="page-algorithm">
    <div class="page-title-row">
      <h1 class="title">演算法管理</h1>
      <div class="bread-crumb">
        <router-link
          :to="{ name: 'PageAlgorithmList' }"
          class="title-link"
        >演算法</router-link>
        <span class="divider">/</span>預測性維修
      </div>
    </div>
    <div class="table-board">
      <div class="board-title-row">
        訓練資料設定
      </div>
      <div class="content">
        <div class="item-wrap">
          <div class="content-item">
            <div class="item-title must">目標資料源: </div>
            <default-select
              :value="1"
              :option-list="[
                {value: 1, name: '富士康demo'},
              ]"
              class="tag-select input"
            />
          </div>
          <div class="content-item">
            <div class="item-title must">目標資料表: </div>
            <default-select
              :value="1"
              :option-list="[
                {value: 1, name: 'TemperatureData'},
                {value: 2, name: 'molding'},
              ]"
              class="tag-select input"
            />
          </div>
        </div>
        <div class="item-wrap">
          <div class="content-item">
            <div class="item-title must">目標參數欄位: </div>
            <default-select
              :value="1"
              :option-list="[
                {value: 1, name: '溫度'},
              ]"
              class="tag-select input"
            />
          </div>
          <div class="content-item">
            <div class="item-title must">時間欄位: </div>
            <default-select 
              :value="1"
              :option-list="[
                {value: 1, name: '開始時間'},
              ]"
              class="tag-select input"
            />
          </div>
          <div class="content-item">
            <div class="item-title must">狀態欄位: </div>
            <default-select 
              :value="1"
              :option-list="[
                {value: 1, name: '狀態'},
              ]"
              class="tag-select input"
            />
          </div>
        </div>
      </div>
    </div>

    <div class="table-board">
      <div class="board-title-row">
        模型參數設定
        <!-- <div class="button-block">
          <button class="btn-m btn-default btn-has-icon"
          >
            <svg-icon icon-class="folder-plus" class="icon"></svg-icon>新增演算法
          </button>
        </div> -->
      </div>
      <div class="content">
        <div class="content-item">
          <div class="item-title">模型類型: </div>
          <default-select 
            :value="1"
            :option-list="[
              {value: 1, name: '非監督'},
              {value: 2, name: '監督'},
            ]"
            class="tag-select input"
          />
        </div>
        <div class="item-wrap">
          <div class="content-item">
            <div class="item-title">規格上限: </div>
            <input 
              type="text" 
              class="input" 
              placeholder="">
          </div>
          <div class="content-item">
            <div class="item-title">規格下限: </div>
            <input 
              type="text" 
              class="input" 
              placeholder="">
          </div>
        </div>
        <div class="item-wrap">
          <div class="content-item">
            <div class="item-title">管制上限比例: </div>
            <input 
              :value="0.95" 
              type="text" 
              class="input" 
              placeholder="0.5~1">
          </div>
          <div class="content-item">
            <div class="item-title">管制下限比例: </div>
            <input 
              :value="0.05" 
              type="text" 
              class="input" 
              placeholder="0~0.5">
          </div>
        </div>
        <div class="item-wrap">
          <div class="content-item">
            <div class="item-title">時間單位: </div>
            <default-select 
              :value="1"
              :option-list="[
                {value: 1, name: '秒'},
                {value: 2, name: '分'},
                {value: 3, name: '時'},
              ]"
              class="tag-select input"
            />
          </div>
          <div class="content-item">
            <div class="item-title">提早時間: </div>
            <input 
              :value="60" 
              type="text" 
              class="input" 
              placeholder="時間單位依照上面">
          </div>
        </div>
        <div class="content-item">
          <div class="item-title">視窗大小: </div>
          <input 
            :value="60" 
            type="text" 
            class="input">
        </div>
        <div class="content-item">
          <div class="item-title">訓練集佔比: </div>
          <input 
            :value="0.8" 
            type="text" 
            class="input" 
            placeholder="0~1">
        </div>
        <div class="item-wrap">
          <div class="content-item">
            <div class="item-title">警告閥值: </div>
            <input 
              type="text" 
              class="input">
          </div>
          <div class="content-item">
            <div class="item-title">異常閥值: </div>
            <input 
              type="text" 
              class="input">
          </div>
        </div>
      </div>
    </div>

    <div class="table-board">
      <div class="board-title-row">
        即時資料設定
        <!-- <div class="button-block">
          <button class="btn-m btn-default btn-has-icon"
          >
            <svg-icon icon-class="folder-plus" class="icon"></svg-icon>新增演算法
          </button>
        </div> -->
      </div>
      <div class="content">
        <div class="item-wrap">
          <div class="content-item">
            <div class="item-title">目標資料源: </div>
            <default-select 
              :option-list="[
                {value: 1, name: '富士康demo'},
              ]"
              class="tag-select input"
            />
          </div>
          <div class="content-item">
            <div class="item-title">目標資料表: </div>
            <default-select 
              :option-list="[
                {value: 1, name: 'TemperatureData'},
                {value: 2, name: 'molding'},
              ]"
              class="tag-select input"
            />
          </div>
        </div>
        <div class="content-item">
          <div class="item-title">執行週期: </div>
          <default-select 
            :value="5"
            :option-list="[
              {value: 1, name: '一秒'},
              {value: 2, name: '十五秒'},
              {value: 3, name: '三十秒'},
              {value: 4, name: '一分鐘'},
              {value: 5, name: '十分鐘'},
              {value: 6, name: '十五分鐘'},
              {value: 7, name: '三十分鐘'},
              {value: 8, name: '四十分鐘'},
              {value: 9, name: '四五分鐘'},
              {value: 10, name: '一小時'},
            ]"
            class="tag-select input"
          />
        </div>
      </div>
    </div>

    <div class="footer">
      <button 
        type="button" 
        class="btn btn-outline"
        @click="back"
      >{{ $t('button.cancel') }}</button>
      <button 
        type="button" 
        class="btn btn-default"
        @click="back"
      >
        <span>{{ $t('button.confirm') }}</span>
      </button>
    </div>
  </div>
</template>
<script>
import DataTable from '@/components/table/DataTable'
import DefaultSelect from '@/components/select/DefaultSelect'

export default {
  name: 'PageAlgorithmEdit',
  components: {
    DataTable,
    DefaultSelect
  },
  data () {
    return {
      dataList: [
        {
          name: '第一個演算法',
          creator: 'sygps',
          createDate: '2020/3/20',
          updateDate: '2020/3/20',
          status: '可執行'
        },
        {
          name: '第二個演算法',
          creator: 'sygps',
          createDate: '2020/3/20',
          updateDate: '2020/3/20',
          status: '可執行'
        }
      ]
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
        //     name: 'DataFileList'
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
  },
  mounted () {
  },
  methods: {
    back () {
      this.$router.push({ name: 'PageAlgorithmList' })
    }
  },
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

  .table-board {
    margin: 16px 0;

    .board-title-row {
      font-size: 20px;
      // color: #a7a7a7;
    }
    .content {
      .input {
        font-size: 14px;
        width: 160px;
        height: 30px;
        margin-right: 12px;
        color: #a7a7a7;

        &.el-input--suffix .el-input__inner {
          padding-left: 0;
        }
      }
      .item-wrap {
        display: flex;
        flex-wrap: wrap;
        margin: 20px 0;
        .content-item {
          margin: 0;
        }
      }
      .content-item {
        margin: 20px 0;
        padding-right: 36px;
        display: flex;
      }
      .item-title {
        font-size: 14px;
        min-width: 80px;
        max-width: 120px;
        margin-right: 16px;
        align-items: center;
        display: flex;
        color: #a7a7a7;
        padding-left: 12px;

        &.must {
          margin-left: -8px;
          &:before {
            content: '*';
            color: #e46d6d;
          }
        }
      }
    }
  }

  .footer {
    float: right;
    margin: 0 -6px;

    .btn {
      margin: 0 6px;
    }
  }
}

</style>
<style lang="scss">
.page-algorithm {
  .table-board {
    .content {
      input.el-input__inner {
        height: 30px;
        font-size: 14px;
        padding-left: 0;
        color: #a7a7a7;
      }
      .el-input__icon {
        line-height: 30px;
      }
    }
  }
}
</style>

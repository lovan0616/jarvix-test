<template>
  <div class="page-algorithm">
    <div class="page-title-row">
      <h1 class="title">{{ $t('algorithm.management') }}</h1>
      <div class="bread-crumb">
        <router-link 
          :to="{name: 'PageAlgorithmList'}" 
          class="title-link">{{ $t('algorithm.name') }}</router-link>
        <span class="divider">/</span>{{ $t('algorithm.contourPrediction') }}
      </div>
    </div>
    <div class="table-board">
      <div class="board-title-row">
        {{ $t('algorithm.trainDataSetting') }}
      </div>
      <div class="content">
        <div class="item-wrap">
          <div class="content-item">
            <div class="item-title must">{{ $t('algorithm.targetDataSource') }}: </div>
            <default-select 
              :value="1"
              :option-list="[
                {value: 1, name: '富士康demo'},
              ]"
              class="tag-select input"
            />
          </div>
          <div class="content-item">
            <div class="item-title must">{{ $t('algorithm.targetDataFrame') }}: </div>
            <default-select 
              :value="1"
              :option-list="[
                { value: 1, name: 'TemperatureData' },
                { value: 2, name: 'molding' },
              ]"
              class="tag-select input"
            />
          </div>
        </div>
        <div class="item-wrap">
          <div class="content-item">
            <div class="item-title must">{{ $t('algorithm.targetParamColumn') }}: </div>
            <default-select 
              :value="1"
              :option-list="[
                { value: 1, name: $t('algorithm.actualLabel') },
              ]"
              class="tag-select input"
            />
          </div>
          <div class="content-item">
            <div class="item-title must">{{ $t('algorithm.timeColumn') }}: </div>
            <default-select 
              :value="1"
              :option-list="[
                { value: 1, name: $t('algorithm.timestamp') },
              ]"
              class="tag-select input"
            />
          </div>
        </div>
        <div class="content-item">
          <div class="item-title must">{{ $t('algorithm.measurementColumn') }}: </div>
          <default-multi-select 
            :values="[1, 2]"
            :option-list="[
              { value: 1, name: $t('algorithm.temperature') },
              { value: 2, name: $t('algorithm.pressure') },
            ]"
            class="tag-select input"
          />
        </div>
      </div>
    </div>

    <div class="table-board">
      <div class="board-title-row">
        {{ $t('algorithm.modelParamSetting') }}
        <!-- <div class="button-block">
          <button class="btn-m btn-default btn-has-icon"
          >
            <svg-icon icon-class="folder-plus" class="icon"></svg-icon>{{ $t('algorithm.create') }}
          </button>
        </div> -->
      </div>
      <div class="content">
        <div class="item-wrap">
          <div class="content-item">
            <div class="item-title">CNN {{ $t('algorithm.modelExtraLayers') }}: </div>
            <input 
              :value="0" 
              type="text" 
              class="input">
          </div>
          <div class="content-item">
            <div class="item-title"> {{ $t('algorithm.modelExtraLayers') }}: </div>
            <input 
              :value="0" 
              type="text" 
              class="input">
          </div>
        </div>
        <div class="item-wrap">
          <div class="content-item">
            <div class="item-title">{{ $t('algorithm.learningSpeed') }}: </div>
            <input 
              type="text" 
              class="input">
          </div>
          <div class="content-item">
            <div class="item-title">{{ $t('algorithm.trainningTimes') }}: </div>
            <input 
              :value="20" 
              type="text" 
              class="input">
          </div>
        </div>
        <div class="item-wrap">
          <div class="content-item">
            <div class="item-title">{{ $t('algorithm.trainingBatchSize') }}: </div>
            <input 
              :value="64" 
              type="text" 
              class="input">
          </div>
          <div class="content-item">
            <div class="item-title">{{ $t('algorithm.trainingAndVerificationDataRatio') }}: </div>
            <input 
              :value="0.8" 
              type="text" 
              class="input">
          </div>
        </div>
        <div class="content-item">
          <div class="item-title">{{ $t('algorithm.standardizedMethod') }}: </div>
          <default-select 
            :value="1"
            :option-list="[
              {value: 1, name: 'Range'},
            ]"
            class="tag-select input"
          />
        </div>
        <div class="content-item">
          <div class="item-title">{{ $t('algorithm.initParams') }}: </div>
          <default-select 
            :value="1"
            :option-list="[
              {value: 1, name: 'Gaussian'},
            ]"
            class="tag-select input"
          />
        </div>
      </div>
    </div>

    <div class="table-board">
      <div class="board-title-row">
        {{ $t('algorithm.realTimeDataSetting') }}
        <!-- <div class="button-block">
          <button class="btn-m btn-default btn-has-icon"
          >
            <svg-icon icon-class="folder-plus" class="icon"></svg-icon>{{ $t('algorithm.create') }}
          </button>
        </div> -->
      </div>
      <div class="content">
        <div class="content-item">
          <div class="item-title">{{ $t('algorithm.targetDataSource') }}: </div>
          <default-select 
            :option-list="[
              {value: 1, name: $t('algorithm.foxconnDemo')},
            ]"
            class="tag-select input"
          />
        </div>
        <div class="content-item">
          <div class="item-title">{{ $t('algorithm.targetDataFrame') }}: </div>
          <default-select 
            :option-list="[
              {value: 1, name: 'TemperatureData'},
              {value: 2, name: 'molding'},
            ]"
            class="tag-select input"
          />
        </div>
        <div class="content-item">
          <div class="item-title">{{ $t('algorithm.executionCycle') }}: </div>
          <default-select 
            :value="5"
            :option-list="[
              { value: 1, name: $tc('algorithm.second', 1) },
              { value: 2, name: $tc('algorithm.second', 15 ) },
              { value: 3, name: $tc('algorithm.second', 30) },
              { value: 4, name: $tc('algorithm.minuteLong', 1) },
              { value: 5, name: $tc('algorithm.minuteLong', 10) },
              { value: 6, name: $tc('algorithm.minuteLong', 15) },
              { value: 7, name: $tc('algorithm.minuteLong', 30) },
              { value: 8, name: $tc('algorithm.minuteLong', 40) },
              { value: 9, name: $tc('algorithm.minuteLong', 45) },
              { value: 10, name: $tc('algorithm.hourLong', 1) },
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
import DefaultMultiSelect from '@/components/select/DefaultMultiSelect'

export default {
  name: 'PageAlgorithmEdit',
  components: {
    DataTable,
    DefaultSelect,
    DefaultMultiSelect
  },
  data () {
    return {
      dataList: [
        {
          name: this.$t('algorithm.nthAlgorithm', { n: 1 }),
          creator: 'sygps',
          createDate: '2020/3/20',
          updateDate: '2020/3/20',
          status: this.$t('algorithm.executable')
        },
        {
          name: this.$t('algorithm.nthAlgorithm', { n: 2 }),
          creator: 'sygps',
          createDate: '2020/3/20',
          updateDate: '2020/3/20',
          status: this.$t('algorithm.executable')
        }
      ]
    }
  },
  computed: {
    tableHeaders () {
      return [
        {
          text: this.$t('algorithm.name'),
          value: 'name',
          sort: true
        //   link: {
        //     name: 'DataFileList'
        //   }
        },
        {
          text: this.$t('algorithm.creator'),
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
        { text: this.$t('editing.status'), value: 'status', width: '7.26%' },
        {
          text: this.$t('editing.action'),
          value: 'action',
          width: '180px',
          action: [
            {
              name: this.$t('algorithm.execute'),
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
  methods: {
    back () {
      this.$router.push('/algorithm')
    }
  },
}
</script>
<style lang="scss" scoped>
@import '@/styles/pages/_algorithm.scss';

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
      // display: flex;
      // flex-wrap: wrap;
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

        &.size-4 {
          width: 33%;
        }
        &.size-6 {
          width: 50%;
        }
        &.size-12 {
          width: 100%;
        }
      }
      .item-title {
        font-size: 14px;
        min-width: 80px;
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

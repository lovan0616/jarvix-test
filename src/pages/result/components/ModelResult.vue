<template>
  <div class="model-result result-board">
    <div class="board-header">
      <div class="board-name">
        <div class="question-mark">Q</div>
        <div class="question-name">{{ appQuestion }}</div>
      </div>
      <button
        class="btn-m btn-default save-button"
      >
        <svg-icon 
          :icon-class="isDownloading ? 'spinner' : 'download'" 
          class="icon"/>
        {{ $t('button.save') }}
        <div class="save-popup">
          <div 
            class="popup-box" 
            @click.stop="isShowSaveModelDialog = true">
            <div class="popup-text">儲存運算模型</div>
          </div>

          <div class="popup-box border-line">
            <div class="popup-text">儲存結果參數</div>
          </div>
        </div>
      </button>
    </div>
    <div class="result-board-body">
      <div class="accuracy-block">
        <div class="block-title">預測準確率</div>
        <spinner
          v-if="isLoading"
          class="task-spinner"
        />
        <div 
          v-else
          class="accuracy-precision">
          {{ accuracyPrecision }}
          <span class="unit-icon">%</span>
        </div>
      </div>
      <div class="charts-block">
        <div class="accuracy-chart">
          <div class="block-title">成交預測率</div>
          <spinner
            v-if="isLoading"
            class="task-spinner"
          />
          <display-parallel-bar-chart
            v-else
            :dataset="accuracyDataset"
            :title="accuracyTitle"
            :is-show-label-data="true"
            :height="'420px'"
          />
        </div>
        <div class="feature-chart">
          <div class="block-title">影響因子</div>
          <spinner
            v-if="isLoading"
            class="task-spinner"
          />
          <display-parallel-bar-chart
            v-else
            :dataset="featureDataset"
            :title="featureTitle"
            :is-show-label-data="true"
            :height="'420px'"
          />
        </div>
      </div>
    </div>
    <writing-dialog
      v-if="isShowSaveModelDialog"
      :title="'儲存演算模型'"
      :button="$t('button.save')"
      @closeDialog="closeDialog"
      @confirmBtn="saveModelResult"
    >
      <input 
        v-validate="`required`"
        ref="model-name"
        :value="`predicting_model`" 
        type="text" 
        class="input "
      >
    </writing-dialog>
  </div>
</template>
<script>
import { Message } from 'element-ui'
import { mapState } from 'vuex'
import DisplayParallelBarChart from '@/components/display/DisplayParallelBarChart.vue'
import WritingDialog from '@/components/dialog/WritingDialog'

export default {
  name: 'ModelResult',
  inject: ['$validator'],
  components: {
    DisplayParallelBarChart,
    WritingDialog
  },
  props: {
    resultInfo: {
      type: Object,
      default: () => {
        return { 
          title: null,
          description: null,
          unknown: null
        }
      }
    }
  },
  data () {
    return {
      isLoading: false,
      isDownloading: false,
      isShowSaveModelDialog: false,
      accuracyPrecision: 77,
      accuracyDataset: {
        columns: ["百分比"],
        data: [[32], [92]],
        display_columns: ["預測率"],
        display_index: [["成交"], ["沒有成交"]],
        index: [["成交"], ["沒有成交"]],
      },
      accuracyTitle: {
        xAxis: [
          {
            data_type: "string",
            dc_id: 92483,
            dc_name: "c2",
            display_name: "成交",
            drillable: true,
            is_feature: null,
            lowerLimit: null,
            operator: null,
            stats_type: "category",
            upperLimit: null
          },
          {
            data_type: "string",
            dc_id: 92483,
            dc_name: "c2",
            display_name: "沒有成交",
            drillable: true,
            is_feature: null,
            lowerLimit: null,
            operator: null,
            stats_type: "category",
            upperLimit: null
          }
        ],
        yAxis: [
          {
            data_type: "string",
            dc_id: 92483,
            dc_name: "c2",
            display_name: "百分比",
            drillable: true,
            is_feature: null,
            lowerLimit: null,
            operator: null,
            stats_type: "category",
            upperLimit: null
          },
          {
            data_type: null,
            dc_id: null,
            dc_name: null,
            display_name: "百分比",
            drillable: true,
            is_feature: null,
            lowerLimit: null,
            operator: null,
            stats_type: null,
            upperLimit: null
          }
        ]
      },
      featureDataset: {
        columns: ["欄位項目"],
        data: [[0.28], [0.27], [0.14], [0.08], [0.06]],
        display_columns: ["關係值"],
        display_index: [["有無折扣_無折扣"], ["業務人員職稱_專員"], ["業務人員性別_女"], ["業務人員職稱_主任"], ["客戶產業類別_金融投顧及保險業"]],
        index: [["有無折扣_無折扣"], ["業務人員職稱_專員"], ["業務人員性別_女"], ["業務人員職稱_主任"], ["客戶產業類別_金融投顧及保險業"]]
      },
      featureTitle: {
        xAxis: [
          {
            data_type: "string",
            dc_id: 92483,
            dc_name: "c2",
            display_name: "",
            drillable: true,
            is_feature: null,
            lowerLimit: null,
            operator: null,
            stats_type: "category",
            upperLimit: null
          }
        ],
        yAxis: [
          {
            data_type: "string",
            dc_id: 92483,
            dc_name: "c2",
            display_name: "",
            drillable: true,
            is_feature: null,
            lowerLimit: null,
            operator: null,
            stats_type: "category",
            upperLimit: null
          }
        ]
      }
    }
  },
  computed: {
    ...mapState('dataSource', ['appQuestion'])
  },
  mounted () {
    this.isLoading = true
    setTimeout(() => {
      this.isLoading = false
    }, 2 * 1000)
  },
  methods: {
    saveModelResult () {
      if (this.isDownloading) return
      this.isDownloading = true
      this.closeDialog()
      setTimeout(() => {
        this.isDownloading = false
        Message({
          message: '儲存模型成功',
          type: 'success',
          duration: 3 * 1000,
          showClose: true
        })
      }, 1000)
    },
    closeDialog () {
      this.isShowSaveModelDialog = false
    }
  }
}
</script>
<style lang="scss" scoped>
.model-result {
  background: rgb(0, 0, 0);
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.12);
  border-radius: 8px;
  border: 1px solid $theme-border-color;

  .board-header {
    position: relative;
    display: flex;
    z-index: 2;
    align-items: center;
    padding: 20px 28px;
    background-color: rgba(35, 61, 64, 0.6);
    border-radius: 5px 5px 0 0;
    border-bottom: 1px solid $theme-border-color;
    border-top: 5px solid $theme-color-primary;

    .board-name {
      flex: 1;
      display: flex;
      align-items: center;
      font-size: 30px;
      line-height: 38px;
      letter-spacing: 0.1em;
      color: $theme-text-color;
      margin-right: 16px;
    }

    .question-mark {
      width: 30px;
      height: 30px;
      background-color: $theme-color-primary;
      color: #fff;
      margin-right: 8px;
      font-size: 18px;
      font-weight: bold;
      border-radius: 8px;
      text-align: center;
      line-height: 30px;
    }

    .question-name {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      font-size: 30px;
      line-height: 38px;
      letter-spacing: 0.05em;
    }

    .save-button {
      position: relative;
      &:hover {
        .save-popup {
          visibility: visible;
        }
      }
    }
    
    .save-popup {
      visibility: hidden;
      width: 130px;
      position: absolute;
      top: 30px;
      right: -3px;
      background: #233131;
      border-radius: 8px;
      cursor: pointer;
      filter: drop-shadow(2px 2px 5px rgba(12, 209, 222, .5));

      &::after {
        content: '';
        position: absolute;
        right: 24px;
        top: -5px;
        width: 0px;
        height: 0px;
        border-bottom: 10px solid #233131;
        border-left: 10px solid transparent;
        border-right: 10px solid transparent; 
      }

      .popup-box {
        display: flex;
        padding: 0 12px;
        height: 40px;
        align-items: center;
        color: #a7a7a7;

        &:hover {
          color: #fff;
        }
      }

      .border-line {
        border-top: 1px solid #384545;
        border-bottom: 1px solid #384545; 
      }

      .popup-text {
        font-size: 14px;
        font-weight: 600;
      }
    }
  }

  .result-board-body {
    display: flex;
    position: relative;
    padding: 21px 28px;
    width: 100%;
    color: #FFFFFF;

    .block-title {
      margin-bottom: 7px;
      font-weight: 600;
      font-size: 16px;
      line-height: 200%;
    }

    .accuracy-block {
      flex-basis: 170px;

      .accuracy-precision {
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 4px;
        height: 90px;
        width: 90px;
        border: 1px solid #FFDF6F;
        border-radius: 100%;
        color: #FFDF6F;
        font-size: 32px;
      }

      .unit-icon {
        display: flex;
        justify-content: center;
        align-items: flex-end;
        height: 20px;
        font-size: 20px;
        line-height: 16px;
      }
    }

    .charts-block {
      flex: 1;
      width: 100%;
      min-width: 0;

      .task-spinner {
        height: 420px;
      }

      .accuracy-chart, .feature-chart {
        margin-bottom: 40px;
      }
    }
  }

  input {
    margin: 24px 0px;
    padding-bottom: 8px;
  }
}
</style>

<template>
  <writing-dialog
    :title="$t('monitorSetting.settingDialogTitle')"
    :button="$t('button.change')"
    :is-loading="isLoading"
    :show-both="true"
    class="writing-dialog"
    @closeDialog="cancelSetting"
    @confirmBtn="monitorSetting"
  >
    <form class="setting-form">
      <div class="info-block">
        <label 
          for="" 
          class="info-block__label">{{ $t('monitorSetting.enableMonitoring') }}</label>
        <ToggleButton
          v-model="settingInfo.status"
          :title="$t('monitorSetting.enableMonitoring')"
          name="status"
        />
      </div>
      <div class="info-block">
        <label 
          for="" 
          class="info-block__label">{{ $t('monitorSetting.autoRefresh') }}</label>
        <ToggleButton
          v-model="settingInfo.isAutoRefresh"
          :title="$t('monitorSetting.autoRefresh')"
          name="autoRefresh"
        />
      </div> 
      <div class="info-block">
        <label 
          for="" 
          class="info-block__label">{{ $t('monitorSetting.monitorColumn') }}</label>
        <default-select
          v-model="settingInfo.monitorColumnId"
          :option-list="monitorColumnList"
          class="tag-select input"
        />
      </div>
      <div class="info-block">
        <label 
          for="" 
          class="info-block__label">{{ $t('monitorSetting.dateColumn') }}</label>
        <default-select
          v-model="settingInfo.dateColumnId"
          :option-list="dateColumnList"
          class="tag-select input"
        />
      </div>
      <div class="info-block">
        <label 
          for="" 
          class="info-block__label">{{ $t('monitorSetting.timeScope') }}</label>
        <input-verify
          v-validate="'required'"
          v-model="settingInfo.timeScope"
          :placeholder="$t('editing.numericOnly')"
          name="monitorTimeScope"
          class="info-block__input"
        />
      </div>
      <div class="info-block">
        <label 
          for="" 
          class="info-block__label">{{ $t('monitorSetting.timeScopeUnit') }}</label>
        <default-select
          v-model="settingInfo.timeScopeUnit"
          :option-list="timeScopeUnitOptionList"
          class="tag-select input"
        />
      </div>
      <div class="info-block">
        <label 
          for="" 
          class="info-block__label">{{ $t('monitorSetting.aggregationType') }}</label>
        <default-select
          v-model="settingInfo.aggregation"
          :option-list="aggregationOptionList"
          class="tag-select input"
        />
      </div>
      <div class="info-block">
        <label 
          for="" 
          class="info-block__label">{{ $t('monitorSetting.monitorThreshold') }}</label>
        <input-verify
          v-validate="'required'"
          v-model="settingInfo.threshold.max"
          :placeholder="$t('editing.numericOnly')"
          name="monitorThreshold"
          class="info-block__input"
        />
      </div>
    </form>
  </writing-dialog>
</template>
<script>
import { getMonitorSetting, newMonitorSetting, updateMonitorSetting } from '@/API/Monitor'
import WritingDialog from '@/components/dialog/WritingDialog'
import InputVerify from '@/components/InputVerify'
import ToggleButton from '@/components/ToggleButton'
import DefaultSelect from '@/components/select/DefaultSelect'
import { mapState } from 'vuex'
import { getDataFrameColumnInfoById } from '@/API/DataSource'

export default {
  inject: ['$validator'],
  name: "MonitorSettingDialog",
  components: {
    WritingDialog,
    InputVerify,
    ToggleButton,
    DefaultSelect
  },
  props: {
    dataFrameId: {
      type: Number,
      default: null
    },
    componentId: {
      type: Number,
      default: null
    }
  },
  data () {
    return {
      isLoading: false,
      monitorColumnList: [],
      dateColumnList: [],
      aggregationOptionList: [
        { value: 'Sum', name: this.$t('aggregation.sum') },
        { value: 'Average', name: this.$t('aggregation.mean') },
        { value: 'Count', name: this.$t('aggregation.count') },
        { value: 'Max', name: this.$t('aggregation.max') },
        { value: 'Min', name: this.$t('aggregation.min') }
      ],
      timeScopeUnitOptionList: [
        { value: 'Second', name: this.$t('timeScopeUnit.second') },
        { value: 'Minute', name: this.$t('timeScopeUnit.minute') },
        { value: 'Hour', name: this.$t('timeScopeUnit.hour') },
        { value: 'Day', name: this.$t('timeScopeUnit.day') },
        { value: 'Week', name: this.$t('timeScopeUnit.week') },
        { value: 'Month', name: this.$t('timeScopeUnit.month') },
        { value: 'Season', name: this.$t('timeScopeUnit.season') },
        { value: 'Year', name: this.$t('timeScopeUnit.year') }
      ],
      settingInfo: {
        id: null,
        componentId: null,
        name: null,
        monitorColumnId: null,
        dateColumnId: null,
        timeScope: null,
        timeScopeUnit: null,
        aggregation: null,
        threshold: {
          max: null
        },
        userIdList: [],
        status: false,
        isAutoRefresh: false,
      }
    }
  },
  computed: {
    ...mapState('userManagement', ['userId']),
    timeScopeUnit () {
      return [
        {
          name: this.$t('timeScopeUnit.second'),
          value: 'Second'
        },
        {
          name: this.$t('timeScopeUnit.minute'),
          value: 'Minute'
        },
        {
          name: this.$t('timeScopeUnit.hour'),
          value: 'Hour'
        },
        {
          name: this.$t('timeScopeUnit.day'),
          value: 'Day'
        },
        {
          name: this.$t('timeScopeUnit.week'),
          value: 'Week'
        },
        {
          name: this.$t('timeScopeUnit.month'),
          value: 'Month'
        },
        {
          name: this.$t('timeScopeUnit.season'),
          value: 'Season'
        },
        {
          name: this.$t('timeScopeUnit.year'),
          value: 'Year'
        }
      ]
    }
  },
  mounted () {
    this.getDataFrameColumnInfo()
    this.getMonitorSettingInfo()
  },
  methods: {
    getDataFrameColumnInfo () {
      getDataFrameColumnInfoById(this.dataFrameId, true, true).then(response => {
        response.forEach(column => { 
          this.monitorColumnList.push({
              value: column.id,
              name: column.name
            })
          if(column.dataType === "DATETIME") {
            this.dateColumnList.push({
              value: column.id,
              name: column.name
            })
          }
        })
      })
    },
    getMonitorSettingInfo() {
      getMonitorSetting(this.componentId).then(response => {
        if(response.id === null) {
          this.settingInfo.componentId = this.componentId
          this.settingInfo.userIdList.push(this.userId)
        } else {
          this.settingInfo = {...response}
        }
        this.settingInfo.status = this.settingInfo.status === 'Enable' ? true : false
        this.settingInfo.timeScope = String(this.settingInfo.timeScope)
        this.settingInfo.threshold.max = String(this.settingInfo.threshold.max)
      })
    },
    monitorSetting () {
      this.$validator.validateAll().then(isValidated => {
        if(!isValidated) return

        let currentInfo = Object.assign({}, this.settingInfo)
        currentInfo.isAutoRefresh = currentInfo.isAutoRefresh === null ? false : true
        currentInfo.status = currentInfo.status ? 'Enable' : 'Disable'

        if(currentInfo.id === null) {
          newMonitorSetting(currentInfo)
        } else {
          updateMonitorSetting(currentInfo)
        }
      })
    },
    cancelSetting () {
      this.$emit('close')
    }
  }
}
</script>
<style lang="scss" scoped>
.setting-form {
  padding: 30px;

  .info-block {
    display: flex;
    align-items: center;
    justify-content: space-between;
    text-align: left;

    &__label {
      display: block;
    }

    .input {
      width: 150px;
    }

    &:not(:last-child) {
      margin-bottom: 10px;
    }

    /deep/ .input-verify {
      width: 150px;
      height: 30px;

      .input-verify-text {
        padding-left: 15px; 
        margin-bottom: 10px;
      }
    }

    /deep/ .input-error {
      bottom: -28px;
    }
  }

    /deep/ .toggle-button {
      height: 20px;

      .slider:before {
        height: 12px;
        width: 12px;
        left: 2px;
        bottom: 4px;
      }
      input:checked+.slider {
        background-color: $theme-color-primary;

        &:before {
          height: 12px;
          width: 12px;
          left: 0px;
          bottom: 4px;
        }
      }
    }
}
</style>

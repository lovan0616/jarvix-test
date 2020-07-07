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
      <div class="input-block">
        <label 
          for="" 
          class="input-block__label">啟用系統監測</label>
        <ToggleButton
          v-model="test"
          name="test"
          title="啟用系統監測"
        />
      </div>
      
      <input-verify
        v-model="settingInfo.threshold.max"
      />

    </form>
  </writing-dialog>
</template>
<script>
import WritingDialog from '@/components/dialog/WritingDialog'
import InputVerify from '@/components/InputVerify'
import ToggleButton from '@/components/ToggleButton'
import { mapState } from 'vuex'
import { getDataFrameColumnInfoById } from '@/API/DataSource'

export default {
  name: "MonitorSettingDialog",
  components: {
    WritingDialog,
    InputVerify,
    ToggleButton
  },
  props: {
    componentId: {
      type: Number,
      default: null
    }
  },
  data () {
    return {
      isLoading: false,
      test: false,
      settingInfo: {
        aggregation: null,
        componentId: null,
        dateColumnId: null,
        monitorColumnId: null,
        name: null,
        status: null,
        threshold: {
          max: null
        },
        timeScope: null,
        timeScopeUnit: null,
        userId: null
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
  },
  methods: {
    getDataFrameColumnInfo () {
      // getDataFrameColumnInfoById(this.dataFrameId, false, true)
    },
    monitorSetting () {

    },
    cancelSetting () {

    }
  }
}
</script>
<style lang="scss" scoped>
.setting-form {
  .input-block {
    text-align: left;

    &__label {
      display: block;
    }
  }
}
</style>

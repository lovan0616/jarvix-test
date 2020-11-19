<template>
  <section class="war-room-setting">
    <div class="war-room-setting__header">
      <div class="war-room-setting__title">
        <svg-icon 
          icon-class="control-board" 
          class="war-room-setting__header-icon"/>
        {{ $t('warRoom.warRoomSetting') }}
      </div>
      <span
        class="war-room-setting__close-icon"
        @click="$emit('close')">
        <svg-icon 
          icon-class="close" 
          class="war-room-setting__header-icon"/>
      </span>
    </div>
    <section class="war-room-setting__content">
      <div class="war-room-setting__block-container">
        <div class="war-room-setting__block">
          <div class="war-room-setting__block-title">
            {{ $t('warRoom.publishedName') }}
          </div>
          <input
            v-validate="'required'"
            v-model="warRoomData.publishName"
            name="warRoomName"
            class="input war-room-setting__block-text-input">
          <div 
            v-show="errors.has('warRoomName')"
            class="error-text"
          >{{ errors.first('warRoomName') }}</div>
        </div>
        <div class="war-room-setting__block">
          <div class="war-room-setting__block-title">
            {{ $t('warRoom.timeIntervalConstraint') }}
            <el-switch
              v-model="warRoomData.displayDateRangeSwitch"
              :disabled="isProcessing"
              :width="32"
              active-color="#2AD2E2"
              inactive-color="#324B4E"
              @change="updateDateRangeSwitch"
            />
          </div>
          <div
            v-if="warRoomData.displayDateRangeSwitch"
            class="war-room-setting__block-select-field"
          >
            <default-select 
              v-validate="'required'"
              :value="selectedTimeInterval"
              :option-list="warRoomTimeIntervalList"
              :placeholder="$t('warRoom.chooseTimeInterval')"
              :is-disabled="isProcessing"
              class="war-room-setting__block-select"
              name="timeIntervalConstraint"
              @change="updateTimeInterval"
            />
            <div 
              v-show="errors.has('timeIntervalConstraint')"
              class="error-text"
            >{{ errors.first('timeIntervalConstraint') }}</div>
          </div>
          <div
            v-if="warRoomData.displayDateRangeSwitch && selectedTimeInterval === 'others'"
            class="war-room-setting__block-date-field date-picker"
          >
            <div class="date-picker__container">
              <el-date-picker
                v-validate="'required'"
                ref="startTime"
                v-model="warRoomData.customStartTime"
                :picker-options="customTimeInterval.startTimePickerOptions"
                :placeholder="$t('warRoom.startDate')"
                :clearable="true"
                :class="{ 'has-error': errors.first('startTime') }"
                :disabled="isProcessing"
                value-format="yyyy-MM-dd"
                class="date-picker__item"
                size="small"
                type="date"
                name="startTime"
                @change="clearEndTime"/>
              <div class="date-picker__seperator">-</div>
              <el-date-picker
                v-model="warRoomData.customEndTime"
                :picker-options="customTimeInterval.endTimePickerOptions"
                :placeholder="'*' + $t('warRoom.endDate')"
                :clearable="true"
                :disabled="isProcessing || !warRoomData.customStartTime"
                value-format="yyyy-MM-dd"
                class="date-picker__item"
                size="small"
                type="date"
                name="endTime"/>
            </div>
            <div
              v-show="errors.has('startTime')"
              class="error-text"
            >{{ errors.first('startTime') }}</div>
            <div class="date-picker__reminder">{{ '*' + $t('warRoom.timeIntervalReminder') }}</div>
          </div>
        </div>
        <div class="war-room-setting__block">
          <div class="war-room-setting__block-title">
            {{ $t('warRoom.recipientList') }}
          </div>
          <el-select
            v-model="warRoomData.alertUserIdList" 
            :placeholder="$t('editing.defaultOption')" 
            multiple
            filterable
            popper-class="multiple-selector__popper"
            class="multiple-selector"
            @remove-tag="removeTag"
            @change="listChange">
            <el-option
              v-for="item in alertUserIdList"
              :disabled="!hasRemovePermission(item.value)"
              :key="item.value"
              :label="item.name"
              :value="item.value"/>
          </el-select>
          <span 
            class="war-room-setting__block-text-description">
            {{ $t('warRoom.recipientListSettingWarning') }} 
          </span>
        </div>
      </div>
      <div class="war-room-setting__button-block">
        <button
          type="button"
          class="btn btn-outline war-room-setting__button-block-button--left"
          @click="confirmDeleteWarRoom"
        >
          <svg-icon icon-class="delete" />
        </button>
        <button 
          type="button"
          class="btn btn-default war-room-setting__button-block-button--right"
          @click="saveSetting"
        >{{ $t('button.save') }}</button>
      </div>
    </section>
    <decide-dialog
      v-if="isShowDeleteWarRoom"
      :title="$t('warRoom.confirmDeleteWarRoom')"
      :type="'delete'"
      :btn-text="$t('button.confirm')"
      :is-processing="isProcessing"
      @closeDialog="closeConfirmDeleteWarRoom"
      @confirmBtn="deleteWarRoom"
    />
  </section>
</template>

<script>
import { getGroupUserList } from '@/API/Group'
import DefaultSelect from '@/components/select/DefaultSelect'
import DecideDialog from '@/components/dialog/DecideDialog'
import { Message } from 'element-ui'
import { mapState } from 'vuex'
import {
  updateWarRoomSetting,
  deleteWarRoom
} from '@/API/WarRoom'

export default {
  name: 'WarRoomSetting',
  inject: ['$validator'],
  components: {
    DefaultSelect,
    DecideDialog
  },
  props: {
    configData: {
      type: Object,
      default: () => ({
        alertUserIdList:null,
        customEndTime: null,
        customStartTime: null,
        displayDateRangeSwitch: false,
        publishName: null,
        recentTimeIntervalAmount: null,
        recentTimeIntervalUnit: null
      })
    }
  },
  data () {
    return {
      warRoomData: null,
      isLoading: false,
      isProcessing: false,
      userList: null,
      tempAlertUserIdList: null,
      alertUserIdList: null,
      customTimeInterval: {
        startTime: '',
        endTime: '',
        startTimePickerOptions: {
          disabledDate(time) {
            return time.getTime() > Date.now()
          },
          firstDayOfWeek: 1
        },
        endTimePickerOptions: {
          disabledDate: this.disabledDueDate,
          firstDayOfWeek: 1
        }
      },
      isShowDeleteWarRoom: false
    }
  },
  computed: {
    ...mapState('userManagement', ['userId']),
    isGroupViewer () {
      return this.userList.filter(user => user.id === this.userId)[0]['role'] === 'group_viewer'
    },
    selectedTimeInterval () {
      if (!this.warRoomData || !this.warRoomData.displayDateRangeSwitch) return null
      
      // 確認是否選擇預設區間
      if (this.warRoomData.recentTimeIntervalAmount && this.warRoomData.recentTimeIntervalUnit) {
        return `${this.warRoomData.recentTimeIntervalAmount}+${this.warRoomData.recentTimeIntervalUnit}`
      }
      
      // 如果沒有選擇預設則為自訂區間
      return 'others'
    }
  },
  mounted () {
    this.warRoomData = JSON.parse(JSON.stringify(this.configData))
    this.tempAlertUserIdList = this.warRoomData.alertUserIdList
    this.fetchData()
  },
  methods: {
    fetchData () {
      this.isLoading = true
      const currentGroupId = this.$route.params.group_id
      getGroupUserList(currentGroupId)
        .then(userList => {
          this.userList = userList
          this.alertUserIdList = userList.map(user => {
            return {
              value: user.id,
              name: user.name
            }
          })
        })
        .finally(() => {
          this.isLoading = false
        })
    },
    saveSetting () {
      this.$validator.validateAll().then(result => {
        if (!result) return
        this.isProcessing = true
        const { war_room_id: id } = this.$route.params
        updateWarRoomSetting(id, this.warRoomData)
          .then(() => {
            Message({
              message: this.$t('message.saveSuccess'),
              type: 'success',
              duration: 3 * 1000,
              showClose: true
            })
            this.$emit('update:config-data', this.warRoomData)
            this.$emit('updated')
            this.$emit('close')
          })
          .finally(() => { this.isProcessing = false })
      })
    },
    confirmDeleteWarRoom () {
      this.isShowDeleteWarRoom = true
    },
    closeConfirmDeleteWarRoom () {
      this.isShowDeleteWarRoom = false
    },
    deleteWarRoom () {
      const { war_room_id: id } = this.$route.params
      this.isProcessing = true
      deleteWarRoom(id)
        .then(() => {
          this.$router.push({ name: 'WarRoomList' })
          Message({
            message: this.$t('message.deleteSuccess'),
            type: 'success',
            duration: 3 * 1000,
            showClose: true
          })
          this.closeConfirmDeleteWarRoom()
        })
        .finally(() => { this.isProcessing = false })
    },
    updateTimeInterval (value) {
      const isDefaultTimeInterval = value.indexOf('+') !== -1

      // 選擇自訂
      if (!isDefaultTimeInterval) {
        this.warRoomData.recentTimeIntervalAmount = null
        this.warRoomData.recentTimeIntervalUnit = null
        return
      }

      // 選擇預設時間區間
      // 避免自訂欄位資料被清空觸發重新驗證，但欄位已經被 v-if 移除產生錯誤
      this.$validator.detach('startTime')
      this.warRoomData.recentTimeIntervalAmount = value.split('+')[0]
      this.warRoomData.recentTimeIntervalUnit = value.split('+')[1]
      this.warRoomData.customEndTime = null
      this.warRoomData.customStartTime = null
    },
    disabledDueDate (time) {
      return time.getTime() < new Date(this.warRoomData.customStartTime).getTime() || time.getTime() > Date.now()
    },
    clearEndTime () {
      this.warRoomData.customEndTime = null
    },
    updateDateRangeSwitch (isTurnedOn) {
      if(isTurnedOn) return
      const {
        customStartTime,
        customEndTime,
        recentTimeIntervalAmount,
        recentTimeIntervalUnit
      } = JSON.parse(JSON.stringify(this.configData))
      // 關閉時，恢復原本預設，避免存取時送錯的格式給後端
      this.$nextTick(() => {
        this.warRoomData.customStartTime = customStartTime
        this.warRoomData.customEndTime = customEndTime
        this.warRoomData.recentTimeIntervalAmount = recentTimeIntervalAmount
        this.warRoomData.recentTimeIntervalUnit = recentTimeIntervalUnit
      })
    },
    hasRemovePermission (removeUserId) {
      return this.isGroupViewer 
        ? this.userId === removeUserId
        : true
    },
    listChange (newList) {
      const isRemoveSelf = (newList.length < this.tempAlertUserIdList.length) && !newList.includes(this.userId) && this.tempAlertUserIdList.includes(this.userId)
      // 表示加入的是使用者自己，故需要被存起來
      if(newList.length > this.tempAlertUserIdList.length || isRemoveSelf) {
        this.tempAlertUserIdList = newList
      }
    },
    removeTag (removeUserId) {
      if(this.hasRemovePermission(removeUserId)) return
      //  非 group__viewer 無權限可移除其他使用者，故要用 temp 覆蓋
      this.warRoomData.alertUserIdList = this.tempAlertUserIdList
    }
  }
}
</script>

<style lang="scss" scoped>
.war-room-setting {
  &__block-select {
    /deep/.sy-select.theme-dark {
      .el-input__inner {
        border-bottom: 1px solid #FFFFFF;
      }
    }
  }

  &__content {
    justify-content: space-between;

    .multiple-selector {
      margin-top: 12px;
      
      /deep/ .el-select-dropdown__wrap .el-select-dropdown__item::after {
        border: 1.2px solid #FFF;
      }
    }
  }

  &__button-block-button {
    &--left {
      min-width: 40px;
      padding: 0 2px;
    }

    &--right {
      min-width: 180px;
      font-weight: 600;
    }
  }
}
</style>
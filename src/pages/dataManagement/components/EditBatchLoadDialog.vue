<template>
  <div class="edit-batch-load-dialog full-page-dialog">
    <div class="dialog-container">
      <div class="dialog-title">
        {{ $t('batchLoad.setBatchLoad') }}
        <a
          href="javascript:void(0)"
          class="close-btn"
          @click="closeDialog"
        ><svg-icon icon-class="close" /></a>
      </div>
      <div class="dialog__sub-title">
        {{ $t('editing.dataFrame') }}: {{ dataFrameInfo.primaryAlias }}
      </div>
      <spinner
        v-if="isLoading"
        :title="$t('editing.loading')"
        size="50"
      />
      <empty-info-block
        v-else-if="hasError"
        :msg="$t('message.systemIsError')"
      />
      <template v-else>
        <div class="setting-block">
          <div class="setting-block__title">
            {{ $t('batchLoad.updateSetting') }}
          </div>
          <div
            v-for="status in updateStatusList"
            :key="status.type"
            class="input-radio-group"
          >
            <input
              :id="status.type.toLowerCase()"
              :checked="status.type === columnInfo.status"
              :value="status.type"
              name="status"
              class="input-radio"
              type="radio"
              @change="columnInfo.status = status.type"
            >
            <label
              :for="status.type.toLowerCase()"
              class="input-radio-label"
            >{{ status.name }}</label>
          </div>
          <button
            v-if="columnInfo.id && columnInfo.status === 'MANUAL' && !hasSettingDataChanged"
            :disabled="isProcessing"
            class="btn btn-default"
            @click="updateImmediately"
          >
            {{ $t('button.updateImmediately') }}
          </button>
        </div>
        <template v-if="columnInfo.status !== 'DISABLE'">
          <div class="setting-block">
            <div class="setting-block__title">
              {{ $t('batchLoad.updateContent') }}
            </div>
            <div class="input-field">
              <div class="input-field__label">
                {{ $t('batchLoad.updateMode') }}
              </div>
              <div class="input-field__warning">
                <svg-icon icon-class="data-explanation" />
                {{ $t('batchLoad.reimportReminder') }}
              </div>
              <div class="input-field__input-wrapper">
                <div
                  v-for="mode in updateTypeList"
                  :key="mode.type"
                  class="input-radio-group"
                >
                  <input
                    v-validate="'required'"
                    :id="mode.type.toLowerCase()"
                    :checked="mode.type === columnInfo.type"
                    :value="mode.type"
                    name="type"
                    class="input-radio"
                    type="radio"
                    @change="columnInfo.type = mode.type"
                  >
                  <label
                    :for="mode.type.toLowerCase()"
                    class="input-radio-label"
                  >{{ mode.name }}</label>
                </div>
                <div
                  v-show="errors.has('type')"
                  class="error-text"
                >
                  {{ errors.first('type') }}
                </div>
              </div>
            </div>
            <template v-if="columnInfo.type === 'UPDATE' && dateTimeColumnList.length > 0">
              <div class="input-field">
                <label class="input-field__label">{{ $t('batchLoad.updatedTimeColumn') }}</label>
                <div class="input-field__input">
                  <default-select
                    v-validate="'required'"
                    v-model="columnInfo.updateDateColumn"
                    :option-list="dateTimeColumnList"
                    :placeholder="$t('batchLoad.chooseColumn')"
                    :is-disabled="isProcessing"
                    filterable
                    class="input-field__select"
                    name="updatedTimeColumn"
                  />
                  <div
                    v-show="errors.has('updatedTimeColumn')"
                    class="error-text"
                  >
                    {{ errors.first('updatedTimeColumn') }}
                  </div>
                </div>
              </div>
              <div class="input-field">
                <label class="input-field__label">{{ $t('batchLoad.primaryKeyColumns') }}</label>
                <div class="input-field__input">
                  <default-multi-select
                    v-validate="'required'"
                    :value="primaryKeys"
                    :option-list="columnInfo.columnList"
                    :placeholder="$t('batchLoad.chooseColumn')"
                    :is-disabled="isProcessing"
                    filterable
                    multiple
                    class="input-field__multi-select"
                    name="primaryKeyColumn"
                    @input="primaryKeys = $event"
                  />
                  <div
                    v-show="errors.has('primaryKeyColumn')"
                    class="error-text"
                  >
                    {{ errors.first('primaryKeyColumn') }}
                  </div>
                </div>
              </div>
              <div class="input-field">
                <label class="deletable-checkbox">
                  <div class="checkbox-label">
                    <input
                      v-model="columnInfo.deletable"
                      type="checkbox"
                    >
                    <div class="checkbox-square" />
                  </div>
                  <span>{{ $t('batchLoad.checkDatarowDeletable') }}</span>
                </label>
              </div>
            </template>
            <template v-if="isUpdateWithoutDateTimeColumn">
              <empty-info-block
                :msg="$t('editing.emptyDateTime')"
              />
            </template>
          </div>
        </template>
        <div
          v-if="columnInfo.status === 'AUTO'"
          class="setting-block"
        >
          <div class="setting-block__title">
            {{ $t('batchLoad.scheduleSetting') }}
          </div>
          <div class="timeZone">
            <p class="group-title">
              {{ $t('common.timezone') }}
            </p>
            <time-zone-select
              v-validate="'required'"
              v-model="columnInfo.timeZone"
              name="timeZone"
            />
          </div>
          <div class="cycle-setting">
            <p class="group-title">
              {{ $t('batchLoad.cycleSetting') }}
            </p>
            <div
              v-for="option in updateCronSettingOptionList"
              :key="option.mode"
              class="input-radio-group cron-seletor"
            >
              <input
                v-validate="'required'"
                :id="option.mode.toLowerCase()"
                :checked="option.mode === columnInfo.mode"
                :value="option.mode"
                v-model="columnInfo.mode"
                name="mode"
                class="input-radio"
                type="radio"
              >
              <label
                :for="option.mode.toLowerCase()"
                class="input-radio-label"
              >{{ option.name }}</label>
            </div>
          </div>
          <div
            v-show="errors.has('mode')"
            class="error-text"
          >
            {{ errors.first('mode') }}
          </div>
          <div
            v-if="columnInfo.mode === 'BASIC'"
            class="input-field input-field--basic"
          >
            <div class="input-field__input">
              <default-select
                v-validate="'required'"
                v-model="cronSettingValueBasic"
                :option-list="scheduleInfo.basicScheduleList"
                :placeholder="$t('batchLoad.chooseCycle')"
                :is-disabled="isProcessing"
                class="input-field__select"
                name="basicScheduleColumn"
              />
              <div
                v-show="errors.has('basicScheduleColumn')"
                class="error-text"
              >
                {{ errors.first('basicScheduleColumn') }}
              </div>
            </div>
          </div>
          <div
            v-else-if="columnInfo.mode === 'ADVANCED'"
            class="cron-time"
          >
            <div class="cron-time__setting">
              <div
                v-for="time in cronSettingValueAdvanced"
                :key="time.unit"
                class="cron-time__input"
              >
                <input-block
                  :label="time.unit"
                  v-model="time.value"
                />
              </div>
            </div>
            <div class="cron-info">
              <div
                v-for="info in settingInfo"
                :key="info.title"
                class="cron-info__block"
              >
                <span class="cron-info__title"> {{ info.title }} </span>
                <ul>
                  <li
                    v-for="(item, index) in info.content"
                    :key="index"
                    class="cron-info__list"
                  >
                    {{ item }}
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <template v-if="hasSettingDataChanged">
          <div class="button__block">
            <button
              class="btn btn-outline"
              @click="closeDialog"
            >
              {{ $t('button.cancel') }}
            </button>
            <button
              :disabled="isProcessing || isUpdateWithoutDateTimeColumn"
              class="btn btn-default"
              @click="columnInfo.id ? updateBatchLoad() : setBatchLoad()"
            >
              {{ $t('button.save') }}
            </button>
          </div>
        </template>
      </template>
    </div>
  </div>
</template>

<script>
import moment from 'moment-timezone'
import DefaultSelect from '@/components/select/DefaultSelect'
import DefaultMultiSelect from '@/components/select/DefaultMultiSelect'
import TimeZoneSelect from '@/components/select/TimeZoneSelect.vue'
import InputBlock from '@/components/InputBlock'
import EmptyInfoBlock from '@/components/EmptyInfoBlock'
import {
  getDataFrameColumnInfoById,
  getBatchLoadSetting,
  setBatchLoad,
  updateBatchLoadSetting,
  triggerUpdateData
} from '@/API/DataSource'
import { Message } from 'element-ui'

export default {
  name: 'EditBatchLoadDialog',
  inject: ['$validator'],
  components: {
    DefaultSelect,
    InputBlock,
    DefaultMultiSelect,
    EmptyInfoBlock,
    TimeZoneSelect
  },
  props: {
    dataFrameInfo: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      columnInfo: {},
      originalColumnInfo: {},
      primaryKeys: [],
      originalPrimaryKeys: [],
      updateStatusList: [
        {
          type: 'DISABLE',
          name: this.$t('batchLoad.noUpdate')
        },
        {
          type: 'AUTO',
          name: this.$t('batchLoad.autoUpdate')
        },
        {
          type: 'MANUAL',
          name: this.$t('batchLoad.manualUpdate')
        }
      ],
      updateTypeList: [
        {
          type: 'UPDATE',
          name: this.$t('batchLoad.dataFrameUpdate')
        },
        {
          type: 'REIMPORT',
          name: this.$t('batchLoad.rebuild')
        }
      ],
      updateCronSettingOptionList: [
        {
          mode: 'BASIC',
          name: this.$t('batchLoad.basicSetting')
        },
        {
          mode: 'ADVANCED',
          name: this.$t('batchLoad.advancedSetting')
        }
      ],
      cronSettingValueBasic: '',
      cronSettingValueAdvanced: [
        {
          unit: this.$t('batchLoad.minute'),
          value: '0'
        },
        {
          unit: this.$t('batchLoad.hour'),
          value: '0'
        },
        {
          unit: this.$t('batchLoad.day'),
          value: '*'
        },
        {
          unit: this.$t('batchLoad.month'),
          value: '*'
        },
        {
          unit: this.$t('batchLoad.week'),
          value: '*'
        }
      ],
      settingInfo: [
        {
          title: this.$t('batchLoad.settingInfo.value'),
          content: [
            this.$t('batchLoad.settingInfo.minute'),
            this.$t('batchLoad.settingInfo.hour'),
            this.$t('batchLoad.settingInfo.day'),
            this.$t('batchLoad.settingInfo.month'),
            this.$t('batchLoad.settingInfo.week')
          ]
        },
        {
          title: this.$t('batchLoad.settingInfo.specialCharacters'),
          content: [
            this.$t('batchLoad.settingInfo.star'),
            this.$t('batchLoad.settingInfo.comma'),
            this.$t('batchLoad.settingInfo.minus'),
            this.$t('batchLoad.settingInfo.slash')
          ]
        }
      ],
      scheduleInfo: {
        basicScheduleList: [
          {
            value: null,
            name: this.$t('editing.defaultOption')
          },
          {
            value: '* * * * *',
            name: this.$t('warRoom.everyMinute', { number: 1 })
          },
          {
            value: '*/5 * * * *',
            name: this.$t('batchLoad.everyMinute', { number: 5 })
          },
          {
            value: '*/15 * * * *',
            name: this.$t('batchLoad.everyMinute', { number: 15 })
          },
          {
            value: '*/30 * * * *',
            name: this.$t('batchLoad.everyMinute', { number: 30 })
          },
          {
            value: '0 * * * *',
            name: this.$t('batchLoad.everyHour')
          },
          {
            value: '0 0 * * *',
            name: this.$t('batchLoad.everyDay')
          },
          {
            value: '0 0 * * 0',
            name: this.$t('batchLoad.everyWeek')
          },
          {
            value: '0 0 1 * *',
            name: this.$t('batchLoad.everyMonth')
          }
        ]
      },
      isLoading: false,
      isProcessing: false,
      hasError: false
    }
  },
  computed: {
    isUpdateWithoutDateTimeColumn () {
      return this.columnInfo.type === 'UPDATE' && this.dateTimeColumnList.length === 0
    },
    dateTimeColumnList () {
      return this.columnInfo.columnList.filter(column => column.dataType === 'DATETIME')
    },
    hasSettingDataChanged () {
      // compare primary key lists
      const primaryKeysSet = new Set(this.primaryKeys)
      const isSamePrimaryKeyList = this.originalPrimaryKeys.every(key => primaryKeysSet.has(key))
      if (this.primaryKeys.length !== this.originalPrimaryKeys.length || !isSamePrimaryKeyList) return true

      // compare column info objects
      for (let key in this.originalColumnInfo) {
        if (this.originalColumnInfo[key] !== this.columnInfo[key]) return true
      }

      // compare cron setting
      if (this.columnInfo.mode === 'ADVANCED') {
        if (this.composedAdvancedCronSetting !== this.originalColumnInfo.cron) return true
      }
      if (this.columnInfo.mode === 'BASIC') {
        if (this.cronSettingValueBasic !== this.originalColumnInfo.cron) return true
      }

      return false
    },
    composedAdvancedCronSetting () {
      return this.cronSettingValueAdvanced.reduce((acc, cur, index, arr) => acc + cur.value + (index === arr.length - 1 ? '' : ' '), '')
    }
  },
  mounted () {
    this.getBatchSetting()
  },
  methods: {
    getBatchSetting () {
      this.isLoading = true
      getBatchLoadSetting(this.dataFrameInfo.id)
        .then(({ crontabConfigContent, primaryKeys }) => {
          this.columnInfo = JSON.parse(JSON.stringify(crontabConfigContent))
          this.originalColumnInfo = JSON.parse(JSON.stringify(crontabConfigContent))
          if (crontabConfigContent && !crontabConfigContent.timeZone) {
            this.columnInfo.timeZone = moment.tz.guess() // 用當地 timeZone
            this.originalColumnInfo.timeZone = this.columnInfo.timeZone
          }
          this.primaryKeys = JSON.parse(JSON.stringify(primaryKeys)) || []
          this.originalPrimaryKeys = JSON.parse(JSON.stringify(primaryKeys)) || []

          // 將原cron設定還原到表單上
          if (crontabConfigContent.cron) {
            const crons = crontabConfigContent.cron.split(' ')
            this.cronSettingValueAdvanced.forEach((item, index) => item.value = crons[index])
            const matchedOption = this.scheduleInfo.basicScheduleList.find(item => item.value === crontabConfigContent.cron)
            this.cronSettingValueBasic = matchedOption ? crontabConfigContent.cron : null
            // 為了如果有基本設定被移除的話能夠向下兼容
            if (!matchedOption && crontabConfigContent.mode === 'BASIC') {
              this.columnInfo.mode = 'ADVANCED'
              this.originalColumnInfo.mode = 'ADVANCED'
            }
          }

          this.fetchDataColumnList()
        })
        .catch(() => {
          this.isLoading = false
          this.hasError = true
        })
    },
    fetchDataColumnList () {
      const hasFeatureColumn = false
      getDataFrameColumnInfoById(this.dataFrameInfo.id, hasFeatureColumn)
        .then(response => {
          this.columnInfo.columnList = response.map(column => ({
            ...column,
            name: column.primaryAlias || column.name,
            value: column.id
          }))
          this.isLoading = false
        })
        .catch(() => {
          this.isLoading = false
          this.hasError = true
        })
    },
    formatSettingData () {
      return {
        cron: this.columnInfo.mode === 'BASIC' ? this.cronSettingValueBasic : this.composedAdvancedCronSetting,
        primaryKeys: this.primaryKeys,
        status: this.columnInfo.status,
        type: this.columnInfo.type,
        mode: this.columnInfo.mode,
        updateDateColumn: this.columnInfo.updateDateColumn,
        deletable: this.columnInfo.deletable === null ? false : this.columnInfo.deletable,
        timeZone: this.columnInfo.timeZone
      }
    },
    setSetting () {
      const dataFrameId = this.dataFrameInfo.id
      const settingData = this.formatSettingData()
      return setBatchLoad(dataFrameId, settingData)
        .then(() => {
          Message({
            message: this.$t('message.saveSuccess'),
            type: 'success',
            duration: 3 * 1000,
            showClose: true
          })
        })
    },
    setBatchLoad () {
      this.$validator.validateAll()
        .then(result => {
          if (!result) return
          this.isProcessing = true
          this.setSetting()
            .then(() => {
              if (this.columnInfo.status === 'MANUAL') return this.updateImmediately()
              this.closeDialog()
            })
            .finally(() => this.isProcessing = false)
        })
    },
    updateSetting () {
      const dataFrameId = this.dataFrameInfo.id
      const settingData = this.formatSettingData()
      return updateBatchLoadSetting(dataFrameId, settingData)
        .then(() => {
          Message({
            message: this.$t('message.saveSuccess'),
            type: 'success',
            duration: 3 * 1000,
            showClose: true
          })
        })
    },
    updateBatchLoadSetting () {
      this.$validator.validateAll()
        .then(result => {
          if (!result) return
          this.isProcessing = true

          this.updateSetting()
            .then(() => {
              if (this.columnInfo.status === 'MANUAL') return this.updateImmediately()
              this.closeDialog()
            })
            .finally(() => this.isProcessing = false)
        })
    },
    updateImmediately () {
      this.isProcessing = true
      const dataFrameId = this.dataFrameInfo.id
      return triggerUpdateData(dataFrameId).then(() => {
        Message({
          message: this.$t('batchLoad.startUpdate'),
          type: 'success',
          duration: 3 * 1000,
          showClose: true
        })
        this.closeDialog()
      }).finally(() => this.isProcessing = false)
    },
    updateBatchLoad () {
      this.updateBatchLoadSetting()
    },
    closeDialog () {
      this.$emit('close')
    }
  }
}
</script>

<style lang="scss" scoped>
.edit-batch-load-dialog {
  .dialog {
    &__sub-title {
      margin-bottom: 12px;
      font-size: 14px;
    }
  }

  .setting-block {
    position: relative;
    padding: 24px;
    background-color: rgba(50, 58, 58, 0.95);
    border-radius: 5px;
    margin-bottom: 12px;

    &__switch {
      position: absolute;
      right: 24px;
      top: 24px;

      ::v-deep .el-switch__label {
        color: #CCCCCC;
      }

      ::v-deep .el-switch__core {
        height: 10px;
        border: unset;

        &::after {
          top: 50%;
          transform: translateY(-50%);
        }
      }
    }

    &__title {
      font-weight: 600;
      font-size: 18px;
      line-height: 1;
      margin-bottom: 16px;
    }

    .input-field {
      display: flex;
      flex-direction: column;
      &--basic {
        .input-field__input {
          width: 50%;
          .el-select {
            width: 100%;
          }
        }
      }

      &:not(:last-of-type) {
        margin-bottom: 24px;
      }

      &__multi-select {
        width: 100%;
      }

      &__label {
        font-size: 14px;
        color: #CCCCCC;
      }

      &__warning {
        font-size: 13px;
        color: var(--color-warning);
      }

      &__select,
      &__multi-select {
        border-bottom: 1px solid #fff;
      }

      &__input-wrapper {
        margin-top: 8px;
      }

      .deletable-checkbox {
        display: flex;
        align-items: center;
        width: fit-content;
        .checkbox-label {
          margin-right: 12px;
        }
      }
      ::v-deep .el-input__inner {
        font-size: 14px;
        padding-left: 0;

        &::placeholder {
          color: #AAAAAA;
        }
      }

      ::v-deep .el-input {
        &.is-disabled {
          .el-input__inner {
            background-color: transparent;
          }
        }
      }
    }

    .cron-time {
      display: flex;
      flex-direction: row;
      margin-top: 37px;
      height: 360px;

      &__setting {
        width: 50%;
        margin-right: 16px;
      }

      &__input {
        margin-bottom: 37px;

        >>> .input-block .placeholder {
          color: #CCC;
        }
      }

      .cron-info {
        width: 48%;
        padding: 16px;
        background: rgba(72, 84, 84, 0.95);
        border-radius: 8px;
        overflow-y: scroll;
        ::-webkit-scrollbar-track {
          background-color: transparent;
        }

        &__block {
          margin-bottom: 16px;

          ul {
            margin-block-start: 6px;
            margin-block-end: 16px;
            padding-inline-start: 20px !important;
          }
        }

        &__title, &__list {
          font-size: 14px;
          line-height: 20px;
          color: #CCC;
        }

        &__title {
          color: $theme-color-white;
        }

        &__list {
          &:not(:last-child) {
            margin-bottom: 6px;
          }
        }
      }
    }
  }

  .timeZone {
    width: 50%;
    margin-bottom: 16px;
    ::v-deep .el-select {
      width: 100%;
    }
  }

  .button {
    &__block {
      display: flex;
      justify-content: flex-end;

      .btn:not(:last-child) {
        margin-right: 20px;
      }
    }
  }

  ::v-deep .sy-multi-select.theme-dark {
    .el-tag {
      border-color: #2AD2E2;
      color: #2AD2E2;
    }

    .el-tag__close.el-icon-close {
      background-color: #2AD2E2;
    }
  }

  .cycle-setting {
    display: flex;
    flex-wrap: wrap;
    .group-title {
      flex: 0 0 100%;
    }
    .cron-seletor {
      flex: 0 0 auto;
    }
  }

  .group-title {
    font-family: PingFang TC;
    font-style: normal;
    font-weight: 600;
    font-size: 14px;
    line-height: 20px;
    letter-spacing: 0.01em;
    color: #CCCCCC;
    margin: 0;
  }
}
</style>

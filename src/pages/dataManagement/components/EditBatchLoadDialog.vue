<template>
  <div class="edit-batch-load-dialog full-page-dialog">
    <div class="dialog-container">
      <div class="dialog-title">
        {{ $t('batchLoad.setBatchLoad') }}
        <a 
          href="javascript:void(0)" 
          class="close-btn"
          @click="closeDialog"
        ><svg-icon icon-class="close"/></a>
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
        v-else-if="dateTimeColumnList.length === 0 || hasError"
        :msg="hasError ? $t('message.systemIsError') : $t('editing.emptyDateTime')"
      />
      <template v-else>
        <div class="setting-block">
          <div class="setting-block__title">{{ $t('batchLoad.columnSetting') }}</div>
          <div class="input-field">
            <label class="input-field__label">{{ $t('batchLoad.builtTimeColumn') }}</label>
            <div class="input-field__input">
              <default-select 
                v-validate="'required'"
                v-model="columnInfo.updatedTime"
                :option-list="dateTimeColumnList"
                :placeholder="$t('batchLoad.chooseColumn')"
                :is-disabled="isProcessing"
                filterable
                class="input-field__select"
                name="builtTimeColumn"
              />
              <div 
                v-show="errors.has('builtTimeColumn')"
                class="error-text"
              >{{ errors.first('builtTimeColumn') }}</div>
            </div>
          </div>
          <div class="input-field">
            <label class="input-field__label">{{ $t('batchLoad.updatedTimeColumn') }}</label>
            <div class="input-field__input">
              <default-select 
                v-validate="'required'"
                v-model="columnInfo.builtTime"
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
              >{{ errors.first('updatedTimeColumn') }}</div>
            </div>
          </div>
          <div class="input-field">
            <label class="input-field__label">{{ $t('batchLoad.primaryKeyColumns') }}</label>
            <div class="input-field__input">
              <default-multi-select
                v-validate="'required'"
                :value="columnInfo.primaryKeys"
                :option-list="columnInfo.columnList"
                :placeholder="$t('batchLoad.chooseColumn')"
                :is-disabled="isProcessing"
                filterable
                multiple
                class="input-field__multi-select"
                name="primaryKeyColumn"
                @input="columnInfo.primaryKeys = $event"
              />
              <div 
                v-show="errors.has('primaryKeyColumn')"
                class="error-text"
              >{{ errors.first('primaryKeyColumn') }}</div>
            </div>
          </div>
        </div>
        <div class="setting-block">
          <div class="setting-block__title">{{ $t('batchLoad.scheduleSetting') }}</div>
          <div class="setting-block__switch">
            <el-switch
              v-model="switchInfo.selected"
              :active-text="switchInfo.on"
              :inactive-text="switchInfo.off"
              :disabled="isProcessing"
              :width="Number('32')"
              active-color="#2AD2E2"
              inactive-color="#324B4E"/>
          </div>
          <div
            v-if="switchInfo.selected"
            class="input-field"
          >
            <label class="input-field__label">{{ $t('batchLoad.basicSetting') }}</label>
            <div class="input-field__input">
              <default-select 
                v-validate="'required'"
                v-model="scheduleInfo.selectedBasicSchedule"
                :option-list="scheduleInfo.basicScheduleList"
                :placeholder="$t('batchLoad.chooseCycle')"
                :is-disabled="isProcessing"
                class="input-field__select"
                name="basicScheduleColumn"
              />
              <div 
                v-show="errors.has('basicScheduleColumn')"
                class="error-text"
              >{{ errors.first('basicScheduleColumn') }}</div>
            </div>
          </div>
        </div>
        <div class="button__block">
          <button 
            class="btn btn-outline"
            @click="closeDialog"
          >{{ $t('button.cancel') }}</button>
          <button 
            v-if="!settingId"
            :disabled="isProcessing || !switchInfo.selected"
            class="btn btn-default"
            @click="setBatchLoad"
          >{{ $t('button.confirm') }}</button>
          <button 
            v-else
            :disabled="isProcessing"
            class="btn btn-default"
            @click="updateBatchLoad"
          >{{ $t('button.update') }}</button>
          <button
            v-if="!switchInfo.selected"
            :disabled="isProcessing"
            class="btn btn-default"
            @click="updateImmediately"
          >{{ $t('button.updateImmediately') }}</button>
        </div>
      </template>
    </div>
  </div>
</template>

<script>
import DefaultSelect from '@/components/select/DefaultSelect'
import DefaultMultiSelect from '@/components/select/DefaultMultiSelect'
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
    EmptyInfoBlock
  },
  props: {
    dataFrameInfo: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      settingId: null,
      switchInfo: {
        on: this.$t('batchLoad.on'),
        off: this.$t('batchLoad.off'),
        selected: false
      },
      columnInfo: {
        builtTime: null,
        updatedTime: null,
        primaryKeys: [],
        columnList: []
      },
      scheduleInfo: {
        selectedBasicSchedule: null,
        basicScheduleList: [
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
            value: '*/45 * * * *',
            name: this.$t('batchLoad.everyMinute', { number: 45 })
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
        ],
      },
      isLoading: false,
      isProcessing: false,
      hasError: false
    }
  },
  computed: {
    dateTimeColumnList () {
      return this.columnInfo.columnList.filter(column => column.dataType === "DATETIME")
    }
  },
  mounted () {
    this.getBatchSetting()
  },
  methods: {
    getBatchSetting () {
      this.isLoading = true
      getBatchLoadSetting(this.dataFrameInfo.id)
        .then(({ crontabConfigDo, primaryKeys }) => {
          // 如果還沒設定過 crontabConfigDo 會是空的
          if (crontabConfigDo) {
            this.switchInfo.selected = crontabConfigDo.id && crontabConfigDo.status === 'Enable'
            this.settingId = crontabConfigDo.id
            this.columnInfo = {
              builtTime: crontabConfigDo.createDateColumn || null,
              updatedTime: crontabConfigDo.updateDateColumn || null,
              primaryKeys: primaryKeys || []
            }
            this.scheduleInfo.selectedBasicSchedule = crontabConfigDo.cron || null
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
        createDateColumn: this.columnInfo.builtTime,
        cron: this.scheduleInfo.selectedBasicSchedule,
        primaryKeys: this.columnInfo.primaryKeys,
        status: this.switchInfo.selected ? 'Enable' : 'Disable',
        updateDateColumn: this.columnInfo.updatedTime
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
      if (!this.switchInfo.selected) return
      this.$validator.validateAll()
        .then(result => {
          if (!result) return
          this.isProcessing = true
          this.setSetting()
            .then(() => {
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
              this.closeDialog()
            })
            .finally(() => this.isProcessing = false)
        })
    },
    triggerUpdateImmediately () {
      const dataFrameId = this.dataFrameInfo.id
      triggerUpdateData(dataFrameId).then(() => {
        Message({
          message: this.$t('batchLoad.startUpdate'),
          type: 'success',
          duration: 3 * 1000,
          showClose: true
        })
        this.closeDialog()
      }).finally(() => this.isProcessing = false)
    },
    updateImmediately () {
      this.$validator.validateAll()
        .then(result => {
          if (!result) return
          this.isProcessing = true
          let promise = this.settingId ? this.updateSetting() : this.setSetting()
          promise.then(() => {
            this.triggerUpdateImmediately()
          })
        })
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

      /deep/ .el-switch__label {
        color: #CCCCCC;
      }

      /deep/ .el-switch__core {
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
      margin-bottom: 20px;
    }

    .input-field {
      display: flex;
      flex-direction: column;

      &:not(:last-of-type) {
        margin-bottom: 16px;
      }
      
      &__multi-select {
        width: 70%;
      }

      &__label {
        font-size: 14px;
      }

      &__select,
      &__multi-select {
        border-bottom: 1px solid #fff;
      }

      /deep/ .el-input__inner {
        font-size: 14px;
        padding-left: 0;

        &::placeholder {
          color: #AAAAAA;
        }
      }

      /deep/ .el-input {
        &.is-disabled {
          .el-input__inner {
            background-color: transparent;
          }
        }
      }
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

  /deep/ .sy-multi-select.theme-dark {
    .el-tag {
      border-color: #2AD2E2;
      color: #2AD2E2;
    }

    .el-tag__close.el-icon-close {
      background-color: #2AD2E2;
    }
  }
}
</style>

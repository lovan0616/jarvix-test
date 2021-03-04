<template>
  <div class="edit-update-setting-dialog full-page-dialog">
    <div class="dialog-container">
      <div class="dialog-title">
        {{ $t('fileDataUpdate.updateSetting') }}
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
        v-else-if="hasError"
        :msg="$t('message.systemIsError')"
      />
      <template v-else>
        <div class="setting-block">
          <div class="setting-block__title">{{ $t('updateSetting.activationStatus') }}</div>
          <div
            v-for="status in statusList"
            :key="status.type"
            class="input-radio-group"
          >
            <input
              :id="status.type.toLowerCase()"
              v-model="columnInfo.status"
              :value="status.type"
              name="status"
              class="input-radio"
              type="radio"
            >
            <label
              :for="status.type.toLowerCase()"
              class="input-radio-label"
            >{{ status.name }}</label>
          </div>
        </div>
        <template v-if="columnInfo.status !== 'DISABLE'">
          <div class="setting-block">
            <div class="setting-block__title">{{ $t('updateSetting.updateCriteriaContent') }}</div>
            <template v-if="isUpdateWithoutDateTimeColumn">
              <empty-info-block
                :msg="$t('editing.emptyDateTime')"
              />
            </template>
            <template v-else>
              <div class="input-field">
                <label class="input-field__label">{{ $t('updateSetting.updateTime') }}</label>
                <div class="input-field__input">
                  <default-select 
                    v-validate="'required'"
                    v-model="columnInfo.updateDateColumn"
                    :option-list="dateTimeColumnList"
                    :placeholder="$t('updateSetting.chooseColumn')"
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
                <label class="input-field__label">{{ $t('updateSetting.primaryKey') }}</label>
                <div class="input-field__input">
                  <default-multi-select
                    v-validate="'required'"
                    v-model="primaryKeys"
                    :option-list="columnInfo.columnList"
                    :placeholder="$t('updateSetting.chooseColumn')"
                    :is-disabled="isProcessing"
                    filterable
                    multiple
                    class="input-field__multi-select"
                    name="primaryKeyColumn"
                  />
                  <div 
                    v-show="errors.has('primaryKeyColumn')"
                    class="error-text"
                  >{{ errors.first('primaryKeyColumn') }}</div>
                </div>
              </div>
            </template>
          </div>
        </template>
        <div class="button__block">
          <button 
            class="btn btn-outline"
            @click="closeDialog"
          >{{ $t('button.cancel') }}</button>
          <button 
            :disabled="isProcessing || isUpdateWithoutDateTimeColumn"
            class="btn btn-default"
            @click="updateSetting"
          >{{ $t('button.save') }}</button>
        </div>
      </template>
    </div>
  </div>
</template>

<script>
import DefaultSelect from '@/components/select/DefaultSelect'
import DefaultMultiSelect from '@/components/select/DefaultMultiSelect'
import EmptyInfoBlock from '@/components/EmptyInfoBlock'
import { 
  getDataFrameColumnInfoById, 
  getBatchLoadSetting,
  updateDataUpdateSetting
} from '@/API/DataSource'
import { Message } from 'element-ui'

export default {
  name: 'EditUpdateSettingDialog',
  inject: ['$validator'],
  components: {
    DefaultSelect,
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
      columnInfo: {},
      primaryKeys: [],
      statusList: [
        {
          type: 'DISABLE',
          name: this.$t('updateSetting.inactive')
        },
        {
          type: 'MANUAL', // 當前檔案是手動更新
          name: this.$t('updateSetting.active')
        }
      ],
      isLoading: false,
      isProcessing: false,
      hasError: false
    }
  },
  computed: {
    isUpdateWithoutDateTimeColumn () {
      return this.dateTimeColumnList.length === 0
    },
    dateTimeColumnList () {
      return this.columnInfo.columnList.filter(column => column.dataType === "DATETIME")
    }
  },
  mounted () {
    this.getSetting()
  },
  methods: {
    getSetting () {
      this.isLoading = true
      const hasFeatureColumn = false
      Promise.all([
        getBatchLoadSetting(this.dataFrameInfo.id),
        getDataFrameColumnInfoById(this.dataFrameInfo.id, hasFeatureColumn)
      ])
        .then(([{ crontabConfigContent, primaryKeys }, columnList]) => {
          this.columnInfo = JSON.parse(JSON.stringify(crontabConfigContent))
          this.primaryKeys = JSON.parse(JSON.stringify(primaryKeys)) || []
          this.columnInfo.columnList = columnList.map(column => ({
            ...column,
            name: column.primaryAlias || column.name,
            value: column.id
          }))
          this.isLoading = false
        })
        .catch(() => this.hasError = true)
        .finally(() => this.isLoading = false)
    },
    updateSetting () {
      this.$validator.validateAll()
        .then(result => {
          if (!result) return
          this.isProcessing = true

          const dataFrameId = this.dataFrameInfo.id
          const settingData = {
            primaryKeys: this.primaryKeys,
            status: this.columnInfo.status,
            updateDateColumnId: this.columnInfo.updateDateColumn
          }
          return updateDataUpdateSetting(dataFrameId, settingData)
            .then(() => {
              Message({
                message: this.$t('message.saveSuccess'),
                type: 'success',
                duration: 3 * 1000,
                showClose: true
              })
              this.closeDialog()
            })
            .finally(() => this.isProcessing = false)
        })
    },
    closeDialog () {
      this.$emit('close')
    }
  }
}
</script>

<style lang="scss" scoped>
.edit-update-setting-dialog {
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

    &__title {
      font-weight: 600;
      font-size: 18px;
      line-height: 1;
      margin-bottom: 16px;
    }

    .input-field {
      display: flex;
      flex-direction: column;

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

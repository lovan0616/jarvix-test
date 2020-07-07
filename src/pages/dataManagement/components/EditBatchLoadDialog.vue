<template>
  <div class="edit-batch-load-dialog full-page-dialog">
    <div class="dialog-container">
      <div class="dialog-title">
        {{ $t('batchLoad.setBatchLoad') }}
      </div>
      <div class="setting-block">
        <div 
          v-if="!switchInfo.selected" 
          class="setting-block__title">{{ $t('batchLoad.batchLoadSetting') }}</div>
        <div 
          v-else 
          class="setting-block__title">{{ $t('batchLoad.columnSetting') }}</div>
        <div class="setting-block__switch">
          <el-switch
            v-model="switchInfo.selected"
            :active-text="switchInfo.on"
            :inactive-text="switchInfo.off"
            :disabled="isLoading"
            active-color="#2AD2E2"
            width="32"
            inactive-color="#324B4E"/>
        </div>

        <template v-if="switchInfo.selected" >
          <div 
            :class="{'has-error': errors.has('builtTimeColumn')}"
            class="setting-block__input-field input-field"
          >
            <label class="input-field__label">{{ $t('batchLoad.builtTimeColumn') + '：' }}</label>
            <div class="input-field__input">
              <default-select 
                v-validate="'required'"
                v-model="columnInfo.updatedTime"
                :option-list="dateTimeColumnList"
                :placeholder="$t('batchLoad.chooseColumn')"
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
          <div
            :class="{'has-error': errors.has('builtTimeColumn')}"
            class="setting-block__input-field input-field"
          >
            <label class="input-field__label">{{ $t('batchLoad.updatedTimeColumn') + '：' }}</label>
            <div class="input-field__input">
              <default-select 
                v-validate="'required'"
                v-model="columnInfo.builtTime"
                :option-list="dateTimeColumnList"
                :placeholder="$t('batchLoad.chooseColumn')"
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
          <div
            :class="{'has-error': errors.has('primaryKeyColumn')}"
            class="setting-block__input-field  input-field--column"
          >
            <label class="input-field__label">{{ $t('batchLoad.primaryKeyColumns') + '：' }}</label>
            <div class="input-field__input">
              <default-multi-select
                v-validate="'required'"
                :value="columnInfo.primaryKeys"
                :option-list="columnInfo.columnList"
                :placeholder="$t('batchLoad.chooseColumn')"
                filterable
                multiple
                class="input-field__multi-select"
                name="primaryKeyColumn"
                @change="columnInfo.primaryKeys = $event"
              />
              <div 
                v-show="errors.has('primaryKeyColumn')"
                class="error-text"
              >{{ errors.first('primaryKeyColumn') }}</div>
            </div>
          </div>
        </template>
      </div>
      <div 
        v-if="switchInfo.selected" 
        class="setting-block"
      >
        <div class="setting-block__title">{{ $t('batchLoad.scheduleSetting') }}</div>
        <div 
          :class="{'has-error': errors.has('basicScheduleColumn')}"
          class="setting-block__input-field input-field"
        >
          <label class="input-field__label">{{ $t('batchLoad.basicSetting') + '：' }}</label>
          <div class="input-field__input">
            <default-select 
              v-validate="'required'"
              v-model="scheduleInfo.selectedBasicSchedule"
              :option-list="scheduleInfo.basicScheduleList"
              :placeholder="$t('batchLoad.chooseCycle')"
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
      <div class="button-block">
        <button 
          class="btn btn-outline"
          @click="$emit('close')"
        >{{ $t('button.cancel') }}</button>
        <button 
          v-if="!settingId"
          class="btn btn-default"
          @click="setBatchLoad"
        >{{ $t('button.confirm') }}</button>
        <button 
          v-else
          class="btn btn-default"
          @click="updateBatchLoad"
        >{{ $t('button.update') }}</button>
      </div>
    </div>
  </div>
</template>

<script>
import DefaultSelect from '@/components/select/DefaultSelect'
import DefaultMultiSelect from '@/components/select/DefaultMultiSelect'
import InputBlock from '@/components/InputBlock'
import { getDataFrameColumnInfoById } from '@/API/DataSource'

export default {
  name: 'EditBatchLoadDialog',
  inject: ['$validator'],
  components: {
    DefaultSelect,
    InputBlock,
    DefaultMultiSelect
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
        builtTime: '',
        updatedTime: '',
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
      isLoading: false
    }
  },
  computed: {
    dateTimeColumnList () {
      return this.columnInfo.columnList.filter(column => column.dataType === "DATETIME")
    }
  },
  mounted () {
    this.fetchDataColumnList(this.dataFrameInfo.id)
  },
  methods: {
    fetchDataColumnList (dataFrameId) {
      this.isLoading = true
      const hasFeatureColumn = false
      getDataFrameColumnInfoById(dataFrameId, hasFeatureColumn)
        .then(response => {
          this.columnInfo.columnList = response.map(column => ({
            ...column,
            name: column.primaryAlias || column.name,
            value: column.id
          }))
        })
        .finally(() => this.isLoading = false)
    },
    setBatchLoad () {
      this.$validator.validateAll().then(result => {
        // set
      })
    },
    updateBatchLoad () {

    }
  }
}
</script>

<style lang="scss" scoped>
.edit-batch-load-dialog {
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
      margin-bottom: 16px;
    }

    &__input-field {
      display: flex;

      &:not(:last-of-type) {
        margin-bottom: 10px;
      }

      /deep/ .el-input__inner {
        font-size: 14px;
        padding-left: 0;

        &::placeholder {
          color: #AAAAAA;
        }
      }
    }

    .input-field {
      &--column {
        flex-direction: column;

        .input-field__multi-select {
          width: 50%;
        }
      }

      &__input {
        position: relative;
      }

      &__label {
        line-height: 40px;
        font-size: 14px;
      }

      &__select,
      &__multi-select {
        border-bottom: 1px solid #fff;
      }
    }

    & >>> .input-field {
      &.has-error {
        .data-frame-select {
          border-color: $theme-color-danger;
        }

        .error-text {
          bottom: -10px;
        }
      }
    }
  }

  .button-block {
    display: flex;
    justify-content: flex-end;
    padding-bottom: 64px;

    .btn:not(:last-child) {
      margin-right: 20px;
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

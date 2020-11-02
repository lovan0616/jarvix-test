<template>
  <div class="single-sub-restraint">
    <div class="single-sub-restraint__header">
      <h2 class="single-sub-restraint__title">{{ subRestraint.properties.display_name }}</h2>
      <div
        class="btn-delete"
        @click="deleteSubRestraint"
      >
        <svg-icon
          icon-class="delete"/>
      </div>
    </div>
    <spinner
      v-if="isLoading"/>
    <div 
      v-else-if="statsType === 'NUMERIC'"
      class="single-sub-restraint__content">
      <div class="numeric-block">
        <div 
          :class="{'has-error': errors.has(index + '-' + 'upperBound')}" 
          class="numeric-block__item item">
          <div class="item__input-block">
            <label class="item__label"> 
              {{ $t('message.upperBound') }}
            </label>
            <input
              v-validate="upperBoundRules"
              ref="upperBound"
              v-model.trim="subRestraint.properties.end"
              :placeholder="subRestraint.properties.end"
              :name="index + '-' + 'upperBound'"
              class="input item__input"
            >
          </div>
          <div 
            v-show="errors.has(index + '-' + 'upperBound')"
            class="error-text"
          >{{ errors.first(index + '-' + 'upperBound') }}</div>
        </div>
        <div 
          :class="{'has-error': errors.has(index + '-' + 'lowerBound')}" 
          class="item">
          <div class="item__input-block">
            <label class="item__label"> 
              {{ $t('message.lowerBound') }}
            </label>
            <input
              v-validate="lowerBoundRules"
              ref="lowerBound"
              v-model.trim="subRestraint.properties.start"
              :placeholder="subRestraint.properties.start"
              :name="index + '-' + 'lowerBound'"
              class="input item__input"
            >
          </div>
          <div 
            v-show="errors.has(index + '-' + 'lowerBound')"
            class="error-text"
          >{{ errors.first(index + '-' + 'lowerBound') }}</div>
        </div>
      </div>
      <div class="numeric-block__warning">
        {{ $t('dataFrameAdvanceSetting.emptyValueMsg') }}
      </div>
    </div>
    <div 
      v-else-if="statsType === 'DATETIME'"
      class="single-sub-restraint__content">
      <div class="datetime-block">
        <div 
          :class="{'has-error': errors.has(index + '-' + 'upperBound')}" 
          class="datetime-block__item item">
          <div class="item__input-block">
            <label class="item__label"> 
              {{ $t('message.upperBound') }}
            </label>
            <el-date-picker
              v-model="value1"
              type="datetime"
              class="date-picker" />
              <!-- <input
              v-validate="upperBoundRules"
              ref="upperBound"
              v-model.trim="subRestraint.properties.end"
              :placeholder="subRestraint.properties.end"
              :name="index + '-' + 'upperBound'"
              class="input item__input"
            > -->
          </div>
          <div 
            v-show="errors.has(index + '-' + 'upperBound')"
            class="error-text"
          >{{ errors.first(index + '-' + 'upperBound') }}</div>
        </div>
        <div 
          :class="{'has-error': errors.has(index + '-' + 'lowerBound')}" 
          class="item">
          <div class="item__input-block">
            <label class="item__label"> 
              {{ $t('message.lowerBound') }}
            </label>
            <input
              v-validate="lowerBoundRules"
              ref="lowerBound"
              v-model.trim="subRestraint.properties.start"
              :placeholder="subRestraint.properties.start"
              :name="index + '-' + 'lowerBound'"
              class="input item__input"
            >
          </div>
          <div 
            v-show="errors.has(index + '-' + 'lowerBound')"
            class="error-text"
          >{{ errors.first(index + '-' + 'lowerBound') }}</div>
        </div>
      </div>
      <div class="datetime-block__warning">
        {{ $t('dataFrameAdvanceSetting.emptyValueMsg') }}
      </div>
    </div>
    <div 
      v-else-if="statsType === 'BOOLEAN'"
      class="single-sub-restraint__content boolean-block">
      <div 
        v-if="!valueList" 
        class="empty-message">
        {{ $t('editing.emptyKey') }}
      </div>
      <template v-else>
        <div
          v-for="option in valueList"
          :key="index + '-' + option"
          class="input-radio-group"
        >
          <input
            :id="index + '-' + option"
            :checked="option === subRestraint.properties.datavalues[0]"
            :value="subRestraint.properties.datavalues[0]"
            :name="index"
            class="input-radio"
            type="radio"
            @change="changeBoolean(index, option)"
          >
          <label
            :for="index + '-' + option"
            class="input-radio-label"
          >{{ option }}</label>
        </div>
      </template>
    </div>
    <div 
      v-else-if="statsType === 'CATEGORY'"
      class="single-sub-restraint__content category-block">
      <div 
        v-if="valueList"
        @click="searchValue">
        <svg-icon 
          icon-class="search" 
          class="category-block__icon" />
      </div>
      <div 
        v-if="!valueList" 
        class="empty-message">
        {{ $t('editing.emptyKey') }}
      </div>
      <default-select
        v-else
        v-model="subRestraint.properties.datavalues" 
        :placeholder="$t('dataFrameAdvanceSetting.chooseValue')"
        :option-list="valueList"
        filterable
        multiple
        class="category-block__selector"
        @input="updateDataValue"
      />
    </div>
  </div>
</template>

<script>
import { getDataColumnValue, dataValueFuzzySearch } from '@/API/DataSource'
import DefaultSelect from '@/components/select/DefaultSelect'
import { mapState } from 'vuex'

export default {
  inject: ['$validator'],
  name: "SingleSubRestraintBlock",
  components: {
    DefaultSelect
  },
  props: {
    index: {
      type: Number,
      default: null
    },
    subRestraint: {
      type: Object,
      default: () => {}
    }
  },
  data () {
    return {
      isLoading: false,
      valueList: [],
      statsType: null
    }
  },
  computed: {
    ...mapState('dataFrameAdvanceSetting', ['columnList']), 
    upperBoundRules () {
      //const decimalRegex = /^[-]?([0-9]+)?[.]?([0-9]+)?$/
      return 'decimal'
    },
    lowerBoundRules () {
      //const decimalRegex = /^[-]?([0-9]+)?[.]?([0-9]+)?$/
      return 'decimal'
    }
  },
  mounted () {
    this.fetchData()
  },
  methods: {
    fetchData () {
      this.isLoading = true
      const columnId = this.getColumnId(this.subRestraint.properties.display_name)
      getDataColumnValue(columnId).then(response => {
        this.statsType = response.type
        this.valueList = this.statsType === 'BOOLEAN' && response['bool']
          ? ["true", "false"]
          : response[this.statsType.toLowerCase()]

        if(this.valueList && this.statsType === 'CATEGORY') {
          this.valueList = this.valueList.map(element => {
            return {
              value: element,
              name: element,
              active: false
            }
          })
        }
      }).finally(() => {
        this.isLoading = false
      })
    },
    getColumnId (columnName) {
      return this.columnList.filter(column => column.name === columnName)[0]['id']
    },
    getStatsType (columnName) {
      return this.columnList.filter(column => column.name === columnName)[0]['statsType']
    },
    changeBoolean (index, option) {
      this.subRestraint[index].properties.datavalues[0] = option
      this.subRestraint[index].properties.display_datavalues[0] = option
    },
    searchValue () {

    },
    updateDataValue (value) {
      this.subRestraint.properties.display_datavalues = value
    },
    deleteSubRestraint () {
      this.$emit('delete')
    }
  },

}
</script>

<style lang="scss" scoped>
.single-sub-restraint {
  &__header {
    display: flex;
    flex-direction: row;
    margin-bottom: 8px;

    .btn-delete {
      color: #CCC;

      &:hover {
        color: $theme-color-primary;
      }
    }
  }

  &__title {
    flex: 1;
    margin: 0;
    font-size:14px;
    line-height: 22px;
    color: #CCC;
  }

  &__content {
    margin-bottom: 16px;
    overflow-y: auto;

    .empty-message {
      padding: 8px 12px;
      background-color: #1C292B;
      border-radius: 8px;
      font-size: 14px;
      color: #CCC;
    }
  }

  .numeric-block, .datetime-block {
    margin-bottom: 8px;
    padding: 12px;
    background-color: #1C292B;
    border-radius: 8px;

    .item {
      &:not(:last-child) {
        margin-bottom: 8px;
      }

      &.has-error {
        margin-bottom: 34px;

        &:last-child {
          margin-bottom: 26px;
        }
      }
      
      &__input-block {
        display: flex;
        flex-direction: row;
        align-items: center;
      }

      &__label {
        flex: 1;
        font-size: 12px;
        line-height: 22px;
        color: #CCC;
      }

      &__input {
        padding: 0 12px;
        width: 150px;
        height: 30px;
        font-size: 12px;
        text-align: right;
        background-color: #141C1D;
        border-radius: 5px;
        border-bottom: none;
      }

      .error-text {
        float: right;
        margin-top: 4px;
        font-size: 12px;
        line-height: 22px;
      }
    }

    &__warning {
      font-size: 12px;
      line-height: 22px;
      color: #A7A7A7;
    }
  }

  .date-picker {
    max-width: 150px;

    /deep/ .el-input__inner {
      height: 30px;
    }
  }

  .boolean-block {

  }

  .category-block {
    position: relative;
    overflow: unset;

    &__icon {
      position: absolute;
      top: calc((100% - 16px) / 2);
      right: 9px;
      background: #141C1D;
      cursor: pointer;
      z-index: 1;
    }

    &__selector{
      width: 100%;
      border-radius: 5px;
      background-color: #141C1D;

      /deep/ .el-select__tags {
        .el-tag.el-tag--info {
          height: 26px;
          font-weight: 600;
          font-size: 14px;
          background-color: transparent;
          border-color: $theme-color-primary;
          color: $theme-color-primary;
        }

        .el-tag__close {
          margin: 0;
          right: 0;
          font-weight: bold;
          background-color: transparent;
          color: $theme-color-primary;

          &::before {
            font-size: 14px;
          }
        }
      }

      /deep/ .el-input__inner {
        font-size: 14px;
        line-height: 22px;
        color: #888888;
      }

      /deep/ .el-select-dropdown {
        .el-select-dropdown__item {
          padding: 0 20px 0 36px;
          font-weight: normal;
          color: #CCC;
          background-color: transparent;

          &::after {
            content: '\E6DA';
            position: absolute;
            top: 8px;
            left: 12px;
            width: 14px;
            height: 14px;
            font-size: 12px;
            font-weight: bold;
            line-height: 15px;
            border: 1px solid #FFF;
          }

          &.selected {
            &::after {
              color: #FFF;
              background-color: #1EB8C7;
              border-color: #1EB8C7;
            }
          }
        }
      }
    }

    .checkbox-label {
      margin-right: 8px;
    }
  }

  .input-radio-group {
    display: inline-block;

    &:not(:last-of-type) {
      margin-right: 40px;
    }
    &:last-of-type {
      margin-right: 16px;
    }
  }

}
</style>
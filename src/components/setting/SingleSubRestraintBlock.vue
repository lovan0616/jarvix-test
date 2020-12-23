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
    </div>
    <div 
      v-else-if="statsType === 'DATETIME'"
      class="single-sub-restraint__content">
      <div class="datetime-block">
        <div 
          :class="{'has-error': errors.has(index + '-' + 'datatimeUpperBound')}" 
          class="datetime-block__item item">
          <div class="item__input-block">
            <label class="item__label"> 
              {{ $t('message.upperBound') }}
            </label>
            <el-date-picker
              v-validate="datatimeUpperBoundRules"
              ref="datatimeUpperBound"
              v-model="subRestraint.properties.end"
              :format="valueList.datePattern"
              :name="index + '-' + 'datatimeUpperBound'"
              value-format="timestamp"
              type="datetime"
              class="date-picker" />
          </div>
          <div 
            v-show="errors.has(index + '-' + 'datatimeUpperBound')"
            class="error-text"
          >{{ errors.first(index + '-' + 'datatimeUpperBound') }}</div>
        </div>
        <div 
          :class="{'has-error': errors.has(index + '-' + 'datatimeLowerBound')}" 
          class="item">
          <div class="item__input-block">
            <label class="item__label"> 
              {{ $t('message.lowerBound') }}
            </label>
            <el-date-picker
              v-validate="datatimeLowerBoundRules"
              ref="datatimeLowerBound"
              v-model="subRestraint.properties.start"
              :format="valueList.datePattern"
              :name="index + '-' + 'datatimeLowerBound'"
              value-format="timestamp"
              type="datetime"
              class="date-picker" />
          </div>
          <div 
            v-show="errors.has(index + '-' + 'datatimeLowerBound')"
            class="error-text"
          >{{ errors.first(index + '-' + 'datatimeLowerBound') }}</div>
        </div>
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
      <template v-show="valueList">
        <div
          v-for="option in valueList"
          :key="index + '-' + option"
          class="input-radio-group"
        >
          <input
            v-validate="'required'"
            :id="index + '-' + option"
            :checked="option === subRestraint.properties.datavalues[0]"
            :value="subRestraint.properties.datavalues[0]"
            :name="index + '-boolean'"
            class="input-radio"
            type="radio"
            @change="changeBoolean(option)"
          >
          <label
            :for="index + '-' + option"
            class="input-radio-label"
          >{{ option }}</label>
        </div>
        <div 
          v-show="errors.has(index + '-' + 'boolean')"
          class="error-text"
        >{{ errors.first(index + '-' + 'boolean') }}</div>
      </template>
    </div>
    <div 
      v-else-if="statsType === 'CATEGORY'"
      class="single-sub-restraint__content category-block">
      <div 
        v-if="!valueList" 
        class="empty-message">
        {{ $t('editing.emptyKey') }}
      </div>
      <el-select
        v-validate="'required'"
        v-show="valueList"
        v-model="selectedList"
        :name="index + '-select'"
        :no-data-text="$t('message.noData')"
        :no-match-text="$t('message.noMatchData')"
        :loading="isSearching"
        :loading-text="$t('message.dataLoading')"
        :placeholder="$t('dataFrameAdvanceSetting.chooseValue')"
        :remote-method="remoteMethod"
        :popper-append-to-body="false"
        remote
        multiple
        filterable
        reserve-keyword
        class="sy-select theme-dark category-block__selector"
        @change="updateDataValue"
      >
        <el-option
          v-for="(item, index) in valueList"
          :key="index"
          :label="item.label"
          :value="item.value"/>
      </el-select>
      <div class="warning-text">{{ $t('editing.onlyPrefixMatching') }}</div>
      <div 
        v-show="errors.has(index + '-' + 'select')"
        class="error-text"
      >{{ errors.first(index + '-' + 'select') }}</div>
    </div>
  </div>
</template>

<script>
import { getDataColumnValue, dataValueSearch } from '@/API/DataSource'
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
      isSearching: false,
      isLoading: false,
      columnId: null,
      selectedList: [],
      valueList: [],
      tempValueList: [],
      tempAliasList:[],
      statsType: null,
      queryString: '',
      searchTimer: null
    }
  },
  computed: {
    ...mapState('dataFrameAdvanceSetting', ['columnList']), 
    upperBoundRules () {
      return 'required|decimal|validUpperBound:lowerBound'
    },
    lowerBoundRules () {
      return 'required|decimal|validLowerBound:upperBound'
    },
    datatimeUpperBoundRules () {
      return this.subRestraint.properties.start 
        ? 'required|validUpperBound:datatimeLowerBound'
        : 'required'
    },
    datatimeLowerBoundRules () {
      return this.subRestraint.properties.end
        ? 'required|validLowerBound:datatimeUpperBound'
        : 'required'
    }
  },
  watch: {
    selectedList () {
      console.log('watch')
    }
  },
  mounted () {
    this.fetchData()
  },
  methods: {
    fetchData () {
      this.isLoading = true
      this.columnId = this.subRestraint.properties['dc_id']
      getDataColumnValue(this.columnId).then(response => {
        this.statsType = response.type
        this.valueList = this.statsType === 'BOOLEAN' && response['bool']
          ? ["true", "false"]
          : response[this.statsType.toLowerCase()]

        if(this.statsType === 'CATEGORY') {
          this.selectedList = JSON.parse(JSON.stringify(this.subRestraint.properties.display_datavalues))
          // CATEGORY 值超過 200 筆時候會回傳 null，因此需要由後端做 value search
          if(!this.valueList) {
            this.isCategoryValueSearch = true
            this.searchValue()
          } else {
            /* 當多個 alias (display value) 對到同樣的 value
             * 在多選的時候會有 tag 對不到剛剛選的 alias，因此先都用 alias(不會重複)
             * (因為 element ui 會用 value 去對，對到的 alias 不一定是剛剛點選的)
             */
            this.tempValueList = this.valueList.map(element => {
              return {
                value: element.columnValue,
                name: element.displayColumnValue
              }
            })

            this.valueList = this.valueList.map(element => {
              return {
                value: element.displayColumnValue,
                name: element.displayColumnValue
              }
            })
            this.tempAliasList = JSON.parse(JSON.stringify(this.valueList))
          }
        } else if (this.statsType === 'DATETIME') {
          // 目前後端有用到 13 種日期格式，先預設所有日期最小單位都到秒
          this.valueList.datePattern = 'yyyy-MM-dd HH:mm:ss'
          if(this.subRestraint.properties.start && this.subRestraint.properties.end) {
            return 
          } else {
            this.subRestraint.properties.start = this.valueList.start
            this.subRestraint.properties.end = this.valueList.end
          }
        } else if (this.statsType === 'NUMERIC') {
          this.subRestraint.properties.start = this.subRestraint.properties.start || this.valueList.min
          this.subRestraint.properties.end = this.subRestraint.properties.end || this.valueList.max
        }
      }).finally(() => {
        this.isLoading = false
      })
    },
    categoryFilter (query) {
      this.queryString = query
    },
    changeBoolean (option) {
      this.subRestraint.properties.datavalues = [option]
      this.subRestraint.properties.display_datavalues = [option]
    },
    remoteMethod(query) {
      this.queryString = query
      this.isSearching = true
      clearTimeout(this.searchTimer)
      this.searchTimer = setTimeout(() => {
        this.searchValue()
      }, 1000)
    },
    searchValue () {
      // category value 如果一開始有值，表示資料筆數小於 200，不需用後端的 search
      if(!this.isCategoryValueSearch) {
        // 這裡字串比對用 startsWith 是為了和後端一致
        this.valueList = this.tempAliasList
          .filter(element => !this.queryString || element.name.startsWith(this.queryString))
        this.isSearching = false
      } else {
        dataValueSearch(this.columnId, this.queryString)
          .then(({fuzzySearchResult}) => {
            this.valueList = fuzzySearchResult.map(element => {
              return {
                value: element,
                name: element
              }
            })
          })
          .finally(() => {
            this.isSearching = false
          })
      }
    },
    updateDataValue () {
      // TODO:每次都要重新取值，有點沒效率
      this.subRestraint.properties.datavalues = []
      this.tempValueList.forEach(item => {
        if(this.selectedList.includes(item.name)) this.subRestraint.properties.datavalues.push(item.value)
      })
      this.subRestraint.properties.display_datavalues = this.selectedList
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
      cursor: pointer;

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
    @include text-hidden;
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
  }

  .date-picker {
    max-width: 150px;

    /deep/ .el-input__inner {
      height: 30px;
    }

    /deep/ .el-input__suffix {
      .el-input__icon {      
        line-height: 30px;
      }
    }
  }

  .category-block {
    position: relative;
    overflow: unset;

    .warning-text {
      margin-top: 4px;
      font-size: 12px;
      line-height: 22px;
      color: $theme-color-warning;
    }

    &__selector {
      width: 100%;
      border-radius: 5px;
      background-color: #141C1D;

      /* [Bug 未解] el-select selects multiple window jitter.
       * https://github.com/ElemeFE/element/issues/8731
       * https://github.com/ElemeFE/element/issues/13173
       */

      /deep/ .el-select__tags {
        .el-tag.el-tag--info {
          max-width: 200px;
          height: 26px;
          font-weight: 600;
          font-size: 14px;
          line-height: 22px;
          background-color: transparent;
          border-color: $theme-color-primary;
          color: $theme-color-primary;

          .el-select__tags-text {
            max-width: 150px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            display: inline-block;
            vertical-align: middle;
          }
        }

        .el-select__input {
          color: #CCC;
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
        width: 100%;
        left: 0px !important;

        .el-select-dropdown__item {
          padding: 0 20px 0 36px;
          font-weight: normal;
          color: #CCC;
          background-color: transparent;

          &:hover {
            background-color: rgba(0, 0, 0, .6);
          }

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
            border: 1.1px solid #FFF;
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
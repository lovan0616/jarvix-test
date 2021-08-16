<template>
  <div class="single-sub-restraint">
    <div class="single-sub-restraint__header">
      <h2 class="single-sub-restraint__title">
        {{ subRestraint.properties.display_name }}
      </h2>
      <div
        class="btn-delete"
        @click="deleteSubRestraint"
      >
        <svg-icon
          icon-class="delete"
        />
      </div>
    </div>
    <spinner
      v-if="isLoading"
    />
    <div
      v-else-if="statsType === 'NUMERIC'"
      class="single-sub-restraint__content"
    >
      <div class="numeric-block">
        <div
          :class="{'has-error': hasErrorOf(index + '-' + 'upperBound')}"
          class="numeric-block__item item"
        >
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
            v-show="hasErrorOf(index + '-' + 'upperBound')"
            class="error-text"
          >
            {{ getFirstErrorOf(index + '-' + 'upperBound') }}
          </div>
        </div>
        <div
          :class="{'has-error': hasErrorOf(index + '-' + 'lowerBound')}"
          class="item"
        >
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
            v-show="hasErrorOf(index + '-' + 'lowerBound')"
            class="error-text"
          >
            {{ getFirstErrorOf(index + '-' + 'lowerBound') }}
          </div>
        </div>
      </div>
    </div>
    <div
      v-else-if="statsType === 'DATETIME'"
      class="single-sub-restraint__content"
    >
      <div class="datetime-block">
        <div
          :class="{'has-error': hasErrorOf(index + '-' + 'datetimeLowerBound')}"
          class="item"
        >
          <div class="item__input-block">
            <label class="item__label">
              {{ $t('dataFrameAdvanceSetting.start') }}
            </label>
            <!-- value-format 不要使用 timestamp, 會有時區問題
              Datepicker saving wrong date to v-model
              https://github.com/ElemeFE/element/issues/3814
            -->
            <el-date-picker
              v-validate="datetimeLowerBoundRules"
              ref="datetimeLowerBound"
              v-model="subRestraint.properties.start"
              :name="index + '-' + 'datetimeLowerBound'"
              :type="getDatePickerOptions(subRestraint.properties.timeScope).type"
              :format="getDatePickerOptions(subRestraint.properties.timeScope).format"
              :value-format="subRestraint.properties.timeScope === 'WEEK' ? '' : 'yyyy-MM-dd HH:mm:ss'"
              class="date-picker"
              @change="handleWeekStart"
            />
          </div>
          <div
            v-show="hasErrorOf(index + '-' + 'datetimeLowerBound')"
            class="error-text"
          >
            {{ getFirstErrorOf(index + '-' + 'datetimeLowerBound') }}
          </div>
        </div>
        <div
          :class="{'has-error': hasErrorOf(index + '-' + 'datetimeUpperBound')}"
          class="datetime-block__item item"
        >
          <div class="item__input-block">
            <label class="item__label">
              {{ $t('dataFrameAdvanceSetting.end') }}
            </label>
            <!-- value-format 不要使用 timestamp, 會有時區問題
              Datepicker saving wrong date to v-model
              https://github.com/ElemeFE/element/issues/3814
            -->
            <el-date-picker
              v-validate="datetimeUpperBoundRules"
              ref="datetimeUpperBound"
              v-model="subRestraint.properties.end"
              :name="index + '-' + 'datetimeUpperBound'"
              :picker-options="endTimePickerOptions"
              :type="getDatePickerOptions(subRestraint.properties.timeScope).type"
              :format="getDatePickerOptions(subRestraint.properties.timeScope).format"
              :value-format="subRestraint.properties.timeScope === 'WEEK' ? '' : 'yyyy-MM-dd HH:mm:ss'"
              class="date-picker"
              @change="handleWeekEnd"
            />
          </div>
          <div
            v-show="hasErrorOf(index + '-' + 'datetimeUpperBound')"
            class="error-text"
          >
            {{ getFirstErrorOf(index + '-' + 'datetimeUpperBound') }}
          </div>
        </div>
      </div>
    </div>
    <div
      v-else-if="statsType === 'BOOLEAN'"
      class="single-sub-restraint__content boolean-block"
    >
      <div
        v-if="!valueList"
        class="empty-message"
      >
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
          v-show="hasErrorOf(index + '-' + 'boolean')"
          class="error-text"
        >
          {{ getFirstErrorOf(index + '-' + 'boolean') }}
        </div>
      </template>
    </div>
    <div
      v-else-if="statsType === 'CATEGORY'"
      class="single-sub-restraint__content category-block"
    >
      <div
        v-if="!valueList"
        class="empty-message"
      >
        {{ $t('editing.emptyKey') }}
      </div>
      <el-select
        v-validate="'required'"
        v-show="valueList"
        ref="fuzzySearchSelect"
        :value="selectedList"
        :name="index + '-select'"
        :no-data-text="$t('message.noData')"
        :no-match-text="$t('message.noMatchData')"
        :loading="isSearching"
        :loading-text="$t('message.dataLoading')"
        :placeholder="$t('dataFrameAdvanceSetting.chooseValue')"
        :remote-method="remoteMethod"
        :popper-append-to-body="false"
        :disable="true"
        remote
        multiple
        filterable
        reserve-keyword
        class="sy-select theme-dark category-block__selector"
        @input="updateDataValue"
        @focus="onSelectfocused"
      >
        <el-option
          v-for="(item, index) in valueList"
          :key="`${index}-${item.value}`"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
      <div class="warning-text">
        {{ $t('editing.onlyPrefixMatching') }}
      </div>
      <div
        v-show="hasErrorOf(index + '-' + 'select')"
        class="error-text"
      >
        {{ getFirstErrorOf(index + '-' + 'select') }}
      </div>
    </div>
  </div>
</template>

<script>
import { getDataColumnValue, dataValueSearch } from '@/API/DataSource'
import DefaultSelect from '@/components/select/DefaultSelect'
import { mapState } from 'vuex'

export default {
  inject: ['$validator'],
  name: 'SingleSubRestraintBlock',
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
    },
    validatorScope: {
      type: String,
      default: () => ''
    }
  },
  data () {
    return {
      isSearching: false,
      isLoading: false,
      endTimePickerOptions: {
        disabledDate: this.disabledDueDate
      },
      columnId: null,
      selectedList: [],
      valueList: [],
      tempValueList: [],
      tempAliasList: [],
      statsType: null,
      queryString: '',
      searchTimer: null,
      isCategoryValueSearch: false
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
    datetimeUpperBoundRules () {
      return 'required|validDatetimeUpperBound:datetimeLowerBound'
    },
    datetimeLowerBoundRules () {
      return 'required|validDatetimeLowerBound:datetimeUpperBound'
    }
  },
  mounted () {
    this.fetchData()
  },
  methods: {
    fetchData () {
      this.isLoading = true
      this.columnId = this.subRestraint.properties.dc_id
      getDataColumnValue(this.columnId).then(response => {
        this.statsType = response.type
        this.valueList = this.statsType === 'BOOLEAN'
          ? response.bool
          : response[this.statsType.toLowerCase()]

        if (this.statsType === 'CATEGORY') {
          this.selectedList = JSON.parse(JSON.stringify(this.subRestraint.properties.display_datavalues))
          // CATEGORY 值超過 200 筆時候會回傳 null，因此需要由後端做 value search
          if (!this.valueList) {
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
          if (this.subRestraint.properties.start && this.subRestraint.properties.end) {

          } else {
            this.subRestraint.properties.start = this.customerTimeFormatter(this.valueList.start, 'SECOND')
            this.subRestraint.properties.end = this.customerTimeFormatter(this.valueList.end, 'SECOND')
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
    remoteMethod (query) {
      this.queryString = query
      this.isSearching = true
      clearTimeout(this.searchTimer)
      this.searchTimer = setTimeout(() => {
        this.searchValue()
      }, 1000)
    },
    searchValue () {
      // category value 如果一開始有值，表示資料筆數小於 200，不需用後端的 search
      if (!this.isCategoryValueSearch) {
        // 這裡字串比對用 startsWith 是為了和後端一致
        this.valueList = this.tempAliasList
          .filter(element => !this.queryString || element.name.startsWith(this.queryString))
        this.isSearching = false
      } else {
        dataValueSearch(this.columnId, { searchString: this.queryString })
          .then(({ fuzzySearchResult }) => {
            this.tempValueList = fuzzySearchResult.map(element => {
              return {
                value: element,
                name: element
              }
            })

            this.valueList = [...this.tempValueList]
            // 將首次 remote search 拿回的 valueList 暫存起來供之後使用
            if (!this.queryString) {
              this.tempAliasList = JSON.parse(JSON.stringify(this.valueList))
            }
          })
          .finally(() => {
            this.isSearching = false
          })
      }
    },
    updateDataValue (value) {
      /* 使用中文輸入法時，按 enter 剛好會也會觸發到滑鼠左鍵的點擊，讓選項誤選
       * 這時時候 keyPress 不會有值，keyDown 則會回傳 229
      */
      if (event.keyCode === 13 || event.keyCode === 229) return
      this.selectedList = value
      // TODO:每次都要重新取值，有點沒效率
      this.subRestraint.properties.datavalues = []
      this.tempValueList.forEach(item => {
        if (value.includes(item.name)) this.subRestraint.properties.datavalues.push(item.value)
      })
      this.subRestraint.properties.display_datavalues = value
    },
    deleteSubRestraint () {
      this.$emit('delete')
    },
    /* timePicker 單位是 week 時，不能使用 value-format
     * https://github.com/ElemeFE/element/issues/8783
    */
    handleWeekStart (time) {
      if (this.subRestraint.properties.timeScope !== 'WEEK') return
      this.subRestraint.properties.start = time.getTime()
    },
    handleWeekEnd (time) {
      if (this.subRestraint.properties.timeScope !== 'WEEK') return
      this.subRestraint.properties.end = time.getTime()
    },
    disabledDueDate (time) {
      return time.getTime() < new Date(this.subRestraint.properties.start).getTime()
    },
    onSelectfocused () {
      this.$refs.fuzzySearchSelect.$refs.input.blur = () => {
        // 因 el-select blur 監聽回調失效，改成監聽 focus 事件
        // 使用 setTimeout 在選單關閉之後再 assign 新值避免閃爍
        setTimeout(() => {
          if (this.tempAliasList.length > 0) this.valueList = this.tempAliasList
        }, 100)
      }
    },
    hasErrorOf (field) {
      return this.errors.has(field, this.validatorScope)
    },
    getFirstErrorOf (field) {
      return this.errors.first(field, this.validatorScope)
    }
  }

}
</script>

<style lang="scss" scoped>
.single-sub-restraint {
  &__header {
    display: flex;
    flex-direction: row;
    margin-bottom: 8px;

    .btn-delete {
      color: #ccc;
      cursor: pointer;

      &:hover {
        color: $theme-color-primary;
      }
    }
  }

  &__title {
    @include text-hidden;

    color: #ccc;
    flex: 1;
    font-size: 14px;
    line-height: 22px;
    margin: 0;
  }

  &__content {
    margin-bottom: 16px;
    overflow-y: auto;

    .empty-message {
      background-color: #1c292b;
      border-radius: 8px;
      color: #ccc;
      font-size: 14px;
      padding: 8px 12px;
    }
  }

  .numeric-block,
  .datetime-block {
    background-color: #1c292b;
    border-radius: 8px;
    margin-bottom: 8px;
    padding: 12px;

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
        align-items: center;
        display: flex;
        flex-direction: row;
      }

      &__label {
        color: #ccc;
        flex: 1;
        font-size: 12px;
        line-height: 22px;
      }

      &__input {
        background-color: #141c1d;
        border-bottom: none;
        border-radius: 5px;
        font-size: 12px;
        height: 30px;
        padding: 0 12px;
        text-align: right;
        width: 150px;
      }

      .error-text {
        float: right;
        font-size: 12px;
        line-height: 22px;
        margin-top: 4px;
      }
    }
  }

  .date-picker {
    max-width: 150px;

    ::v-deep .el-input__inner {
      height: 30px;
    }

    ::v-deep .el-input__suffix {
      .el-input__icon {
        line-height: 30px;
      }
    }
  }

  .category-block {
    overflow: unset;
    position: relative;

    .warning-text {
      color: $theme-color-warning;
      font-size: 12px;
      line-height: 22px;
      margin-top: 4px;
    }

    &__selector {
      background-color: #141c1d;
      border-radius: 5px;
      width: 100%;

      /* [Bug 未解] el-select selects multiple window jitter.
       * https://github.com/ElemeFE/element/issues/8731
       * https://github.com/ElemeFE/element/issues/13173
       */

      ::v-deep .el-select__tags {
        display: block;

        .el-select__input {
          width: 100% !important;
        }

        .el-tag.el-tag--info {
          background-color: transparent;
          border-color: $theme-color-primary;
          color: $theme-color-primary;
          display: block;
          font-size: 14px;
          font-weight: 600;
          height: 26px;
          line-height: 22px;
          max-width: 200px;
          width: fit-content;

          .el-select__tags-text {
            display: inline-block;
            max-width: 150px;
            overflow: hidden;
            text-overflow: ellipsis;
            vertical-align: middle;
            white-space: nowrap;
          }
        }

        .el-select__input {
          color: #ccc;
        }

        .el-tag__close {
          background-color: transparent;
          color: $theme-color-primary;
          font-weight: bold;
          margin: 0;
          right: 0;

          &::before {
            font-size: 14px;
          }
        }
      }

      ::v-deep .el-input__inner {
        color: #888;
        font-size: 14px;
        line-height: 22px;
      }

      ::v-deep .el-select-dropdown {
        left: 0 !important;
        width: 100%;

        .el-select-dropdown__item {
          background-color: transparent;
          color: #ccc;
          font-weight: normal;
          padding: 0 20px 0 36px;

          &:hover {
            background-color: rgba(0, 0, 0, 0.6);
          }

          &::after {
            border: 1.1px solid #fff;
            content: '';
            font-size: 12px;
            font-weight: bold;
            height: 14px;
            left: 12px;
            line-height: 15px;
            position: absolute;
            top: 8px;
            width: 14px;
          }

          &.selected {
            &::after {
              background-color: #1eb8c7;
              border-color: #1eb8c7;
              color: #fff;
              content: '\E6DA';
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

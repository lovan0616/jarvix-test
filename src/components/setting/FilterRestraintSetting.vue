<template>
  <form :data-vv-scope="validatorScope">
    <div class="restraint-setting">
      <div
        class="restraint-setting__back-icon"
        @click="backToPreviousPage"
      >
        <svg-icon icon-class="arrow-left" />
        {{ $t('dataFrameAdvanceSetting.restrictionSetting') }}
      </div>
      <div class="restraint-setting__header">
        <h1 class="restraint-setting__title">
          {{ $t('dataFrameAdvanceSetting.restraintSetting') }}
          <join-logic-hints
            :hint="$t('dataFrameAdvanceSetting.ANDLogicHint')"
            icon-class="inner-join"
          />
        </h1>
        <button
          :class="{'add-restraint-btn--active': isShowSeletor}"
          type="button"
          class="btn-outline add-restraint-btn"
          @click.stop="addSubRestraint"
        >
          <span>
            <svg-icon icon-class="plus" />
          </span>
        </button>
        <div
          v-show="isShowSeletor"
          ref="selectList"
          class="restraint-setting__selector selector"
        >
          <search-block
            v-model="queryColumnName"
            :placeholder="$t('dataFrameAdvanceSetting.searchColumn')"
            class="selector__input-block"
          />
          <div
            v-if="columnFilterOption.length === 0"
            class="empty-message"
          >
            {{ $t('message.emptyResult') }}
          </div>
          <div class="selector__list-block">
            <template v-for="(column, index) in columnFilterOption">
              <label
                :key="index"
                :class="{'checkbox--active': column.active}"
                class="checkbox"
              >
                <div class="checkbox-label">
                  <input
                    v-model="column.active"
                    :disabled="column.active"
                    type="checkbox"
                    @change="selectColumn(index)"
                  >
                  <div class="checkbox-square" />
                </div>
                <span>{{ column.name }}</span>
              </label>
            </template>
          </div>
        </div>
      </div>
      <div class="restraint-setting__content">
        <div
          v-if="tempRestraintList.length === 0"
          class="empty-message"
        >
          {{ $t('dataFrameAdvanceSetting.noRestraintYet') }}
        </div>
        <template v-else>
          <single-sub-restraint-block
            v-for="(sub, index) in tempRestraintList"
            :key="sub.properties.dc_id"
            :index="index"
            :sub-restraint="sub"
            :validator-scope="validatorScope"
            @delete="deleteSubRestraint(index)"
          />
        </template>
      </div>
      <div class="restraint-setting__button-block">
        <button
          v-if="tempRestraintList.length !== 0 && hasSettingChanged"
          type="button"
          class="btn btn-default"
          @click.stop="save()"
        >
          {{ $t('button.confirm') }}
        </button>
      </div>
    </div>
  </form>
</template>
<script>
import SearchBlock from '@/components/SearchBlock'
import DefaultSelect from '@/components/select/DefaultSelect'
import SingleSubRestraintBlock from '@/components/setting/SingleSubRestraintBlock'
import JoinLogicHints from './JoinLogicHints'
import { mapState } from 'vuex'

export default {
  name: 'FilterRestraintSetting',
  inject: ['$validator'],
  components: {
    SearchBlock,
    DefaultSelect,
    SingleSubRestraintBlock,
    JoinLogicHints
  },
  props: {
    restraint: {
      type: Object,
      default: () => {}
    }
  },
  data () {
    return {
      isShowSeletor: false,
      queryColumnName: '',
      selectedColumn: [],
      tempRestraintList: [],
      validatorScope: 'filter-restraint-setting'
    }
  },
  computed: {
    ...mapState('dataFrameAdvanceSetting', ['columnList']),
    columnOption () {
      return this.columnList.map((column, index) => {
        return {
          id: column.id,
          name: column.name,
          active: this.tempRestraintList.some(restraint => restraint.properties.dc_id === column.id)
        }
      })
    },
    columnFilterOption () {
      return this.queryColumnName.length > 0
        ? this.columnOption.filter(column => column.name.toLowerCase().split(this.queryColumnName.toLowerCase()).length > 1) || []
        : this.columnOption
    },
    hasSettingChanged () {
      if (this.restraint === undefined && this.tempRestraintList.length !== 0) {
        return true
      }
      let isRestraintConditionUntouched
      if (this.restraint.type !== 'compound') {
        isRestraintConditionUntouched = this.tempRestraintList.length === 1 && JSON.stringify(this.restraint) === JSON.stringify(this.tempRestraintList[0])
      } else {
        isRestraintConditionUntouched = JSON.stringify(this.restraint.restraints) === JSON.stringify(this.tempRestraintList)
      }
      return !isRestraintConditionUntouched
    }
  },
  mounted () {
    document.addEventListener('click', this.autoHide, false)
    if (!this.restraint) return
    if (this.restraint.type === 'compound') {
      this.tempRestraintList = JSON.parse(JSON.stringify(this.restraint.restraints))
    } else {
      this.tempRestraintList = [JSON.parse(JSON.stringify(this.restraint))]
      this.tempRestraintList.forEach(restraint => {
        if (restraint.properties.data_type === 'datetime') {
          restraint.properties.start = this.customerTimeFormatter(restraint.properties.start, 'SECOND')
          restraint.properties.end = this.customerTimeFormatter(restraint.properties.end, 'SECOND')
        }
      })
    }
  },
  destroyed () {
    document.removeEventListener('click', this.autoHide, false)
  },
  methods: {
    autoHide (evt) {
      if (this.isShowSeletor && !this.$refs.selectList.contains(evt.target)) {
        this.isShowSeletor = false
      }
    },
    backToPreviousPage () {
      this.$emit('prev')
    },
    async selectColumn (index) {
      const selectColumn = this.columnList.filter(column => this.columnFilterOption[index].id === column.id)[0]
      const columnStatsType = selectColumn.statsType
      const columnDataType = selectColumn.dataType

      const isColumnInList = this.tempRestraintList.some(restraint => {
        return restraint.properties.dc_id === selectColumn.id
      })
      if (isColumnInList) return

      let subStraintType, subStraintProperties
      switch (columnStatsType) {
        case 'BOOLEAN':
        case 'CATEGORY':
          subStraintType = 'enum'
          subStraintProperties = {
            data_type: columnDataType.toLowerCase(),
            datavalues: [],
            dc_id: selectColumn.id,
            display_datavalues: [],
            display_name: selectColumn.name
          }
          break
        case 'DATETIME':
          subStraintType = 'range'
          subStraintProperties = {
            data_type: columnDataType.toLowerCase(),
            dc_id: selectColumn.id,
            display_name: selectColumn.name,
            end: null,
            start: null,
            timeScope: 'SECOND'
          }
          break
        case 'NUMERIC':
          subStraintType = 'range'
          subStraintProperties = {
            data_type: columnDataType.toLowerCase(),
            dc_id: selectColumn.id,
            display_name: selectColumn.name,
            end: null,
            start: null
          }
          break
      }
      this.tempRestraintList.push({
        type: subStraintType,
        properties: subStraintProperties
      })
    },
    addSubRestraint () {
      this.isShowSeletor = !this.isShowSeletor
    },
    deleteSubRestraint (index) {
      this.tempRestraintList.splice(index, 1)
    },
    save () {
      this.$validator.validateAll('filter-restraint-setting').then(isValidate => {
        if (!isValidate) return

        // Reconstruct restraints
        let updatedRestraint
        if (this.tempRestraintList.length > 1) {
          updatedRestraint = {
            type: 'compound',
            restraints: this.tempRestraintList
          }
        } else if (this.tempRestraintList.length === 1) {
          [updatedRestraint] = this.tempRestraintList
        } else {
          updatedRestraint = {}
        }
        this.$emit('updated:restraint', updatedRestraint)
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.restraint-setting {
  background-color: transparent;
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 16px 24px;

  &__back-icon {
    color: $theme-color-primary;
    cursor: pointer;
    font-size: 14px;
    margin-bottom: 15px;

    &:hover {
      opacity: 0.8;
    }
  }

  &__header {
    display: flex;
    flex-direction: row;
    margin: 0 0 15px;
    position: relative;
  }

  &__title {
    display: flex;
    flex: 1;
    font-size: 16px;
    font-weight: 600;
    line-height: 22px;
    margin: 0;

    ::v-deep .join-logic-hints__icon {
      margin-left: 8px;
    }
  }

  .add-restraint-btn {
    border-radius: 4px;
    font-size: 14px;
    font-weight: 300;
    height: 24px;
    width: 28px;

    &--active {
      border-color: $theme-color-primary;
      color: $theme-color-primary;
    }
  }

  &__selector {
    background-color: var(--color-bg-gray);
    border-radius: 5px;
    filter: drop-shadow(2px 2px 5px rgba(12, 209, 222, 0.5));
    left: 100%;
    padding-top: 12px;
    position: absolute;
    top: -6px;
    width: 100%;
    z-index: 4;

    &::before {
      border-bottom: 8px solid transparent;
      border-right: 12px solid #2b3839;
      border-top: 8px solid transparent;
      content: '';
      left: -10px;
      position: absolute;
      top: 8px;
    }
  }

  .selector {
    &__input-block {
      background-color: #141c1d;
      color: #888;
      font-size: 14px;
      margin: 0 12px 8px;
    }

    &__list-block {
      max-height: 220px;
      overflow-y: auto;

      &::-webkit-scrollbar {
        width: 8px;
      }

      &::-webkit-scrollbar-track {
        background-color: transparent;
      }

      &::-webkit-scrollbar-thumb {
        background-color: rgba(0, 0, 0, 0.7);
      }

      .checkbox {
        align-items: center;
        cursor: pointer;
        display: flex;
        flex-direction: row;
        height: 32px;

        &:hover {
          background-color: rgba(0, 0, 0, 0.6);
        }

        &--active {
          cursor: not-allowed;
        }

        &:not(:first-child) {
          border-top: 1px solid #3f4546;
        }

        &-label {
          margin: 0 8px 0 12px;

          & input:checked ~ .checkbox-square {
            background: #777;
            border-color: #dcdfe6;
          }

          & input:disabled ~ .checkbox-square::after {
            border-color: #c0c4cc;
          }
        }

        & > span {
          @include text-hidden;

          color: #ccc;
          font-size: 14px;
          line-height: 20px;
        }
      }
    }

    .empty-message {
      color: #ccc;
      font-size: 12px;
      line-height: 20px;
      margin-bottom: 12px;
      padding: 0 12px;
    }
  }

  &__content {
    flex: 1;
    margin-bottom: 22px;
    overflow-x: hidden;
    overflow-y: auto;

    &::-webkit-scrollbar {
      width: 5px;
    }

    .empty-message {
      color: #aaa;
      font-size: 12px;
    }
  }

  &__button-block {
    .btn {
      height: 28px;
      width: 100%;
    }
  }
}
</style>

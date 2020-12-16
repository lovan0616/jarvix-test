<template>
  <div class="restraint-setting">
    <div
      class="restraint-setting__back-icon" 
      @click="backToPreviousPage">
      <svg-icon icon-class="arrow-left"/>
      {{ $t('dataFrameAdvanceSetting.restrictionSetting') }}
    </div>
    <div class="restraint-setting__header">
      <h1 class="restraint-setting__title">{{ $t('dataFrameAdvanceSetting.restraintSetting') }}</h1>
      <button
        :class="{'add-restraint-btn--active': isShowSeletor}"
        type="button"
        class="btn-outline add-restraint-btn"
        @click.stop="addSubRestraint"
      ><span>
        <svg-icon icon-class="plus" />
      </span>
      </button>
      <div 
        v-show="isShowSeletor"
        ref="selectList"
        class="restraint-setting__selector selector">
        <input
          v-model="queryColumnName"
          :placeholder="$t('dataFrameAdvanceSetting.searchColumn')"
          class="selector__input-block"
          type="text"
        >
        <div 
          v-if="columnFilterOption.length === 0" 
          class="empty-message">
          {{ $t('message.emptyResult') }}
        </div>
        <div class="selector__list-block">
          <template v-for="(column, index) in columnFilterOption">
            <label 
              :key="index"
              :class="{'checkbox--active': column.active}"
              class="checkbox">
              <div class="checkbox-label">
                <input
                  v-model="column.active"
                  :disabled="column.active"
                  type="checkbox"
                  @change="selectColumn(index)"
                >
                <div class="checkbox-square"/>
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
        class="empty-message">
        {{ $t('dataFrameAdvanceSetting.noRestraintYet') }}
      </div>
      <template v-else>
        <single-sub-restraint-block
          v-for="(sub, index) in tempRestraintList"
          :key="sub.properties.dc_id"
          :index="index"
          :sub-restraint="sub"
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
      >{{ $t('button.confirm') }}
      </button>
    </div>
  </div>
</template>
<script>
// import { getDataColumnValue } from '@/API/DataSource'
import DefaultSelect from '@/components/select/DefaultSelect'
import SingleSubRestraintBlock from '@/components/setting/SingleSubRestraintBlock'
import { mapState } from 'vuex'

export default {
  name: 'FilterRestraintSetting',
  inject: ['$validator'],
  components: {
    DefaultSelect,
    SingleSubRestraintBlock
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
      tempRestraintList: []
    }
  },
  computed: {
    ...mapState('dataFrameAdvanceSetting', ['columnList']),
    NoDatetimeColumn () {
      return this.columnList.filter(column => column.statsType !== "DATETIME")
    },
    columnOption () {
      return this.NoDatetimeColumn.map((column, index) => {
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
      if(this.restraint === undefined && this.tempRestraintList.length !== 0) {
        return true
      }
      let isRestraintConditionUntouched
      if(this.restraint.type !== 'compound') {
        isRestraintConditionUntouched = this.tempRestraintList.length === 1 && JSON.stringify(this.restraint) === JSON.stringify(this.tempRestraintList[0]) 
      } else {
        isRestraintConditionUntouched = JSON.stringify(this.restraint.restraints) === JSON.stringify(this.tempRestraintList) 
      }
      return !isRestraintConditionUntouched
    }
  },
  mounted () {
    document.addEventListener('click', this.autoHide, false)
    if(this.restraint.type === 'compound') {
      this.tempRestraintList = JSON.parse(JSON.stringify(this.restraint.restraints))
    } else {
      this.tempRestraintList = [JSON.parse(JSON.stringify(this.restraint))]
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
      this.$emit("prev")
    },
    async selectColumn (index) {
      const selectColumn = this.columnList.filter(column => this.columnFilterOption[index].id === column.id)[0]
      const columnStatsType = selectColumn.statsType
      const columnDataType = selectColumn.dataType

      const isColumnInList = this.tempRestraintList.some(restraint => {
        return restraint.properties['dc_id'] === selectColumn.id
      })
      if(isColumnInList) return 

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
            start: null 
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
      this.$validator.validateAll().then(isValidate => {
        if (!isValidate) return

        // Reconstruct restraints
          let updatedRestraint
          if(this.tempRestraintList.length > 1){
            updatedRestraint = {
              type: 'compound',
              restraints: this.tempRestraintList
            }
          } else if(this.tempRestraintList.length === 1) {
            [updatedRestraint] = this.tempRestraintList
          } else {
            updatedRestraint = {}
          }
          this.$emit('updated:restraint', updatedRestraint)

        // handle empty range value 先拿掉，現在強制都要有值

        // const tempRestraintRangeList = this.tempRestraintList.filter(restraint => restraint.type === 'range')
        // Promise.all(tempRestraintRangeList.map(async(restraint) => await getDataColumnValue(restraint.properties.dc_id)))
        //   .then(response => {
        //     let responseIndex = 0
        //     this.tempRestraintList.forEach(restraint =>{
        //       if(restraint.type === 'range') {
        //         const valueBound = response[responseIndex][response[responseIndex].type.toLowerCase()]
        //         restraint.properties.end = restraint.properties.end || valueBound.max
        //         restraint.properties.start = restraint.properties.start || valueBound.min
        //         responseIndex += 1
        //       }
        //     })
        //   })
      })
    }
  },
}
</script>

<style lang="scss" scoped>
.restraint-setting {
  display: flex;
  flex-direction: column;
  padding: 16px 24px;
  height: 100%;
  background-color: transparent;

  &__back-icon {
    margin-bottom: 15px;
    font-size: 14px;
    color: $theme-color-primary;
    cursor: pointer;

    &:hover {
      opacity: 0.8;
    }
  }

  &__header {
    position: relative;
    margin: 0 0 15px 0;
    display: flex;
    flex-direction: row;
  }

  &__title {
    flex: 1;
    margin: 0;
    font-weight: 600;
    font-size: 16px;
    line-height: 22px;
  }

  .add-restraint-btn {
    width: 28px;
    height: 24px;
    font-size: 14px;
    font-weight: 300;
    border-radius: 4px;

    &--active {
      color: $theme-color-primary;
      border-color: $theme-color-primary;
    }
  }

  &__selector {
    position: absolute;
    top: 30px;
    left: 0;
    padding-top: 12px;
    width: 100%;
    border-radius: 5px;
    background-color: var(--color-bg-gray);
    filter: drop-shadow(2px 2px 5px rgba(12, 209, 222, .5));
    z-index: 2;

    &::before {
      content: '';
      position: absolute;
      top: -10px;
      right: 6px;
      border-bottom: 12px solid #2B3839;
      border-left: 8px solid transparent;
      border-right: 8px solid transparent;
    }
  }

  .selector {
    &__input-block {
      margin: 0 12px 8px 12px;
      padding: 9px 12px;
      width: calc(100% - 24px);
      font-size: 14px;
      color: #888888;
      border: none;
      border-radius: 8px;
      background-color: #141C1D;

      &:focus {
        outline: none;
      }
      
      .placeholder {
        font-size: 14px;
        line-height: 22px;
        color: #888888;
      }
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
        display: flex;
        flex-direction: row;
        align-items: center;
        height: 32px;
        cursor: pointer;

        &:hover {
          background-color: rgba(0, 0, 0, .6);
        }

        &--active {
          cursor: not-allowed;
        }

        &:not(:first-child) {
          border-top: 1px solid #3F4546;
        }

        &-label {
          margin: 0 8px 0 12px;

          & input:checked ~ .checkbox-square {
            background: #777777;
            border-color: #DCDFE6;
          }

          & input:disabled ~ .checkbox-square:after {
            border-color: #C0C4CC;
          }
        }

        & > span {
          font-size: 14px;
          line-height: 20px;
          color: #CCC;
        }
      }
    }

    .empty-message {
      margin-bottom: 12px;
      padding: 0 12px;
      font-size: 12px;
      line-height: 20px;
      color: #CCC;
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
      color: #AAAAAA;
      font-size: 12px;
    }
  }

  &__button-block {
    .btn {
      width: 100%;
      height: 28px;
    }
  }
}
</style>
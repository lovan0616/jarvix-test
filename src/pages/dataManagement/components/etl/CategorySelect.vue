<template>
  <div class="dropdown">
    <el-cascader
      v-model="editedColumnInfo.statsType"
      :is-disabled="isReviewMode"
      :show-all-levels="false" 
      :options="cascaderStatsTypeOptions"
      :props="{ expandTrigger: 'hover', label: 'name', children: 'pattern' }"
      filterable
      class="sy-select theme-dark"
      @change="openConfirmMsg">
      <template #default="{ node, data }">
        <svg-icon
          v-if="statsTypeList.includes(data.value)"
          :icon-class="getStatsTypeIcon(data.value)"
          class="statsType__icon" />
        <span class="statsType__label">{{ data.name }}</span>
      </template>
    </el-cascader>
    <svg-icon 
      :icon-class="getStatsTypeIcon(editedColumnInfo.statsType[0])"
      class="statsType__icon" />
    <div
      v-if="showConfirmMsg"
      class="confirm"
    >
      <div class="confirm__message">
        {{ $t('message.confirmColumnStateTypeChange') }}
      </div>
      <div class="confirm__buttons">
        <a
          href="javascript:void(0)"
          class="link confirm__link--cancel"
          @click="cancelChange()"
        >{{ $t('button.cancel') }}</a>
        <a
          href="javascript:void(0)"
          class="link"
          @click="confirmChange()"
        >{{ $t('button.confirm') }}</a>
      </div>
    </div>
  </div>
</template>

<script>
import DefaultSelect from '@/components/select/DefaultSelect'
import { statsTypeList, statsTypeOptionList } from '@/utils/general'
import { mapState } from 'vuex'

export default {
  name: 'CategorySelect',
  components: {
    DefaultSelect
  },
  props: {
    columnInfo: {
      type: Object,
      default: () => {}
    },
    isReviewMode: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      editedColumnInfo: JSON.parse(JSON.stringify(this.columnInfo)),
      originalStatsType: '',
      statsTypeList,
      statsTypeOptionList,
      showConfirmMsg: false
    }
  },
  computed: {
    ...mapState('dataManagement', ['datetimePatterns']),
    statsTypeOptions () {
      return statsTypeOptionList.filter((option) => {
        return this.editedColumnInfo.originalStatsType === 'DATETIME'
          ? option
          : option.value !== 'DATETIME'
      })
    },
    cascaderStatsTypeOptions () {
      if (this.editedColumnInfo.originalStatsType !== 'DATETIME') return this.statsTypeOptions
      return this.statsTypeOptions.map(item => {
        if(item.value !== 'DATETIME') return item
        else return {
          ...item,
          pattern: this.datetimePatterns.map(pattern => {
            return {
              value: pattern.datetimePattern,
              name: pattern.datetimePattern
            }
          })
        }
      })
    }
  },
  watch: {
    columnInfo () {
      this.editedColumnInfo = JSON.parse(JSON.stringify(this.columnInfo))
      this.editedColumnInfo.statsType = this.stateTypeConverter(this.editedColumnInfo.statsType)
    }
  },
  mounted () {
    // 因應 cascader 的資料型態, 需轉成 Array
    this.originalStatsType = this.stateTypeConverter(this.columnInfo.statsType)
    this.editedColumnInfo.statsType = this.originalStatsType
  },
  methods: {
    stateTypeConverter (type) {
      let statsType = JSON.parse(JSON.stringify(type))
      if (statsType === 'DATETIME') statsType = ['DATETIME', this.columnInfo.datetimePatterns[0]]
      else statsType = [statsType]
      return statsType
    },
    columnInfoFormatter (cascaderColumnInfo) {
      const tempColumnInfo = JSON.parse(JSON.stringify(cascaderColumnInfo))
      tempColumnInfo.statsType = cascaderColumnInfo.statsType[0]
      tempColumnInfo.datetimePatterns = cascaderColumnInfo.statsType[0] === 'DATETIME' 
        ? [cascaderColumnInfo.statsType[1]]
        : []
      return tempColumnInfo
    },
    openConfirmMsg () {
      this.showConfirmMsg = true
    },
    closeConfirmMsg () {
      this.showConfirmMsg = false
    },
    cancelChange () {
      this.editedColumnInfo.statsType = this.originalStatsType
      this.closeConfirmMsg()
    },
    confirmChange () {
      this.changeStatsType()
      this.editedColumnInfo.hasChanged = this.editedColumnInfo.statsType[0] !== this.editedColumnInfo.originalStatsType
      this.editedColumnInfo.values = this.editedColumnInfo.values.filter(el => el.type !== 'VALUE_REPLACEMENT')
      this.editedColumnInfo.values.forEach(function (el) { el.newValue = null })

      this.$emit('updateInfo', this.columnInfoFormatter(this.editedColumnInfo))
      this.closeConfirmMsg()
    },
    changeStatsType () {
      switch (this.editedColumnInfo.statsType[0]) {
        case 'NUMERIC':
          this.editedColumnInfo.targetDataType = 'FLOAT'
          break
        case 'CATEGORY':
          this.editedColumnInfo.targetDataType = 'STRING'
          break
        case 'DATETIME':
          this.editedColumnInfo.targetDataType = 'DATETIME'
          break
        case 'BOOLEAN':
          this.editedColumnInfo.targetDataType = 'BOOLEAN'
          break
      }
    },
    getStatsTypeIcon (statesType) {
      const currentStatesType = Array.isArray(statesType) ? statesType[0] : statesType
      switch (currentStatesType) {
        case 'CATEGORY':
          return 'character-a'
        case 'NUMERIC':
          return 'numeric'
        case 'BOOLEAN':
          return 'checked'
        case 'DATETIME':
          return 'calendar'
        default:
          return 'check-circle'
      }
    },
  }
}
</script>

<style lang="scss" scoped>
.dropdown {
  position: relative;
}

>>> .sy-select {
  .el-input__inner {
    padding-left: 40px;
  }
  .statsType__label {
    padding-left: 20px;
  }
}
.statsType__icon {
  position: absolute;
  top: 50%;
  left: 16px;
  transform: translateY(-50%);
  font-size: 16px;
}

.confirm {
  position: absolute;
  z-index: 1;
  padding: 10px 12px;
  background: #323A3A;
  border: 1px solid #2AD2E2;
  border-radius: 8px;
  box-shadow: 0px 2px 10px rgba(34, 117, 125, 0.5);
  top: calc(100% + 10px);

  &::before {
    content: '';
    position: absolute;
    bottom: 100%;
    left: 10%;
    border-bottom: 9px solid #2AD2E2;
    border-left: 9px solid transparent;
    border-right: 9px solid transparent;
    border-top: 9px solid transparent;
  }

  &__message {
    font-size: 14px;
    font-weight: normal;
    margin-bottom: 5px;
  }

  &__buttons {
    display: flex;
    justify-content: flex-end;
  }

  &__link {
    &--cancel {
      color: #FFFFFF;
      margin-right: 12px;
    }
  }
}

</style>

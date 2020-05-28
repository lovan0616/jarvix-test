<template>
  <div class="dropdown">
    <default-select
      v-model="editedColumnInfo.statsType"
      :option-list="statsTypeOptions"
      class="dropdown__container"
      @change="openConfirmMsg"
    />
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
import { statsTypeOptionList } from '@/utils/general'

export default {
  name: 'CategorySelect',
  components: {
    DefaultSelect
  },
  props: {
    columnInfo: {
      type: Object,
      default: () => {}
    }
  },
  data () {
    return {
      editedColumnInfo: JSON.parse(JSON.stringify(this.columnInfo)),
      statsTypeOptionList,
      showConfirmMsg: false
    }
  },
  computed: {
    statsTypeOptions () {
      return statsTypeOptionList.filter((option) => {
        return this.editedColumnInfo.originalStatsType === 'DATETIME'
          ? option
          : option.value !== 'DATETIME'
      })
    }
  },
  watch: {
    columnInfo () {
      this.editedColumnInfo = JSON.parse(JSON.stringify(this.columnInfo))
    }
  },
  methods: {
    openConfirmMsg () {
      this.showConfirmMsg = true
    },
    closeConfirmMsg () {
      this.showConfirmMsg = false
    },
    cancelChange () {
      this.editedColumnInfo.statsType = this.columnInfo.statsType
      this.closeConfirmMsg()
    },
    confirmChange () {
      this.changeStatsType()
      this.editedColumnInfo.hasChanged = this.editedColumnInfo.statsType !== this.editedColumnInfo.originalStatsType
      this.editedColumnInfo.values = this.editedColumnInfo.values.filter(el => el.type !== 'VALUE_REPLACEMENT')
      this.editedColumnInfo.values.forEach(function (el) { el.newValue = null })

      this.$emit('updateInfo', this.editedColumnInfo)
      this.closeConfirmMsg()
    },
    changeStatsType () {
      switch (this.editedColumnInfo.statsType) {
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
    }
  },
}
</script>

<style lang="scss" scoped>
.dropdown {
  position: relative;
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

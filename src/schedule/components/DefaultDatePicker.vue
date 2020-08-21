<template>
  <div class="default-date-picker">
    <el-date-picker
      v-model="datetimeValue"
      :type="type"
      :clearable="clearable"
      :range-separator="$t('schedule.base.to')"
      :start-placeholder="$t('schedule.base.startTime')"
      :end-placeholder="$t('schedule.base.endTime')"
      :format="format"
      :value-format="valueFormat"
      :picker-options="pickerOptions"
    />
    <i
      v-if="deletable"
      class="icon-remove el-icon-remove-outline"
      @click="$emit('delete')"
    />
  </div>
</template>

<script>
export default {
  name: 'DefaultDatePicker',
  props: {
    value: {
      type: [Array, String],
      default: null
    },
    type: {
      type: String,
      default: 'datetimerange'
    },
    clearable: {
      type: Boolean,
      default: false
    },
    format: {
      type: String,
      default: 'yyyy/MM/dd HH:mm'
    },
    valueFormat: {
      type: String,
      default: 'yyyy/MM/dd HH:mm'
    },
    deletable: {
      type: Boolean,
      default: false
    },
    pickerOptions: {
      type: Object,
      default: () => {}
    }
  },
  data () {
    return {
    }
  },
  computed: {
    datetimeValue: {
      get () {
        return this.value
      },
      set (value) {
        if (value === this.value) return
        this.$emit('input', value)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.default-date-picker {
  position: relative;
  display: flex;
  align-items: center;
  border-bottom: 1px solid var(--color-text);
  .icon-remove {
    position: absolute;
    right: 0;
    top: 8px;
    cursor: pointer;
    color: #bcbcbc;
    font-size: 14px;
  }
}
/deep/ .el-date-editor {
  &--datetimerange, &--daterange {
    background-color: transparent;
    border-radius: 0;
    border: 0;
  }
  .el-range-separator {
    color: var(--color-text);
  }
  .el-range-input {
    color: var(--color-text-gray);
    background-color: transparent;
  }
}
/deep/ .el-input__inner {
  color: var(--color-text-gray);
  text-align: center;
  background-color: transparent;
  border-radius: 0;
  border: none;
}
</style>

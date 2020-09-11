<template>
  <div class="single-machine">
    <div class="reason__wrapper">
      <span class="reason__label">{{ $t('schedule.setting.excludeReason') }}</span>
      <default-select
        v-model="excludeReason.reason"
        :options="reasonOptions"
      />
      <span class="reason__label time-period">{{ $t('schedule.setting.excludePeriod') }}</span>
      <default-date-picker v-model="excludedPeriod" />
      <i
        v-show="deletable"
        class="icon-remove el-icon-remove-outline"
        @click="$emit('delete')"
      />
    </div>
  </div>
</template>

<script>
export default {
  name: 'SingleExcludedMachine',
  props: {
    excludeReason: {
      type: Object,
      default: () => {}
    },
    deletable: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      editExcludeReason: {},
      reasonOptions: [
        { value: 'repairing', label: this.$t('schedule.setting.repairing') },
        { value: 'testing', label: this.$t('schedule.setting.testing') },
        { value: 'experimenting', label: this.$t('schedule.setting.experimenting') }
      ]
    }
  },
  computed: {
    excludedPeriod: {
      get () {
        return [this.excludeReason.startDatetime, this.excludeReason.endDatetime]
      },
      set (newVal) {
        this.excludeReason.startDatetime = newVal ? newVal[0] : ''
        this.excludeReason.endDatetime = newVal ? newVal[1] : ''
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.single-machine {
  color: var(--color-text);
  .reason__wrapper {
    display: flex;
    align-items: center;
    width: 100%;
    &+.reason__wrapper {
      margin-top: 8px;
    }
    .reason__label {
      margin-right: 16px;
      &.time-period {
        margin-left: 16px;
      }
    }
    .icon-remove {
      cursor: pointer;
      margin-left: auto;
    }
  }
}
</style>

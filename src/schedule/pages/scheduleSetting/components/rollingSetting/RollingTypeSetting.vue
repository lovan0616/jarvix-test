<template>
  <div class="block__form">
    <div class="form-description">
      <div class="info-row">
        {{ $t('schedule.rolling.scheduledJobTypes') }}：
      </div>
      <div class="info-row">
        <span class="highlight">{{ $t('schedule.rolling.firstType') }}：</span>
        <span class="bold">{{ $t('schedule.rolling.scheduled') }}</span>
        {{ $t('schedule.base.and') }}
        <span class="bold">{{ $t('schedule.rolling.isProducing') }}</span>
      </div>
      <div class="info-row">
        <span class="highlight">{{ $t('schedule.rolling.secondType') }}：</span>
        <span class="bold">{{ $t('schedule.rolling.scheduled') }}</span>
        {{ $t('schedule.base.and') }}
        <span class="bold">{{ $t('schedule.rolling.notYetProducing') }}</span>
      </div>
    </div>
    <div class="form-description">
      <div class="info-row">
        {{ $t('schedule.rolling.rollingTypeDesc') }}：
      </div>
      <div>
        <div
          v-for="option in rollingTypeOptions"
          :key="option.key"
          class="input-radio-group"
        >
          <input
            :id="option.key"
            v-model="rollingTypeSetting"
            :checked="option.key === rollingTypeSetting"
            :value="option.key"
            class="input-radio"
            type="radio"
          >
          <label
            :for="option.key"
            class="input-radio-label"
          >
            <span class="bold">{{ option.label.title }}</span>：
            <span>{{ option.label.description }}</span>
          </label>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'RollingTypeSetting',
  props: {
    originalSetting: {
      type: String,
      default: null
    }
  },
  data () {
    return {
      rollingTypeSetting: null
    }
  },
  computed: {
    rollingTypeOptions () {
      return [
        {
          key: 'POSTPONE',
          label: {
            title: this.$t('schedule.rolling.postpone'),
            description: this.$t('schedule.rolling.postponeDesc')
          }
        },
        {
          key: 'POSTPONE_RESCHEDULE',
          label: {
            title: this.$t('schedule.rolling.postponeReSchedule'),
            description: this.$t('schedule.rolling.postponeReScheduleDesc')
          }
        },
        {
          key: 'RESCHEDULE',
          label: {
            title: this.$t('schedule.rolling.reSchedule'),
            description: this.$t('schedule.rolling.reScheduleDesc')
          }
        }
      ]
    }
  },
  watch: {
    rollingTypeSetting (value) {
      this.$emit('change', value)
    }
  },
  mounted () {
    this.rollingTypeSetting = this.originalSetting
  }
}
</script>

<style lang="scss" scoped>
.block__form {
  display: block !important;
  .form-description {
    margin-bottom: 24px;
    .info-row {
      margin-bottom: 8px;
    }
    .input-radio-group {
      display: block;
      .input-radio-label {
        line-height: 32px;
      }
    }
  }
}
.highlight {
  color: $theme-color-warning;
}
.bold {
  font-weight: bold;
}
</style>

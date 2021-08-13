<template>
  <div class="adjust-history">
    <div v-if="adjustedHistory[sequence]">
      <div class="adjust-history__summary">
        {{ $t('schedule.simulation.adjustJob.adjustJobCount') }}：
        <span class="highlight">{{ jobNames.length }}</span>
        {{ $t('schedule.base.row') }}
      </div>
      <div class="adjust-history__list">
        <span
          v-for="(jobName, index) in jobNames"
          :key="jobName"
          class="job-name"
          @click="$emit('check', jobName)"
        >
          <span class="job-name__label">{{ jobName }}</span>{{ index === jobNames.length -1 ? '' : ', ' }}
        </span>
      </div>
    </div>
    <div v-else>
      {{ $t('schedule.base.noRecord') }}
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'AdjustHistory',
  props: {
    sequence: {
      type: Number,
      default: null,
      required: true
    }
  },
  computed: {
    ...mapState('jobAdjustments', ['adjustedHistory']),
    jobNames () {
      return Object.keys(this.adjustedHistory[this.sequence])
    }
  },
  methods: {}
}
</script>

<style lang="scss" scoped>
.adjust-history {
  font-size: 14px;
  &__summary {
    margin-bottom: 16px;

    .highlight {
      color: $theme-color-warning;
    }
  }
  &__list {
    .job-name {
      margin-right: 8px;

      &__label {
        position: relative;
        cursor: pointer;
        border-bottom: 1px solid #fff;
        white-space: nowrap;
        &:hover {
          color: $theme-color-primary;
          border-bottom: 1px solid $theme-color-primary;
        }
      }
    }
  }
}
</style>

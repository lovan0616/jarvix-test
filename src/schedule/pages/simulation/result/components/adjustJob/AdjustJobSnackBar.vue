<template>
  <div
    :class="{
      'is-adjusting': innerAdjustedJobsLength > 0,
      'is-closed': isHideJobList
    }"
    class="adjusted-jobs__wrapper"
  >
    <div class="adjusted-jobs__action-bar">
      <div
        class="adjusted-jobs__action-bar-left"
        @click="isHideJobList = !isHideJobList"
      >
        <i18n path="schedule.simulation.adjustJob.solutionAdjustedSummary">
          <span>{{ sequence }}</span>
          <span class="highlight">{{ innerAdjustedJobsLength }}</span>
        </i18n>
        <svg-icon
          :class="{ }"
          icon-class="arrow-right"
          class="adjusted-jobs__collapse-arrow"
        />
      </div>
      <div class="adjusted-jobs__action-bar-right">
        <template v-if="isShowRestoreButton">
          {{ $t('schedule.simulation.adjustJob.youHaveCanceledAdjustments') }}
          <default-button
            type="outline"
            @click="onClickRestore"
          >
            {{ $t('schedule.button.restore') }}
          </default-button>
        </template>
        <template v-else>
          {{ $t('schedule.simulation.adjustJob.confirmAdoptAdjustments') }}？
          <default-button
            type="outline"
            @click="onClickCancel"
          >
            {{ $t('schedule.button.cancel') }}
          </default-button>
          <default-button @click="$emit('simulate')">
            {{ $t('schedule.simulation.startSimulation') }}
          </default-button>
        </template>
      </div>
    </div>
    <div class="adjusted-jobs__list">
      <span
        v-for="(jobInfo, index) in innerAdjustedJobs"
        :key="jobInfo.jobId"
        class="job-name"
        @click="$emit('re-adjust', jobInfo)"
      >
        <span class="job-name__label">{{ jobInfo.jobName }}</span>{{ index === innerAdjustedJobs.length -1 ? '' : ', ' }}
      </span>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'AdjustJobSnackBar',
  props: {
    sequence: {
      type: Number,
      default: null
    }
  },
  data () {
    return {
      isHideJobList: false,
      isShowRestoreButton: false,
      restoreTimer: []
    }
  },
  computed: {
    ...mapState('jobAdjustments', ['adjustedJobs']),
    innerAdjustedJobs () {
      return Object.values(this.adjustedJobs).sort((a, b) => a.lastEditedTimestamp - b.lastEditedTimestamp)
    },
    innerAdjustedJobsLength () {
      return this.innerAdjustedJobs.length
    }
  },
  methods: {
    onClickRestore () {
      this.clearRestoreTimer()
      this.isShowRestoreButton = false
    },
    onClickCancel () {
      // TODO 開啟復原功能
      // this.isShowRestoreButton = true
      // this.restoreTimer.push(setTimeout(() => {
      // this.clearRestoreTimer()
      this.$emit('cancel')
      // }, 5 * 1000))
    },
    clearRestoreTimer () {
      this.restoreTimer.forEach(timer => clearTimeout(timer))
    }
  }
}
</script>

<style lang="scss" scoped>
$snack-bar-height: 52px;

.adjusted-jobs {
  &__wrapper {
    position: fixed;
    left: $app-side-nav-closed-width;
    bottom: 0;
    width: calc(100% - #{$app-side-nav-closed-width});
    background-color: rgba(46, 49, 50, 0.95);
    z-index: 1000;
    transform: translateY(100%);
    transition: all .3s ease;

    &.is-adjusting {
      transform: translateY(0);
    }
    &.is-closed {
      transform: translateY(calc(100% - #{$snack-bar-height}));
    }

    .link {
      cursor: pointer;
    }
  }
  &__action-bar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 8px 24px;
    &-left {
      cursor: pointer;
      .highlight {
        color: $theme-color-warning;
      }
    }
    &-right {
      .default-button + .default-button {
        margin-left: 8px;
      }
    }
  }
  &__collapse-arrow {
    transform: rotate(90deg);
    transition: transform .3s ease;
    .is-closed & {
      transform: rotate(-90deg);
    }
  }
  &__list {
    padding: 4px 24px 16px 24px;
    font-size: 14px;
    max-height: 30vh;
    overflow: auto;
    overflow: overlay;
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

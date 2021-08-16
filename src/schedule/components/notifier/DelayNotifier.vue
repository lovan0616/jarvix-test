<template>
  <transition name="slide-left">
    <div
      v-if="isShowNotifier"
      class="notifier"
    >
      <div class="notifier__content">
        <div class="notifier__content-title">
          {{ $t('schedule.rolling.delayNotification') }}
          <div class="timestamp">
            {{ timestamp | convertTimeStamp }}
          </div>
        </div>
        <div class="notifier__content-description">
          {{ $t('schedule.rolling.delayReminder') }}
        </div>
        <div class="notifier__content-description">
          <i18n path="schedule.rolling.delayJobCount">
            <span class="highlight">{{ notification.data.jobs.length }}</span>
          </i18n>
        </div>
        <div class="notifier__content-description text-hidden">
          {{ $t('schedule.rolling.delayJobId') }}：{{ delayedJobIdsString }}
        </div>
      </div>
      <div class="notifier__action">
        <div
          class="notifier__action-btn is-highlight"
          @click="onConfirm"
        >
          {{ $t('schedule.button.confirm') }}
        </div>
        <div
          class="notifier__action-btn"
          @click="onCheckMore"
        >
          {{ $t('schedule.button.checkMore') }}
        </div>
        <div
          class="notifier__action-btn"
          @click="$emit('delete')"
        >
          {{ $t('schedule.base.close') }}
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import { JOB_STATUS } from '@/schedule/utils/enum'

export default {
  name: 'DelayNotifier',
  props: {
    notification: {
      type: Object,
      default: null,
      required: true
    },
    timestamp: {
      type: Number,
      default: () => new Date().getTime()
    }
  },
  data () {
    return {
      isShowNotifier: false
    }
  },
  computed: {
    delayedJobIdsString () {
      // 通知訊息中，最多顯示前幾張延遲工單
      const maxShowJobsCount = 50
      return this.notification.data.jobs.slice(0, maxShowJobsCount).reduce((acc, cur, index, arr) => acc.concat(`${cur}${index < arr.length - 1 ? ', ' : ''}`), '')
    }
  },
  mounted () {
    setTimeout(() => this.isShowNotifier = true, 0)
  },
  methods: {
    onConfirm () {
      this.$store.commit('scheduleSetting/setGlobalJobStatusRestriction', JOB_STATUS.DELAY)
      if (this.$route.name !== 'Simulation') this.$router.push({ name: 'Simulation' })
      this.$emit('delete')
    },
    onCheckMore () {
      this.$store.commit('scheduleSetting/setGlobalJobStatusRestriction', JOB_STATUS.DELAY)
      if (this.$route.name !== 'CurrentSimulation') this.$router.push({ name: 'CurrentSimulation' })
      this.$emit('delete')
    }
  }
}
</script>

<style lang="scss" scoped>
.notifier {
  width: 100%;
  background: rgba(50, 58, 58, 0.95);
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.35);
  border-radius: 6px;
  display: flex;
  margin-bottom: 16px;
  max-height: unset;
  &__content {
    padding: 16px;
    flex: 1;
    &-title {
      display: flex;
      justify-content: space-between;
      font-weight: bold;
      margin-bottom: 8px;
      .timestamp {
        color: #AAA;
      }
    }
    &-description {
      font-size: 14px;
      margin-bottom: 8px;
      .highlight {
        color: $theme-color-warning;
      }
      &.text-hidden {
        @include text-hidden(3);
      }
    }
  }
  &__action {
    border-left: 1px solid #666666;
    display: flex;
    flex-direction: column;
    &-btn {
      flex: 1;
      display: flex;
      justify-content: center;
      align-items: center;
      cursor: pointer;
      padding: 16px;
      text-align: center;
      font-size: 14px;
      &:not(:last-child) {
        border-bottom: 1px solid #666666;
      }
      &.is-highlight {
        color: $theme-color-primary;
      }
    }
  }
}
</style>

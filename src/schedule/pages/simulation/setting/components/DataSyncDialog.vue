<template>
  <section
    class="dialog"
  >
    <div
      v-if="step === 1"
      class="dialog__inner-box"
    >
      <div @click="closeDialog">
        <i class="el-icon-close dialog-close" />
      </div>
      <div class="dialog__title">
        {{ $t('schedule.simulation.dataSync.title') }}
      </div>
      <div class="dialog__description">
        {{ $t('schedule.simulation.dataSync.description') }}
      </div>
      <div class="dialog__button-block">
        <default-button
          class="btn-cancel"
          type="outline"
          @click="closeDialog"
        >
          {{ $t('schedule.button.cancel') }}
        </default-button>
        <default-button
          class="btn-confirm"
          @click="confirmDataSync"
        >
          {{ $t('schedule.button.confirmDataSync') }}
        </default-button>
      </div>
    </div>
    <div
      v-if="step === 2"
      class="dialog__dataSync dataSync"
    >
      <spinner
        class="dataSync__spinner"
        size="50"
        theme-color
      />
      <div class="dataSync__title">
        {{ $t('schedule.simulation.dataSync.askSynchronizing') }}
      </div>
      <default-button
        :disabled="isProcessing"
        type="outline"
        class="dataSync__btn"
        @click="cancelDataSync"
      >
        <i
          v-if="isProcessing"
          class="el-icon-loading"
        />
        {{ $t('schedule.button.cancel') }}
      </default-button>
    </div>
    <div
      v-if="step === 3"
      class="dialog__syncProcess syncProcess"
    >
      <div class="syncProcess__title">
        {{ $t('schedule.simulation.dataSync.synchronizing') }}
      </div>
      <div class="syncProcess__progress">
        {{ progress }}%
      </div>
    </div>
  </section>
</template>

<script>

export default {
  name: '',
  data () {
    return {
      isProcessing: false,
      step: 1,
      progress: 0,
      timer: null
    }
  },
  destroyed () {
    clearInterval(this.timer)
  },
  methods: {
    cancelDataSync () {
      this.isProcessing = true
      this.$store.dispatch('simulation/cancelDataSync')
        .finally(() => {
          this.closeDialog()
        })
    },
    closeDialog () {
      this.$emit('closeDialog')
    },
    confirmDataSync () {
      this.step = 2
      this.$store.dispatch('simulation/dataSync')
        .then(() => {
          this.step = 3
          this.timer = setInterval(() => {
            this.$store.dispatch('simulation/checkDataSyncProgress')
              .then((res) => {
                this.progress = res.progress
                if (this.progress === 100) {
                  this.$emit('dataSyncCompletion')
                }
              })
          }, 3 * 1000)
        })
        .catch(() => {
          this.closeDialog()
        })
    }
  }
}
</script>

<style lang="scss" scoped>
.dialog {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  &__inner-box{
    text-align: left;
  }

  &__title {
    margin-bottom: 16px;
    font-size: 18px;
    line-height: 22px;
    text-align: left;
  }

  &__description {
    margin-bottom: 48px;
    font-size: 14px;
    line-height: 18px;
  }

  &__button-block {
    display: flex;
    justify-content: flex-end;

    .btn-cancel {
      margin-right: 12px;
      cursor: pointer;

      &:hover {
        opacity: 0.8;
      }
    }
  }

  .dataSync {
    text-align: center;

    &__spinner {
      margin-bottom: 18px;
      color: var(--color-theme)
    }

    &__title {
      margin-bottom: 24px;
      font-size: 18px;
      line-height: 22px;
      color: var(--color-theme)
    }

    &__btn {
      margin: 0 auto;
    }
  }

  .syncProcess {
    &__title {
      margin-bottom: 4px;
      font-size: 18px;
      line-height: 22px;
      text-align: center;
      color: var(--color-theme)
    }

    &__progress {
      font-size: 56px;
      line-height: 78px;
      color: var(--color-theme)
    }
  }
}
</style>

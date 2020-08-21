<template>
  <section class="dialog">
    <spinner
      size="48"
      theme-color
    />
    <div class="dialog__title">
      {{ $t('schedule.simulation.planSimulating') }}
    </div>
    <default-button
      type="outline"
      @click="cancelSimulation"
    >
      {{ $t('schedule.button.cancel') }}
    </default-button>
  </section>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: '',
  data () {
    return {
      timer: null
    }
  },
  computed: {
    ...mapState('simulation', ['planId', 'solutions', 'scheduledJobs']),
    ...mapState('scheduleSetting', ['defaultSetting'])
  },
  mounted () {
    // 重新模擬部分方案
    if (this.planId) {
      this.$store.dispatch('simulation/reSimulate')
        .then(({ solutions }) => {
          this.$store.commit('simulation/setSolutions', solutions.map(solution => ({ ...this.defaultSetting, ...solution, simulated: true, valid: null })))
          this.checkStatus()
        }).catch(() => {
          this.$emit('cancel')
        })
      return
    }

    // 建立新模擬計畫
    this.$store.dispatch('simulation/newPlan')
      .then(({ planId, solutions }) => {
        this.$store.commit('simulation/setPlanId', planId)
        this.$store.commit('simulation/setSolutions', solutions.map(solution => ({ ...this.defaultSetting, ...solution, simulated: true, valid: null })))
        this.checkStatus()
      }).catch(() => {
        this.$emit('cancel')
      })
  },
  destroyed () {
    clearInterval(this.timer)
  },
  methods: {
    checkStatus () {
      this.timer = setInterval(() => {
        this.$store.dispatch('simulation/checkSimulationProgress')
          .then(simulationFinished => {
            if (simulationFinished.status) {
              this.$store.commit('simulation/setSolutions', this.solutions.map(s => ({
                ...s,
                simulated: true
              })))
              this.$router.push({ name: 'SimulationResult' })
            }
          })
      }, 5 * 1000)
    },
    cancelSimulation () {
      this.$emit('cancel')
      this.$store.dispatch('simulation/cancelSimulationPlan')
        .then(() => {})
        .catch(() => {})
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
  &__title {
    margin-top: 24px;
    margin-bottom: 24px;
    font-size: 18px;
    line-height: 22px;
    color: var(--color-theme);
  }
}
</style>

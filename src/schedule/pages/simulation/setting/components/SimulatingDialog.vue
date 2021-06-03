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
import { mapState, mapGetters } from 'vuex'
import { Message } from 'element-ui'
import { adoptionSolution } from '@/schedule/API/Simulation'

export default {
  name: '',
  data () {
    return {
      timer: null
    }
  },
  computed: {
    ...mapState('simulation', ['planId', 'solutions', 'scheduledJobs']),
    ...mapState('scheduleSetting', ['defaultSetting']),
    ...mapGetters('scheduleSetting', ['isYKSchedule'])
  },
  mounted () {
    // 重新模擬部分方案
    if (this.planId) {
      this.$store.dispatch('simulation/reSimulate')
        .then(({ solutions }) => {
          this.$store.commit('simulation/setSolutions', solutions.map(solution => ({ ...this.defaultSetting, ...solution, simulated: true, valid: true })))
          this.checkStatus(this.planId)
        }).catch(() => {
          this.$emit('cancel')
        })
      return
    }

    // 建立新模擬計畫
    this.$store.dispatch('simulation/newPlan')
      .then(({ planId, solutions }) => {
        this.$store.commit('simulation/setPlanId', planId)
        this.$store.commit('simulation/setSolutions', solutions.map(solution => ({ ...this.defaultSetting, ...solution, simulated: true, valid: true })))
        this.checkStatus(planId)
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
          .then(simulationResult => {
            if (simulationResult.status) {
              this.$store.commit('simulation/setSimulationResult', simulationResult)

              // 全部方案失敗 -> 關掉跳窗回到模擬設定
              if (simulationResult.completedSolutionIds.length === 0) {
                this.simulateFail()
                return
              }

              // 部分方案失敗 -> 進到模擬結果並跳訊息告知
              if (simulationResult.failedSolutionIds.length > 0) {
                let failedSolutionSequences = ''
                simulationResult.failedSolutionIds.reverse().forEach(failedSolutionId => {
                  const failedSolution = this.solutions.find(item => item.solutionId === failedSolutionId)
                  failedSolutionSequences += failedSolution.sequence + ','
                })
                Message({
                  message: this.$t('schedule.simulation.plan') + failedSolutionSequences + this.$t('schedule.simulation.simulationFailed'),
                  type: 'warning',
                  duration: 3 * 1000
                })
              }

              this.$store.commit('simulation/setSolutions', this.solutions.reverse().map(s => ({
                ...s,
                simulated: true
              })))

              if (this.isYKSchedule) {
                adoptionSolution(planId, simulationResult.completedSolutionIds[0])
                .then(() => {
                  this.$store.commit('simulation/setPlanId', null)
                  this.$store.commit('simulation/setSolutions', [])
                  this.$store.commit('simulation/updateScheduledJobs', [])
                  this.$router.push({ name: 'CurrentSimulation' })
                }).catch(() => {
                  this.simulateFail()
                })
              } else {
                this.$router.push({ name: 'SimulationResult' })
              }
            }
          }).catch(() => {
            this.simulateFail()
          })
      }, 5 * 1000)
    },
    cancelSimulation () {
      this.$store.commit('simulation/setSolutions', this.solutions.map(solution => ({ ...solution, simulated: false })))
      this.$emit('cancel')
      this.$store.dispatch('simulation/cancelSimulationPlan')
        .then(() => {})
        .catch(() => {})
    },
    simulateFail () {
      Message({
        message: this.$t('schedule.simulation.simulationFailed'),
        type: 'warning',
        duration: 3 * 1000,
        showClose: true
      })
      this.$store.commit('simulation/setPlanId', null)
      this.$emit('cancel')
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

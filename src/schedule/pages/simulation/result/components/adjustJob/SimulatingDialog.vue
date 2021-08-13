<template>
  <simulating-spinner
    :progress="progress"
    @cancel="cancelSimulation"
  />
</template>

<script>
import { newChildSimulation, checkChildSimulationProgress, cancelChildSimulation } from '@/schedule/API/Simulation'
import SimulatingSpinner from '../../../components/SimulatingSpinner'
import { SIMULATION_RESULT } from '@/schedule/utils/enum'
import { mapState } from 'vuex'

export default {
  name: 'SimulatingDialog',
  components: {
    SimulatingSpinner
  },
  props: {
    currentSolution: {
      type: Object,
      default: () => {}
    }
  },
  data () {
    return {
      childSequence: 0,
      childSolutionId: 0,
      timer: [],
      progress: 0
    }
  },
  computed: {
    ...mapState('jobAdjustments', ['adjustedJobs']),
    ...mapState('simulation', ['solutions'])
  },
  mounted () {
    this.formatChildSimulation()
  },
  destroyed () {
    this.clearTimer()
  },
  methods: {
    formatChildSimulation () {
      const parentSolution = this.solutions.find(s => s.solutionId === this.currentSolution.solutionId)
      if (!parentSolution) {
        this.$emit('cancel')
        return
      }

      // 子方案 sequence 規則說明：若母方案為 1，子方案則為 1.1
      const siblingSolutionCount = parentSolution.children ? parentSolution.children.length : 0
      this.childSequence = parentSolution.sequence + (siblingSolutionCount + 1) * 0.1

      const childrenData = {
        parentSolutionId: this.currentSolution.solutionId,
        sequence: this.childSequence,
        adjustments: Object.values(this.adjustedJobs).map(job => ({
          jobId: job.jobId,
          expectRuntimeStart: job.expectRuntimeStart,
          expectRuntimeEnd: job.expectRuntimeEnd,
          operations: Object.values(job.operations)
            .filter(operation => operation.frontendInfo.mutated)
            .map(operation => ({
              operationName: operation.operationName,
              operationOrder: operation.operationOrder,
              equipments: [operation.frontendInfo.selectedEquipment]
            }))
        }))
      }
      this.newChildSimulation(childrenData)
    },
    newChildSimulation (childrenData) {
      newChildSimulation(childrenData)
        .then(childSolutionId => {
          this.childSolutionId = childSolutionId
          this.checkStatus()
        })
        .catch(() => {
          this.$emit('cancel')
        })
        .finally(() => {})
    },
    checkStatus () {
      this.timer.push(
        setInterval(() => {
          checkChildSimulationProgress(this.childSolutionId)
            .then(result => {
              this.progress = result.progress
              switch (result.simulationStatus) {
                case SIMULATION_RESULT.FAILED:
                  this.setChildrenSolutionBySequence(SIMULATION_RESULT.FAILED)
                  this.$store.commit('simulation/setFailedSolutionIds', this.childSolutionId)
                  this.finish(SIMULATION_RESULT.FAILED)
                  break
                case SIMULATION_RESULT.COMPLETED:
                  this.setChildrenSolutionBySequence(SIMULATION_RESULT.COMPLETED)
                  this.finish(SIMULATION_RESULT.COMPLETED)
                  break
              }
            })
            .catch(() => {})
            .finally(() => {})
        }, 5 * 1000)
      )
    },
    cancelSimulation () {
      this.$emit('cancel')
      cancelChildSimulation(this.childSolutionId)
        .then(() => {})
        .catch(() => {})
    },
    clearTimer () {
      this.timer.forEach(item => clearInterval(item))
      this.timer = []
    },
    setChildrenSolutionBySequence (status) {
      this.$store.commit('simulation/setChildrenSolutionBySequence', {
        parentSequence: this.currentSolution.sequence,
        childData: {
          solutionId: this.childSolutionId,
          sequence: this.childSequence,
          status, // FAILED, COMPLETED
          isChild: true
        }
      })
    },
    finish (result) {
      this.clearTimer()
      this.$emit('finish', { result, childSequence: this.childSequence })
    }
  }
}
</script>

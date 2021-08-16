<template>
  <!-- Solution -->
  <div
    class="solution-card__group"
    @click="$emit('click-card', solution)"
  >
    <div
      :class="{
        'is-active': solution.sequence === currentSolutionSequence,
        'is-failed': solutionFailedJudger(solution.solutionId)
      }"
      class="solution-card"
    >
      <div class="solution__title">
        <div
          v-if="showValidStatus"
          class="solution__valid-status"
        >
          <i
            v-if="solution.valid"
            class="success-icon el-icon-success"
          />
          <i
            v-else
            class="error-icon el-icon-error"
          />
        </div>
        {{ $t('schedule.simulation.plan') + displayedSequence }}
      </div>
      <div
        v-if="showSimulationStatus"
        :key="solution.simulated"
        class="solution__simulated-status"
      >
        <span
          v-if="solutionFailedJudger(solution.solutionId)"
          class="solution__result--failed"
        >
          {{ $t('schedule.simulation.simulationFailed') }}
        </span>
        <span v-else>
          {{ solution.simulated ? $t('schedule.simulation.simulated') : $t('schedule.simulation.notYetSimulated') }}
        </span>
      </div>
      <i
        v-if="showRemoveIcon"
        class="icon-remove el-icon-delete"
        @click="$emit('remove')"
      />
    </div>
    <!-- Nested Child Solution -->
    <template v-if="solution.children && solution.children.length > 0">
      <solution-card
        v-for="childSolution in solution.children"
        :key="childSolution.solutionId"
        :solution="childSolution"
        :current-solution-sequence="currentSolutionSequence"
        :solution-failed-judger="solutionFailedJudger"
        @click.native.stop="$emit('click-card', childSolution)"
      />
    </template>
  </div>
</template>

<script>

export default {
  name: 'SolutionCard',
  props: {
    solution: {
      type: Object,
      default: () => {},
      required: true
    },
    currentSolutionSequence: {
      type: Number,
      default: null
    },
    solutionFailedJudger: {
      type: Function,
      default: () => false
    },
    showSimulationStatus: {
      type: Boolean,
      default: false
    },
    showValidStatus: {
      type: Boolean,
      default: false
    },
    showRemoveIcon: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    displayedSequence () {
      return ` ${this.solution.sequence.toString().replace('.', '-')}`
    }
  }
}
</script>

<style lang="scss" scoped>

</style>

<template>
  <div class="page page--simulation">
    <div class="page__side-nav">
      <div class="step step--choose-job">
        <div class="step__title">
          STEP.1 {{ $t('schedule.simulation.selectJobs', {job: isYKSchedule ? $t('schedule.simulation.order') : $t('schedule.simulation.job')}) }}
        </div>
        <div class="step__content">
          <spinner
            v-if="isFetchingSelectedOrders"
            size="30"
          />
          <div
            v-else
            class="selected-jobs__info"
            @click="onClickSelectJobStep"
          >
            {{ displaySelectedJobCounter }}
          </div>
        </div>
      </div>
      <div class="step step--choose-solution">
        <div class="step__title">
          STEP.2 {{ $t('schedule.simulation.solutionSetting') }}
          <default-button
            v-show="!(isYKSchedule && solutions.length > 0)"
            class="add-btn"
            type="outline"
            @click="onClickAddSolution"
          >
            <i class="el-icon-plus" />
            {{ $t('schedule.simulation.addSolution') }}
          </default-button>
        </div>
        <div class="step__content">
          <solution-card
            v-for="(solution, index) in solutions"
            :key="solution.sequence"
            :solution="solution"
            :solution-failed-judger="isSolutionFailed"
            :current-solution-sequence="editSolutionSequence"
            show-simulation-status
            show-valid-status
            show-remove-icon
            @click-card="editSolution"
            @remove="onClickRemoveSolution(index, solution.solutionId)"
          />
        </div>
      </div>
      <div class="step step--start-simulate">
        <default-button
          :disabled="(scheduledJobs.length === 0 && !selectAllOrders && isYKSchedule) || selectedJobCount === 0 || solutions.length === 0 || hasInvalidSolution || !allowSimulation"
          :show-spinner="isSimulatingDialogOpen"
          @click="startSimulation"
        >
          {{ $t('schedule.simulation.startSimulation') }}
        </default-button>
      </div>
    </div>
    <div
      v-show="editSolutionSequence"
      class="page__main"
    >
      <!-- <spinner
        v-show="renderingSetting"
        size="50"
        class="page__spinner"
      /> -->
      <default-setting
        :key="editSolutionSequence"
        :solution-sequence="editSolutionSequence"
      />
    </div>
    <div
      v-show="!editSolutionSequence"
      class="page__main"
    >
      <h2 class="header__title">
        {{ $t('schedule.simulation.title') }}
        <default-button
          v-if="!isYKSchedule"
          :is-disabled="isProcessingProductionProgress"
          type="secondary"
          @click="syncProductionProgress"
        >
          {{ $t('schedule.rolling.syncProductionProgress') }}
        </default-button>
      </h2>
      <plan-simulation />
    </div>
    <simulating-dialog
      v-if="isSimulatingDialogOpen"
      @cancel="cancelSimulation"
    />
    <decide-dialog
      v-if="isShowChangeAlert"
      :title="$t('schedule.simulation.changeAlert')"
      :content="$t('schedule.simulation.changeAlertContent')"
      :type="'showCancel'"
      :btn-text="$t('schedule.button.confirm')"
      @closeDialog="isShowChangeAlert = false"
      @confirmBtn="onConfirmResetScheduledJobs"
    />
  </div>
</template>
<script>
import DecideDialog from '@/schedule/components/dialog/DecideDialog'
import DefaultSetting from '../../scheduleSetting/BaseSetting'
import PlanSimulation from './components/PlanSimulation'
import SimulatingDialog from './components/SimulatingDialog'
import SolutionCard from '../components/SolutionCard'
import { fetchDataBoundStatus } from '@/schedule/API/Project'
import { getJobList } from '@/schedule/API/Job'
import { mapState, mapMutations, mapGetters } from 'vuex'
import { validateSimulationSetting } from '@/schedule/utils/mixins'
import { Message } from 'element-ui'
import moment from 'moment'

export default {
  name: 'SimulationSetting',
  components: {
    DefaultSetting,
    DecideDialog,
    PlanSimulation,
    SimulatingDialog,
    SolutionCard
  },
  data () {
    return {
      isFetchingSelectedOrders: false,
      isShowChangeAlert: false,
      isProcessingProductionProgress: false,
      allowSimulation: false,
      editSolutionSequence: null,
      renderingSetting: false,
      solutionSerialNumber: 0,
      isSimulatingDialogOpen: false,
      selectedJobCount: 0
    }
  },
  computed: {
    ...mapState('scheduleSetting', ['defaultSetting', 'scheduleProjectId']),
    ...mapState('simulation', ['solutions', 'planId', 'scheduledJobs', 'selectAllOrders', 'searchOrderCount', 'simulationJobs', 'shouldRecalculateSelectedJobs']),
    ...mapGetters('scheduleSetting', ['isYKSchedule']),
    displaySelectedJobCounter () {
      if (this.isYKSchedule) {
        if (this.selectAllOrders) {
          return this.$t('schedule.simulation.selectedJobsCount', { count: this.searchOrderCount, job: this.isYKSchedule ? this.$t('schedule.simulation.order') : this.$t('schedule.simulation.job') })
        } else if (this.scheduledJobs.length > 0) {
          return this.$t('schedule.simulation.selectedJobsCount', { count: this.scheduledJobs.length, job: this.isYKSchedule ? this.$t('schedule.simulation.order') : this.$t('schedule.simulation.job') })
        } else {
          return this.$t('schedule.simulation.noSelectedJobs', { job: this.isYKSchedule ? this.$t('schedule.simulation.order') : this.$t('schedule.simulation.job') })
        }
      }
      return this.selectedJobCount > 0
        ? this.$t('schedule.simulation.selectedJobsCount', { count: this.selectedJobCount, job: this.$t('schedule.simulation.job') })
        : this.$t('schedule.simulation.noSelectedJobs', { job: this.$t('schedule.simulation.job') })
    },
    hasInvalidSolution () {
      return this.solutions.some(s => !s.valid)
    }
  },
  watch: {
    shouldRecalculateSelectedJobs (should) {
      if (!should) return
      this.selectedJobCount = Object.values(this.simulationJobs).filter(job => job.frontendInfo.checked).length
      this.$store.commit('simulation/setShouldRecalculateSelectedJobs', false)
    }
  },
  mounted () {
    this.initSelectedJobCount()
    this.fetchDataBoundStatus()
    this.solutions.forEach(s => {
      if (s.sequence > this.solutionSerialNumber) this.solutionSerialNumber = s.sequence
      // 返回設定or重新模擬時，先做一次表單檢查以初始化 valid 狀態
      s.valid = validateSimulationSetting(s)
    })
    this.editSolutionSequence = this.solutionSerialNumber
  },
  methods: {
    ...mapMutations('simulation', ['addSolution', 'removeSolution']),
    initSelectedJobCount () {
      if (Object.values(this.simulationJobs).length > 0) {
        this.selectedJobCount = Object.values(this.simulationJobs).filter(job => job.frontendInfo.checked).length
        return
      }
      // 呈現已選擇工單數量
      this.isFetchingSelectedOrders = true
      getJobList({ projectId: this.scheduleProjectId, scheduled: true })
        .then(({ data }) => {
          const scheduledJobs = data
            .map(job => ({
              ...job,
              frontendInfo: { checked: job.scheduled }
            }))
          this.selectedJobCount = scheduledJobs.length
          this.$store.commit('simulation/setSimulationJobs', scheduledJobs)
        })
        .catch(() => {})
        .finally(() => {
          this.isFetchingSelectedOrders = false
        })
    },
    fetchDataBoundStatus () {
      fetchDataBoundStatus(this.scheduleProjectId)
        .then(dataframes => {
          // 確定訂單、共同資料都已經綁定，不然不能進行模擬
          this.allowSimulation = dataframes
            .filter(item => item.category === 'ORDER' || item.category === 'RAW_DATA')
            .every(item => item.dataframeStatus === 'BOUND')
          if (!this.allowSimulation) {
            Message({
              message: this.$t('schedule.simulation.notAllowedSimulation'),
              type: 'warning',
              duration: 3 * 1000,
              showClose: true
            })
          }
        })
    },
    isSolutionFocus (id) {
      return this.editSolutionSequence === id
    },
    onClickSelectJobStep () {
      if (this.planId) {
        this.isShowChangeAlert = true
      } else {
        this.editSolutionSequence = null
      }
    },
    onConfirmResetScheduledJobs () {
      this.$store.commit('simulation/setPlanId', null)
      this.$store.commit('simulation/setSolutions', this.solutions.map(solution => ({ ...solution, simulated: false })))
      this.editSolutionSequence = null
      this.isShowChangeAlert = false
    },
    onClickAddSolution () {
      this.solutionSerialNumber += 1
      this.editSolutionSequence = this.solutionSerialNumber

      this.addSolution({
        ...JSON.parse(JSON.stringify(this.defaultSetting)),
        solutionId: null,
        sequence: this.solutionSerialNumber,
        scheduleStartDate: moment().startOf('day').add(1, 'day').format('YYYY/MM/DD'),
        simulated: false,
        overtimes: [],
        leavetimes: [],
        valid: true
      })
    },
    async onClickRemoveSolution (index, solutionId) {
      // 若為已經模擬過的方案，也要告訴後端把它刪掉
      if (this.planId && solutionId) {
        await this.$store.dispatch('simulation/deleteSimulatedSolution', solutionId)
      }

      // 若刪除自己，預設 focus 到第一個方案
      const isRemoveSelf = this.editSolutionSequence === this.solutions[index].sequence
      if (isRemoveSelf) {
        this.removeSolution(index)
        this.editSolutionSequence = this.solutions.length > 0 ? this.solutions[0].solutionId : null
      } else {
        this.removeSolution(index)
      }
      Message({
        message: this.$t('schedule.successMessage.solutionDeleted'),
        type: 'success',
        duration: 3 * 1000,
        showClose: true
      })
    },
    editSolution (solution) {
      this.editSolutionSequence = solution.sequence
      // this.renderingSetting = true
      // setTimeout(() => {
      //   this.renderingSetting = false
      // }, 0)
    },
    startSimulation () {
      this.isSimulatingDialogOpen = true
    },
    cancelSimulation () {
      this.isSimulatingDialogOpen = false
    },
    isSolutionFailed (solutionId) {
      return this.$store.state.simulation.simulationResult.failedSolutionIds.includes(solutionId)
    },
    syncProductionProgress () {
      this.isProcessingProductionProgress = true
      this.$store.dispatch('scheduleSetting/syncProductionProgress')
        .then(() => {
          Message({
            message: '生產狀況同步成功',
            type: 'success',
            duration: 3 * 1000,
            showClose: true
          })
        })
        .catch(() => {})
        .finally(() => {
          this.isProcessingProductionProgress = false
        })
    }
  }
}
</script>

<style lang="scss" scoped>
.page {
  &--simulation {
    display: flex;
    height: 100%;
  }
  ::v-deep &.page--setting {
    height: 100%;
    padding: 0;
    overflow: auto;
  }
  &__side-nav {
    display: flex;
    flex-direction: column;
    flex-basis: 267px;
  }
  &__main {
    flex: 1;
    width: 0;
    border-left: 1px solid var(--color-border);
    overflow: auto;
    overflow: overlay;
    display: flex;
    flex-direction: column;

    .header__title {
      display: flex;
      justify-content: space-between;
      font-size: 24px;
      line-height: 32px;
      padding: 24px 24px 0 24px;
      margin-bottom: 0;
      margin-top: 0;
    }
  }
  &__spinner {
    margin-top: 30vh;
  }
}

.step {
  .step__title {
    font-size: 14px;
  }
  .step__content {
    margin-top: 12px;
  }
  &--choose-job {
    padding: 24px;
    .step__content {
      text-indent: 16px;
      .selected-jobs__info {
        height: 52px;
        display: flex;
        align-items: center;
        font-size: 14px;
        border-radius: 10px;
        cursor: pointer;
        background-color: var(--color-bg-gray);
      }
    }
  }
  &--choose-solution {
    flex: 1;
    height: 0;
    display: flex;
    flex-direction: column;
    padding: 24px 24px 0 24px;
    .step__title {
      margin-bottom: 8px;
      .add-btn {
        width: 100%;
        margin-top: 12px;
        border-radius: 6px;
      }
    }
    .step__content {
      flex: 1;
      overflow-y: overlay;
      .solution {
        &__checked {
          position: absolute;
          left: 16px;
          top: 14px;
        }
        &__status {
          font-size: 14px;
          color: var(--color-text-gray);
        }
      }
    }
  }
  &--start-simulate {
    background-color: rgba(35, 61, 64, 0.6);
    .default-button {
      width: 100%;
      height: 48px;
      border-radius: 0;
    }
  }
}
</style>

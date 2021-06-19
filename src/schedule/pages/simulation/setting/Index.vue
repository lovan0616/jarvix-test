<template>
  <div class="page page--simulation">
    <div class="page__side-nav">
      <div class="step step--choose-job">
        <div class="step__title">
          STEP.1 {{ $t('schedule.simulation.selectJobs') }}
        </div>
        <div class="step__content">
          <div
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
          <div
            v-for="(solution, index) in solutions"
            :key="solution.sequence"
            :class="{'is-active': editSolutionSequence === solution.sequence}"
            class="solution card-like"
            @click="editSolution(solution.sequence)"
          >
            <div class="solution__title">
              <div class="solution__valid-status">
                <i
                  v-if="solution.valid"
                  class="success-icon el-icon-success"
                />
                <i
                  v-else
                  class="error-icon el-icon-error"
                />
              </div>
              {{ $t('schedule.simulation.solution') + solution.sequence }}
            </div>
            <div
              :key="solution.simulated"
              class="solution__simulated-status"
            >
              <span v-if="isSolutionFailed(solution.solutionId)">
                {{ $t('schedule.simulation.simulationFailed') }}
              </span>
              <span v-else>
                {{ solution.simulated ? $t('schedule.simulation.simulated') : $t('schedule.simulation.notYetSimulated') }}
              </span>
            </div>
            <i
              class="icon-remove el-icon-delete"
              @click.stop="onClickRemoveSolution(index, solution.solutionId)"
            />
          </div>
        </div>
      </div>
      <div class="step step--start-simulate">
        <default-button
          :disabled="(scheduledJobs.length === 0 && !selectAllOrders) || solutions.length === 0 || hasInvalidSolution || !allowSimulation"
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
        v-show="editSolutionSequence"
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
import DefaultSetting from '../../scheduleSetting/Index'
import PlanSimulation from './components/PlanSimulation'
import SimulatingDialog from './components/SimulatingDialog'
import moment from 'moment'
import { fetchDataBoundStatus } from '@/schedule/API/Project'
import { mapState, mapMutations, mapGetters } from 'vuex'
import { validateSimulationSetting } from '@/schedule/utils/mixins'
import { Message } from 'element-ui'

export default {
  name: 'SimulationSetting',
  components: {
    DefaultSetting,
    DecideDialog,
    PlanSimulation,
    SimulatingDialog
  },
  data () {
    return {
      allowSimulation: false,
      editSolutionSequence: null,
      isShowChangeAlert: false,
      renderingSetting: false,
      solutionSerialNumber: 0,
      isSimulatingDialogOpen: false,
      isJobReSelected: false
    }
  },
  computed: {
    ...mapState('scheduleSetting', ['defaultSetting', 'scheduleProjectId']),
    ...mapState('simulation', ['solutions', 'scheduledJobs', 'planId', 'selectAllOrders', 'searchOrderCount']),
    ...mapGetters('scheduleSetting', ['isYKSchedule']),
    displaySelectedJobCounter () {
      if (this.selectAllOrders)  {
        return this.$t('schedule.simulation.selectedJobsCount', { count: this.searchOrderCount })
      } else if (this.scheduledJobs.length > 0) {
        return this.$t('schedule.simulation.selectedJobsCount', { count: this.scheduledJobs.length })
      } else {
        return this.$t('schedule.simulation.noSelectedJobs')
      }
    },
    hasInvalidSolution () {
      return this.solutions.some(s => !s.valid)
    }
  },
  mounted () {
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
    editSolution (solutionSequence) {
      this.editSolutionSequence = solutionSequence
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
  /deep/ &.page--setting {
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
    padding: 25px;
    border-left: 1px solid var(--color-border);
    overflow: auto;
    display: flex;
    flex-direction: column;

    .header__title {
      font-size: 24px;
      line-height: 32px;
      margin-top: 0;
      margin-bottom: 20px;
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
    padding: 24px;
    background-color: rgba(35, 61, 64, 0.6);
    .default-button {
      width: 100%;
    }
  }
}
</style>

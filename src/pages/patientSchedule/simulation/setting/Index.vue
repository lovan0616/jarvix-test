<template>
  <div class="page page--simulation">
    <div class="page__side-nav">
      <div class="step step--choose-job">
        <div class="step__title">
          STEP.1 New Surgeries
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
          STEP.2 Simulation Setting
          <default-button
            class="add-btn"
            type="outline"
            @click="onClickAddSolution"
          >
            <i class="el-icon-plus" />
            Add Simulation
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
              Scenario {{ solution.sequence }}
            </div>
            <div
              :key="solution.simulated"
              class="solution__simulated-status"
            >
              <span v-if="isSolutionFailed(solution.solutionId)">
                Simulation Failed
              </span>
              <span v-else>
                {{ solution.simulated ? 'Simulated' : 'Unsimulated' }}
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
          :disabled="scheduledJobs.length === 0 || solutions.length === 0"
          :show-spinner="isSimulatingDialogOpen"
          @click="startSimulation"
        >
          Start Simulation
        </default-button>
      </div>
    </div>
    <div
      v-show="editSolutionSequence"
      class="page__main"
    >
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
        Scheduling Surgery Simulation
      </h2>
      <plan-simulation
        :has-emergency="hasEmergency"
        @insert="insert"
      />
    </div>
    <simulating-dialog
      v-if="isSimulatingDialogOpen"
      :is-inserted="isInserted"
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
import { mapState, mapMutations } from 'vuex'
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
  props: {
    hasEmergency: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      isInserted: false,
      editSolutionSequence: null,
      isShowChangeAlert: false,
      renderingSetting: false,
      solutionSerialNumber: 0,
      isSimulatingDialogOpen: false,
      isJobReSelected: false
    }
  },
  computed: {
    ...mapState('scheduleSetting', ['defaultSetting']),
    ...mapState('simulation', ['solutions', 'scheduledJobs', 'planId']),
    displaySelectedJobCounter () {
      return this.scheduledJobs.length > 0
        ? `${this.scheduledJobs.length} Surgeries Selected`
        : 'No Surgery Selected'
    },
    hasInvalidSolution () {
      return this.solutions.some(s => !s.valid)
    }
  },
  mounted () {
    this.solutions.forEach(s => {
      if (s.sequence > this.solutionSerialNumber) this.solutionSerialNumber = s.sequence
      // 返回設定or重新模擬時，先做一次表單檢查以初始化 valid 狀態
      s.valid = validateSimulationSetting(s)
    })
    this.editSolutionSequence = this.solutionSerialNumber
  },
  methods: {
    ...mapMutations('simulation', ['addSolution', 'removeSolution']),
    insert () {
      this.isInserted = true
      this.$emit('insert')
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
        solutionId: this.solutionSerialNumber,
        sequence: this.solutionSerialNumber,
        scheduleStartDate: moment().startOf('day').add(1, 'day').format('YYYY/MM/DD'),
        kpiSetting: {
          capacity: 3,
          cycleTime: 1,
          ofr: 2,
          utilization: 4
        },
        scheduleDays: 14,
        worktimes: {
          weekday1: [
            { startTime: '08:00', endTime: '10:30' },
            { startTime: '10:30', endTime: '12:00' },
            { startTime: '13:00', endTime: '15:30' },
            { startTime: '16:00', endTime: '18:00' }
          ],
          weekday2: [
            { startTime: '08:00', endTime: '10:30' },
            { startTime: '10:30', endTime: '12:00' },
            { startTime: '13:00', endTime: '15:30' },
            { startTime: '16:00', endTime: '18:00' }
          ],
          weekday3: [
            { startTime: '08:00', endTime: '10:30' },
            { startTime: '10:30', endTime: '12:00' },
            { startTime: '13:00', endTime: '15:30' },
            { startTime: '16:00', endTime: '18:00' }
          ],
          weekday4: [
            { startTime: '08:00', endTime: '10:30' },
            { startTime: '10:30', endTime: '12:00' },
            { startTime: '13:00', endTime: '15:30' },
            { startTime: '16:00', endTime: '18:00' }
          ],
          weekday5: [
            { startTime: '08:00', endTime: '10:30' },
            { startTime: '10:30', endTime: '12:00' },
            { startTime: '13:00', endTime: '15:30' },
            { startTime: '16:00', endTime: '18:00' }
          ],
          weekday6: [
            { startTime: '08:00', endTime: '10:30' },
            { startTime: '10:30', endTime: '12:00' },
            { startTime: '13:00', endTime: '15:30' },
            { startTime: '16:00', endTime: '18:00' }
          ],
          weekday7: [
            { startTime: '08:00', endTime: '10:30' },
            { startTime: '10:30', endTime: '12:00' },
            { startTime: '13:00', endTime: '15:30' },
            { startTime: '16:00', endTime: '18:00' }
          ]
        },
        simulated: false,
        overtimes: [],
        leavetimes: [],
        valid: true,
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

    .header__title {
      font-size: 24px;
      line-height: 32px;
      margin-top: 0;
      margin-bottom: 20px;
      user-select: none;
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

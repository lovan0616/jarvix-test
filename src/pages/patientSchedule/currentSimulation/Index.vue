
<template>
  <div class="current-simulation">
    <h2 class="header">
      Current Scheduling Plan
    </h2>
    <default-button
      v-if="planned"
      class="simulate-btn"
      @click="$router.push({ name: 'DemoOTSimulationSetting' })"
    >
      Resimulation
    </default-button>
    <div
      v-if="planned"
      class="simulation-content"
    >
      <div class="plan-KPI KPI">
        <h3 class="KPI__title">
          {{ isOt ? 'OT' : 'Bed' }} Room Scheduling
        </h3>
        <div class="KPI__info">
          <span class="KPI__info--item">
            Scheduling Time Range: 2021/3/1-2021/2/31
          </span>
          <span class="KPI__info--item">
            Total Surgeroy: 128
          </span>
          <span class="KPI__info--item">
            Utilization Rate: 90%
          </span>
          <span class="KPI__info--item">
            Total turnover time: 3.27h
          </span>
        </div>
      </div>
      <plan-job />
      <plan-gantt />
    </div>
    <div
      v-else
      class="empty-block"
    >
      <img
        class="empty-block__icon"
        src="@/schedule/icons/empty.svg"
      >
      <span class="empty-block__text">No Scheduling Plan</span>
      <default-button
        class="empty-block__btn"
        @click="$router.push({ name: 'DemoOTSimulationSetting' })"
      >
        Start Simulation Planning
      </default-button>
    </div>
  </div>
</template>

<script>
import PlanJob from './components/PlanJob'
import PlanGantt from './components/PlanGantt'

export default {
  name: 'CurrentSimulation',
  components: {
    PlanJob,
    PlanGantt
  },
  props: {
    isOt: {
      type: Boolean,
      default: true
    }
  },
  data () {
    return {
    }
  },
  computed: {
    planned () {
      return this.$route.query.planned
    }
  }
}
</script>

<style lang="scss" scoped>
.current-simulation {
  position: relative;
  padding: 24px;

  .header {
    display: inline-block;
    margin: 0 0 12px 0;
  }

  .simulate-btn {
    position: absolute;
    top: 24px;
    right: 24px;
  }

  .KPI {
    position: relative;
    padding: 0px 14px;
    margin-bottom: 24px;
    display: flex;
    flex-direction: row;
    align-items: center;

    &__title {
      font-size: 18px;
      line-height: 22px;
      margin: 0 30px 0 0;

      &:before {
        content: "";
        position: absolute;
        left: 0%;
        top: 37.5%;
        width: 6px;
        height: 6px;
        background: #2AD2E2;
      }
    }

    &__info {
      font-size: 14px;
      line-height: 18px;
      margin-right: 24px;
      color: var(--color-text-light);

      &--item {
        &:not(:last-child) {
          margin-right: 24px;
        }
      }

    }
  }

  .empty-block {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 249px;
    background: var(--color-bg-gray);
    border-radius: 8px;

    &__icon {
      margin-bottom: 16px;
    }

    &__text {
      font-size: 16px;
      line-height: 20px;
      color: var(--color-text-gray);
      margin-bottom: 16px;
    }

    &__btn {
      width: 260px;
    }
  }
}
</style>

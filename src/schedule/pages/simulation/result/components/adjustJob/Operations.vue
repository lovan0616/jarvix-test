<template>
  <ul class="operation-list">
    <li class="operation-list__header">
      <div class="operation-list__item operation-order">
        {{ $t('schedule.simulation.adjustJob.operationOrder') }}
      </div>
      <div class="operation-list__item operation-name">
        {{ $t('schedule.simulation.adjustJob.operationName') }}
      </div>
      <div class="operation-list__item assignedEquipments">
        {{ $t('schedule.simulation.adjustJob.assignedEquipment') }}
      </div>
      <div class="operation-list__item availableEquipments">
        {{ $t('schedule.simulation.adjustJob.selectedEquipment') }}
      </div>
    </li>
    <li
      v-for="(operation, key) in operations"
      :key="key"
      class="operation-list__body"
    >
      <div class="operation-list__item operation-order">
        {{ operation.operationOrder }}
      </div>
      <div class="operation-list__item operation-name">
        {{ operation.operationName }}
      </div>
      <div class="operation-list__item assignedEquipments">
        {{ operation.assignedEquipments || '-' }}
      </div>
      <div
        :class="{ 'is-mutated': operation.frontendInfo.mutated }"
        class="operation-list__item availableEquipments"
      >
        <default-select
          :options="getAvailableEquipmentsOptions(operation.availableEquipments)"
          :value="operations[operation.operationOrder].frontendInfo.selectedEquipment"
          :disabled="isViewMode"
          class="equipment-select"
          @input="onSelectEquipment(operation.operationOrder, $event)"
        />
      </div>
    </li>
  </ul>
</template>

<script>
export default {
  name: 'Operations',
  props: {
    operations: {
      type: Object,
      default: () => {}
    },
    isViewMode: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    onSelectEquipment (operationOrder, selectedEquipment) {
      this.operations[operationOrder].frontendInfo = {
        selectedEquipment,
        mutated: this.operations[operationOrder].assignedEquipments !== selectedEquipment
      }
      this.$emit('change', this.operations)
    },
    getAvailableEquipmentsOptions (equipments) {
      return equipments.map(e => ({ value: e, label: e }))
    }
  }
}
</script>

<style lang="scss" scoped>
.operation {
  &-list {
    width: 100%;
    font-size: 14px;
    list-style: none;
    padding-left: 0;
    margin: 0;
    max-height: 50vh;
    background: rgba(67, 76, 76, 0.95);
    border-radius: 8px;
    overflow: auto;
    overflow: overlay;
    padding-right: 20px;
    &__header {
      margin-bottom: 18px;
    }
    &__body {
      &:not(:last-child) {
        margin-bottom: 18px;
      }
    }
    &__header, &__body {
      display: flex;
      align-items: center;
      gap: 12px;
    }
    &__item {
      flex: 1;
      &.operation-order {
        flex: 0 0 100px;
        @include text-hidden;
      }
      &.operation-name {
        @include text-hidden;
      }
      &.assignedEquipments {
        @include text-hidden;
      }
      &.availableEquipments {
        position: relative;
        .equipment-select {
          padding-bottom: 0;
        }
        &.is-mutated {
          &:before {
            @include mutated-dot;
          }
          .equipment-select {
            padding-bottom: 0;
            v::deep .el-input__inner {
              padding-left: 4px;
            }
          }
        }
      }
    }
    .empty-info-block {
      background-color: transparent;
    }
  }
}
</style>

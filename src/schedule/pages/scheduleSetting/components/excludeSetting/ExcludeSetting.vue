<template>
  <div class="excluded-setting">
    <el-collapse v-model="activeCollapseItems">
      <el-collapse-item
        v-for="(equipment, equipmentIndex) in excludedEquipment"
        :key="`${equipmentIndex}-${equipment.reasons.length}`"
        :title="equipment.equipmentName"
        :name="equipment.equipmentId"
      >
        <template slot="title">
          <span class="single-machine__label">{{ $t('schedule.setting.excludedMachine') }}</span>
          <default-select
            v-model="equipment.equipmentId"
            :options="equipments"
            filterable
          />
        </template>
        <single-excluded-machine
          v-for="(reason, reasonIndex) in equipment.reasons"
          :key="reasonIndex"
          :exclude-reason="reason"
          :deletable="equipment.reasons.length > 1"
          @delete="deleteSetting(equipmentIndex, reasonIndex)"
        />
        <div class="excluded-setting__footer">
          <default-button
            type="secondary"
            @click="addExcludedPeriod(equipmentIndex)"
          >
            <i class="el-icon-plus" />
            {{ $t('schedule.setting.addExcludedPeriod') }}
          </default-button>
          <label
            class="excluded-setting__remove-box"
            @click="deleteEquipment(equipmentIndex)"
          >
            {{ $t('schedule.setting.deleteEquipment') }}
            <i class="el-icon-delete" />
          </label>
        </div>
      </el-collapse-item>
    </el-collapse>
    <default-button
      type="secondary"
      class="save-btn"
      @click="addEquipment"
    >
      <i class="el-icon-plus" />
      {{ $t('schedule.setting.addEquipment') }}
    </default-button>
  </div>
</template>

<script>
import SingleExcludedMachine from './SingleExcludedMachine'
import moment from 'moment'

export default {
  name: 'ExcludeSetting',
  components: {
    SingleExcludedMachine
  },
  props: {
    excludedEquipment: {
      type: Array,
      default: () => []
    },
    equipments: {
      type: Array,
      default: () => []
    },
    collapseAll: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      activeCollapseItems: [],
      defaultExcludedVal: {
        reason: 'repairing',
        startDatetime: moment().startOf('day').format('YYYY/MM/DD HH:mm'),
        endDatetime: moment().startOf('day').format('YYYY/MM/DD HH:mm')
      }
    }
  },
  computed: {
    selectedEquipments () {
      return this.excludedEquipment.map(e => e.equipmentId)
    }
  },
  watch: {
    collapseAll: {
      immediate: true,
      handler (value) {
        this.activeCollapseItems = value ? [] : this.selectedEquipments
      }
    }
  },
  methods: {
    deleteSetting (equipmentIndex, reasonIndex) {
      this.excludedEquipment[equipmentIndex].reasons.splice(reasonIndex, 1)
    },
    addExcludedPeriod (equipmentIndex) {
      this.excludedEquipment[equipmentIndex].reasons.push({ ...this.defaultExcludedVal })
    },
    addEquipment () {
      this.excludedEquipment.push({
        equipmentId: null,
        equipmentName: null,
        reasons: [{ ...this.defaultExcludedVal }]
      })
    },
    deleteEquipment (equipmentIndex) {
      this.excludedEquipment.splice(equipmentIndex, 1)
    }
  }
}
</script>

<style lang="scss" scoped>
.excluded-setting {
  width: 100%;
  /deep/ .el-collapse-item__content {
    margin-top: 8px;
  }
  &__footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 16px;
    color: var(--color-text);
  }
  &__remove-box {
    cursor: pointer;
  }
}
/deep/ .single-machine {
  padding: 4px 8px;
  &:nth-child(even) {
    background-color: rgba(50, 75, 78, 0.6);
  }
  &:nth-child(odd) {
    background-color: rgba(35, 61, 64, 0.6);
  }
  &__label {
    margin-right: 16px;
  }
}
.save-btn {
  margin-top: 16px;
}
</style>
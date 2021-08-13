<template>
  <el-table-column
    :width="isShowCheckAllPageCheckbox ? 60 : 40"
    fixed="right"
  >
    <template slot="header">
      <label class="checkbox-label">
        <slot />
        <div class="checkbox-square" />
      </label>
      <el-tooltip :disabled="!isShowCheckAllPageCheckbox">
        <div
          slot="content"
          class="check-all-dropdown"
        >
          <label class="checkbox-label">
            <input
              v-model="innerCheckAllPage"
              type="checkbox"
            >
            <div class="checkbox-square" />
          </label>
          <span class="check-all-dropdown--label">
            {{ $t('schedule.base.allPageSelect') }}
          </span>
        </div>
        <svg-icon
          v-if="isShowCheckAllPageCheckbox"
          icon-class="dropdown"
          class="dropdown-icon"
        />
      </el-tooltip>
    </template>
    <template slot-scope="scope">
      <label class="checkbox-label">
        <input
          v-model="scope.row.frontendInfo.checked"
          type="checkbox"
          name="selectAll"
          @input="onChange($event, scope.row)"
        >
        <div class="checkbox-square" />
      </label>
    </template>
  </el-table-column>
</template>

<script>
export default {
  name: 'JobCheckColumn',
  props: {
    checkAllPage: {
      type: Boolean,
      default: false
    },
    isShowCheckAllPageCheckbox: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    innerCheckAllPage: {
      get () {
        return this.checkAllPage
      },
      set (v) {
        this.$emit('toggle-check-all-page', v)
      }
    }
  },
  methods: {
    onChange ({ target: { checked } }, job) {
      this.$store.commit('simulation/setSimulationJobs', [{
        ...job,
        frontendInfo: { checked }
      }])
      this.$store.commit('simulation/setShouldRecalculateSelectedJobs', true)
    }
  }
}
</script>

<style lang="scss" scoped>
.checkbox-label, .dropdown-icon {
  display: inline-block;
}
.dropdown-icon {
  width: 10px;
  cursor: pointer;
  margin-left: 8px;
}
.check-all-dropdown {
  display: flex;
  align-items: center;
  &--label {
    margin-left: 8px;
  }
}
</style>

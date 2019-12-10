<template>
  <el-tooltip placement="bottom-start"
    :popper-class="popperClass"
  >
    <div slot="content">
      <div class="tooltip-content-item"
        v-for="(restraint, index) in restriction"
        :key="index"
      >
        <template
          v-if="restraint.type === 'compound'"
        >
          {{ $t('resultDescription.restrict') + (index + 1) }}:
          <div
            v-for="(sub_restraint, restraintsIndex) in restraint.restraints"
            :key="'restraints-' + index + '-' + restraintsIndex"
          >
            {{ sub_restraint.properties.display_name }}{{ $t('resultDescription.between', {
              start: isNaN(sub_restraint.properties.start) ? sub_restraint.properties.start : roundNumber(sub_restraint.properties.start),
              end: isNaN(sub_restraint.properties.end) ? sub_restraint.properties.end : roundNumber(sub_restraint.properties.end)
            }) }}
            <span class="tooltip-content-item-condition"
              v-if="restraintsIndex < restraint.restraints.length - 1"
            >、</span>
          </div>
        </template>
        <template v-else>
          <div class="tooltip-content-item-title">
            {{ $t('resultDescription.restrict') + (index + 1) }}:
          </div>
          <div class="tooltip-content-item-description">
            <template v-if="restraint.type === 'enum'">
              {{restraint.properties['display_name']}} = {{restraint.properties['datavalues'].join(', ')}}
            </template>
            <template v-if="restraint.type === 'range'">
              {{restraint.properties['display_name']}} = {{ $t('resultDescription.between', {
                start: isNaN(restraint.properties.start) ? restraint.properties.start : roundNumber(restraint.properties.start),
                end: isNaN(restraint.properties.end) ? restraint.properties.end : roundNumber(restraint.properties.end)
              }) }}
            </template>
          </div>
        </template>
      </div>
    </div>
    <div :class="['single-filter-block', {checked: checked}]">
      <div class="column-name">{{columnNames.join(', ')}}</div>
      <label class="checkbox-label filer-checkbox">
        <input type="checkbox"
          v-model="checked"
          @change="onCheckedChange(checked)"
        >
        <div class="checkbox-square"></div>
      </label>
    </div>
  </el-tooltip>
</template>
<script>

export default {
  name: 'SingleFilterBlock',
  props: {
    status: { type: Boolean },
    restriction: { type: Array, default: () => [] }
  },
  data () {
    return {
      checked: this.status
    }
  },
  watch: {
    status (status) {
      this.checked = status
    }
  },
  computed: {
    columnNames () {
      return this.restriction.reduce((result, curr) => {
        if (curr.restraints) {
          curr.restraints.forEach(restraint => {
            const name = this.getRestraintColumnName(restraint)
            if (name !== undefined) result.push(name)
          })
        } else {
          const name = this.getRestraintColumnName(curr)
          if (name !== undefined) result.push(name)
        }
        return result
      }, [])
    },
    popperClass () {
      let result = 'filter-block-tooltip'
      if (!this.checked) result += ' checked'
      return result
    }
  },
  methods: {
    getRestraintColumnName (restraint) {
      if (!restraint.properties) return
      return restraint.properties['display_name']
    },
    onCheckedChange (checked) {
      this.$emit('status-change', checked)
    }
  }
}
</script>
<style lang="scss" scoped>
.single-filter-block {
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: center;
  min-width: 70px;
  background-color: transparent;
  border-radius: 5px;
  padding: 8px;
  margin-bottom: 8px;
  border: 1px solid #839699;
  color: #839699;
  cursor: pointer;

  &:not(:first-child) {
    margin-left: 12px;
    position: relative;

    &:before {
      content: "";
      display: inline-flex;
      width: 12px;
      position: absolute;
      top: 15px;
      left: -12px;
      border-top: 2px solid #839699;
    }
  }

  &.checked {
    background-color: $filter-color;
    border-color: $filter-color;
    color: #fff;

    &:not(:first-child):before {
      border-top: 2px solid $filter-color;
    }

    &:hover {
      background-color: #57A4FF;
    }

    .checkbox-label.filer-checkbox .checkbox-square {
      background: #fff;
      border-color: #fff;
    }
  }

  .column-name {
    font-size: 12px;
    font-weight: 600;
    line-height: 1;
    margin-right: 8px;
  }
}

.tooltip-content-item {
  max-width: 400px;
  margin-bottom: 8px;
  font-size: 13px;
  line-height: 16px;

  .tooltip-content-item-title {
    margin-bottom: 4px;
  }

  .tooltip-content-item-description {
    margin-left: 16px;
  }

  .tooltip-content-item-condition {
    margin: 4px 0;
    color: #757575;
  }
}
</style>

<style lang="scss">
.filter-block-tooltip.el-tooltip__popper {
  background-color: #323A3A;
  box-shadow: 0px 2px 15px rgba(71, 235, 251, 0.5);
  border-radius: 8px;
  padding: 8px;

  &.el-tooltip__popper[x-placement^=top] .popper__arrow:after {
    border-top-color: #323A3A;
  }

  &.el-tooltip__popper[x-placement^=top] .popper__arrow {
      border-top-color: #323A3A;
  }

  &.el-tooltip__popper[x-placement^=bottom] .popper__arrow:after {
      border-bottom-color: #323A3A;
  }

  &.el-tooltip__popper[x-placement^=bottom] .popper__arrow {
      border-bottom-color: #323A3A;
  }
}
</style>

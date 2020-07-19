<template>
  <label 
    :class="{ 'single-filter-block--checked': checked }"
    class="single-filter-block single-select"
  >
    <div class="single-filter-block__header">
      <div class="checkbox-group">
        <div class="checkbox-label">
          <input
            v-model="checked"
            type="checkbox"
            @change="onCheckedChange(checked)"
          >
          <div class="checkbox-square"/>
        </div>
      </div>
      {{ columnNames.join(', ') }}
    </div>
    <div class="single-filter-block__description">
      <div
        v-for="(restraint, index) in restriction"
        :key="index"
        class="description"
      >
        <template
          v-if="restraint.type === 'compound'"
        >
          {{ $t('resultDescription.restrict') + (index + 1) }}:
          <div
            v-for="(sub_restraint, restraintsIndex) in restraint.restraints"
            :key="'restraints-' + index + '-' + restraintsIndex"
          >
            <template v-if="sub_restraint.type === 'enum'">
              {{ sub_restraint.properties.display_name }} = {{ sub_restraint.properties['display_datavalues'].join(', ') }}
            </template>
            <template v-else>
              {{ sub_restraint.properties.display_name }}{{ $t('resultDescription.between', {
                start: isNaN(sub_restraint.properties.start) ? sub_restraint.properties.start : roundNumber(sub_restraint.properties.start),
                end: isNaN(sub_restraint.properties.end) ? sub_restraint.properties.end : roundNumber(sub_restraint.properties.end)
              }) }}
            </template>
            <span
              v-if="restraintsIndex < restraint.restraints.length - 1"
              class="description__condition"
            >〝</span>
          </div>
        </template>
        <template v-else>
          <div class="description__condition__title">
            {{ $t('resultDescription.restrict') + (index + 1) }}:
          </div>
          <div class="description__condition__content">
            <template v-if="restraint.type === 'enum'">
              {{ restraint.properties['display_name'] }} = {{ restraint.properties['display_datavalues'].join(', ') }}
            </template>
            <template v-if="restraint.type === 'range'">
              {{ restraint.properties['display_name'] }} = {{ $t('resultDescription.between', {
                start: isNaN(restraint.properties.start) ? restraint.properties.start : roundNumber(restraint.properties.start),
                end: isNaN(restraint.properties.end) ? restraint.properties.end : roundNumber(restraint.properties.end)
              }) }}
            </template>
          </div>
        </template>
      </div>
    </div>
  </label>
</template>
<script>

export default {
  name: 'SingleFilterBlock',
  props: {
    status: {
      type: Boolean,
      default: false
    },
    restriction: { type: Array, default: () => [] }
  },
  data () {
    return {
      checked: this.status
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
      }, []).filter((element, index, self) => {
        return self.findIndex(item => item === element) === index
      })
    }
  },
  watch: {
    status (status) {
      this.checked = status
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
  color: #CCCCCC;
  opacity: 0.5;
  cursor: pointer;

  &__header {
    display: flex;
    align-items: center;
    cursor: pointer;
    margin-bottom: 5px;

    .checkbox-group {
      margin-right: 11px;
    }
  }

  &__description {
    position: relative;
    margin-left: 26px;
    color: #CCCCCC;
    font-size: 12px;
    opacity: 0.5;

    &:before {
      content: "";
      width: 2px;
      position: absolute;
      top: -10px;
      bottom: -6px;
      left: -20px;
      background: #839699;
    }
  }

  &--checked {
    color: #FFFFFF;
    opacity: 1;

    .single-filter-block {
      &__description {
        margin-left: 26px;
        color: #CCCCCC;
        font-size: 12px;
        opacity: 1;

        &:before {
          background: #4F93FF;
        }
      }
    }
  }

  .checkbox-label input:checked ~ .checkbox-square {
    background: #4F93FF;
    border-radius: 3px;
    border-color: #4F93FF;;
  }
}
</style>

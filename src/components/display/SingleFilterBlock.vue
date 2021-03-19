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
    <div 
      class="single-filter-block__action"
    >
      <div
        class="single-filter-block__action--edit"
        @click.prevent="editFilter"
      >
        <svg-icon
          icon-class="edit"/>
      </div>
      <div
        class="single-filter-block__action--delete"
        @click.prevent="deleteFilter"
      >
        <svg-icon
          icon-class="delete"/>
      </div>
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
              {{ sub_restraint.properties.display_name }} {{ $t('resultDescription.between', {
                start: isDateTime(sub_restraint.properties.data_type) 
                  ? customerTimeFormatter(sub_restraint.properties.start, sub_restraint.properties.timeScope)
                  : roundNumber(sub_restraint.properties.start),
                end: isDateTime(sub_restraint.properties.data_type)
                  ? customerTimeFormatter(sub_restraint.properties.end, sub_restraint.properties.timeScope, true)
                  : roundNumber(sub_restraint.properties.end)
              }) }}
            </template>
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
                start: isDateTime(restraint.properties.data_type)
                  ? customerTimeFormatter(restraint.properties.start, restraint.properties.timeScope)
                  : roundNumber(restraint.properties.start),
                end: isDateTime(restraint.properties.data_type)
                  ? customerTimeFormatter(restraint.properties.end, restraint.properties.timeScope, true)
                  : roundNumber(restraint.properties.end)
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
    isDateTime (type) {
      return type === "datetime"
    },
    getRestraintColumnName (restraint) {
      if (!restraint.properties) return
      return restraint.properties['display_name']
    },
    onCheckedChange (checked) {
      this.$emit('status-change', checked)
    },
    editFilter () {
      this.$emit('filter-edit')
    },
    deleteFilter () {
      this.$emit('filter-delete')
    }
  }
}
</script>
<style lang="scss" scoped>
.single-filter-block {
  position: relative;
  color: #CCCCCC;
  opacity: 0.5;
  cursor: pointer;

  &:hover {
   .single-filter-block__action {
      visibility: visible;
    }
  }

  &__header {
    display: flex;
    align-items: center;
    cursor: pointer;
    margin-bottom: 5px;

    .checkbox-group {
      margin-right: 11px;
    }
  }

  &__action {
    visibility: hidden;
    position: absolute;
    top: 0;
    left: 170px;
    display: flex;
    flex-direction: row;
    background-color: #000;

    &--edit, &--delete {
      font-size: 14px;
      color: #FFF;

      &:hover {
        color: $theme-color-primary;
      }
    }

    &--edit {
      margin-right: 8px;
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

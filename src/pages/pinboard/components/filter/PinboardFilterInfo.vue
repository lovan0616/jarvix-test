<template>
  <div>
    <div class="single-pinboard-filter-block"
      v-for="(restraint, index) in restriction"
      :key="index"
    >
      <template
        v-if="restraint.type === 'compound'"
      >
        <div
          v-for="(sub_restraint, restraintsIndex) in restraint.restraints"
          :key="'restraints-' + index + '-' + restraintsIndex"
        >
          <div class="filter-title">
            <svg-icon icon-class="filter" class="icon"></svg-icon>{{ sub_restraint.properties['dc_name'] }}
          </div>
          <div class="filter-description"
            :class="{'last':  !notLast && index === (restriction.length - 1) && restraintsIndex === restraint.restraints.length -  1}"
          >
            {{ sub_restraint.properties.dc_name }} =
             {{ $t('resultDescription.between', {
              start: isNaN(sub_restraint.properties.start) ? sub_restraint.properties.start : roundNumber(sub_restraint.properties.start),
              end: isNaN(sub_restraint.properties.end) ? sub_restraint.properties.end : roundNumber(sub_restraint.properties.end)
            }) }}
          </div>
        </div>
      </template>
      <template v-else>
        <div class="filter-title">
          <svg-icon icon-class="filter" class="icon"></svg-icon>{{ restraint.properties['dc_name'] }}
        </div>
        <div class="filter-description"
          :class="{'last': !notLast && index === (restriction.length - 1)}"
        >
          <template v-if="restraint.type === 'enum'">
            {{restraint.properties['dc_name']}} = {{restraint.properties['datavalues'].join(', ')}}
          </template>
          <template v-if="restraint.type === 'range'">
            {{restraint.properties['dc_name']}} = {{ $t('resultDescription.between', {
              start: isNaN(restraint.properties.start) ? restraint.properties.start : roundNumber(restraint.properties.start),
              end: isNaN(restraint.properties.end) ? restraint.properties.end : roundNumber(restraint.properties.end)
            }) }}
          </template>
        </div>
      </template>
    </div>
  </div>
</template>
<script>

export default {
  name: 'PinboardFilterInfo',
  props: {
    restriction: { type: Array, default: () => [] },
    notLast: {
      type: Boolean,
      default: false
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
    }
  },
  methods: {
    getRestraintColumnName (restraint) {
      if (!restraint.properties) return
      return restraint.properties['display_name']
    }
  }
}
</script>
<style lang="scss" scoped>
.single-pinboard-filter-block {
  .filter-title {
    display: inline-flex;
    align-items: center;
    padding: 10px;
    background: #4389F7;
    border-radius: 5px;
    color: #fff;
    font-size: 12px;
    line-height: 12px;

    .icon {
      margin-right: 6px;
    }
  }
  .filter-description {
    padding-top: 8px;
    padding-bottom: 8px;
    padding-left: 28px;

    &:not(.last) {
      position: relative;
      &::before {
        content: "";
        display: block;
        position: absolute;
        top: 0;
        left: 16px;
        width: 2px;
        height: 100%;
        background-color: #4389F7;
      }
    }
  }
}
</style>

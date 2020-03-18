<template>
  <div class="single-filter-container">
    <div class="filter-title">
      <svg-icon icon-class="filter" class="icon"></svg-icon>{{ dataColumnNames }}
    </div>
    <ul class="filter-description-block"
      :class="{'last': isLast}"
      v-for="(restraint, index) in restriction"
      :key="index"
    >
      <template v-if="restraint.type === 'compound'">
        <li class="filter-description"
          v-for="(sub_restraint, restraintsIndex) in restraint.restraints"
          :key="'restraints-' + index + '-' + restraintsIndex"
        >
          <template v-if="sub_restraint.type === 'enum'">
            {{sub_restraint.properties.dc_name}} = {{sub_restraint.properties['datavalues'].join(', ')}}
          </template>
          <template v-if="sub_restraint.type === 'range'">
            {{ sub_restraint.properties.dc_name }} =
            {{ $t('resultDescription.between', {
              start: isNaN(sub_restraint.properties.start) ? sub_restraint.properties.start : roundNumber(sub_restraint.properties.start),
              end: isNaN(sub_restraint.properties.end) ? sub_restraint.properties.end : roundNumber(sub_restraint.properties.end)
            }) }}
          </template>
        </li>
      </template>
      <template v-else-if="restraint.type === 'enum'">
        <li class="filter-description">
          {{restraint.properties['datavalues'].join(', ')}}
        </li>
      </template>
      <template v-else-if="restraint.type === 'range'">
        <li class="filter-description">
          {{ $t('resultDescription.between', {
            start: isNaN(restraint.properties.start) ? restraint.properties.start : roundNumber(restraint.properties.start),
            end: isNaN(restraint.properties.end) ? restraint.properties.end : roundNumber(restraint.properties.end)
          }) }}
        </li>
      </template>
    </ul>
  </div>
</template>
<script>

export default {
  name: 'PinboardFilterInfo',
  props: {
    restriction: { type: Array, default: () => [] },
    isLast: {
      type: Boolean,
      default: true
    }
  },
  computed: {
    dataColumnNames () {
      if (!this.restriction.length) return
      if (this.restriction[0].type === 'compound') {
        return this.restriction[0].restraints.reduce((result, curr) => {
          result.push(curr.properties.dc_name)
          return result
        }, []).join(' & ')
      } else {
        return this.restriction[0].properties['dc_name']
      }
    }
  }
}
</script>
<style lang="scss" scoped>
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

.filter-description-block {
  padding: 5px 10px 5px 28px;
  margin: 9px 0 9px 28px;
  background-color: rgba(69, 78, 78, .8);
  border-radius: 5px;

  &:not(.last) {
    position: relative;
    &::before {
      content: "";
      display: block;
      position: absolute;
      top: -9px;
      left: -13px;
      width: 2px;
      height: calc(100% + 18px);
      background-color: #4389F7;
    }
  }

  .filter-description {
    font-size: 12px;
    line-height: 18px;
  }
}
</style>

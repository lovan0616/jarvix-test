<template>
  <div class="war-room-setting__filter">
    <div class="war-room-setting__filter-title">
      {{ dataColumnNames }}
    </div>
    <ul 
      v-for="(restraint, index) in restriction"
      :key="index"
      class="war-room-setting__filter-description"
    >
      <template v-if="restraint.type === 'compound'">
        <li 
          v-for="(sub_restraint, restraintsIndex) in restraint.restraints"
          :key="'restraints-' + index + '-' + restraintsIndex"
          class="war-room-setting__filter-description-item"
        >
          <template v-if="sub_restraint.type === 'enum'">
            {{ sub_restraint.properties.dc_name }} = {{ sub_restraint.properties['datavalues'].join(', ') }}
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
        <li class="war-room-setting__filter-description-item">
          {{ restraint.properties['datavalues'].join(', ') }}
        </li>
      </template>
      <template v-else-if="restraint.type === 'range'">
        <li class="war-room-setting__filter-description-item">
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
  name: 'ComponentFilterInfo',
  props: {
    restriction: { 
      type: Array, 
      default: () => [] 
    },
    dataColumnMap: {
      type: Object,
      default: () => ({})
    }
  },
  computed: {
    dataColumnNames () {
      if (!this.restriction.length === 0) return
      if (this.restriction[0].type === 'compound') {
        return this.restriction[0].restraints.reduce((result, curr) => {
          let dcName = curr.properties.dc_name
          result.push(this.getDataInfo.dataColumnMap[dcName].primary_alias)
          return result
        }, []).join(' & ')
      } else {
        let dcName = this.restriction[0].properties['dc_name']
        return this.dataColumnMap[dcName].primary_alias
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.war-room-setting {
  &__filter-description {
    padding: 0;
    margin: 0;
  }

  &__filter-description-item {
    list-style-type: none;
  }
}
</style>

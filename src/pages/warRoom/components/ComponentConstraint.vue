<template>
  <section class="setting">
    <div class="setting__header">
      <div class="setting__title">
        <svg-icon 
          icon-class="filter" 
          class="setting__header-icon"/>
        {{ $t('warRoom.dataConstraint') }}
      </div>
      <span
        class="setting__close-icon"
        @click="$emit('close')">
        <svg-icon 
          icon-class="close" 
          class="setting__header-icon"/>
      </span>
    </div>
    <section class="setting__content">
      <div class="setting__block-container">
        <div
          v-if="convertedSelectedColumns === null || convertedSelectedColumns.length > 0"
          class="setting__block"
        >
          <div class="setting__block-title">
            {{ $t('warRoom.selectedColumns') }}
          </div>
          <div
            v-if="convertedSelectedColumns === null"
            class="setting__filter"
          >
            <div class="setting__filter-title">{{ $t('warRoom.allColumns') }} </div>
          </div>
          <template v-else>
            <div
              v-for="(column, index) in convertedSelectedColumns"
              :key="index"
              class="setting__filter"
            >
              <div class="setting__filter-title">{{ column }}</div>
            </div>
          </template>
        </div>
        <div
          v-if="componentData.restriction && componentData.restriction.length > 0"
          class="setting__block"
        >
          <div class="setting__block-title">
            {{ $t('warRoom.filterConstraint') }}
          </div>
          <component-filter-info
            v-for="(restriction, index) in componentData.restriction"
            :key="index"
            :restriction="restriction"
            :data-column-map="componentData.dataColumnMap"
          />
        </div>
      </div>
    </section>
  </section>
</template>

<script>
import ComponentFilterInfo from './ComponentFilterInfo'

export default {
  name: 'ComponentConstraint',
  components: {
    ComponentFilterInfo
  },
  props: {
    componentData: {
      type: Object,
      default: () => ({
        selectedColumns: [],
        restriction: []
      })
    }
  },
  data () {
    return {
      dummySelectedColumns:[
        "速度1","壓切_位切","時3","料溫4","壓1","時2","壓3","模溫","料溫1","料溫2","料溫3","Flatness R1_1","Flatness R1_3","Flatness R1_7","Flatness R1_9","Flatness R2_1","Flatness R2_3","Flatness R2_7","Flatness R2_9","Profile_R1_1","Profile_R1_3","Profile_R1_7","Profile_R1_9","Profile_R2_1","Profile_R2_3","Profile_R2_7","Profile_R2_9","產品"
      ],
      dummyRestriction: [
      [
        {
          "type": "range",
          "properties": {
            "dc_id": null,
            "dc_name": "revenue",
            "data_type": "int",
            "start": "189.6331197097944",
            "end": "2302.7828174123338",
            "datavalues": null
          },
          "restraints": null
        }
      ],
      [
        {
          "type": "range",
          "properties": {
            "dc_id": null,
            "dc_name": "cost",
            "data_type": "int",
            "start": "595.5589694860814",
            "end": "934.4502168094219",
            "datavalues": null
          },
          "restraints": null
        }
      ],
      [
        {
          "type": "range",
          "properties": {
            "dc_id": null,
            "dc_name": "cost",
            "data_type": "int",
            "start": "642.859483404711",
            "end": "668.5892210920771",
            "datavalues": null
          },
          "restraints": null
        }
      ]
    ]
    }
  },
  computed: {
    convertedSelectedColumns () {
      const selectedColumns = this.componentData.selectedColumns
      if (selectedColumns === null) return null
      if (!selectedColumns || selectedColumns.length === 0) return []
      const columnMap = {}
      for (let column in this.componentData.dataColumnMap) {
        const { id, primary_alias: primaryAlias } = this.componentData.dataColumnMap[column]
        columnMap[id] = primaryAlias
      }
      return selectedColumns.map(columnId => columnMap[columnId])
    }
  }
}
</script>

<style lang="scss" scoped>
.setting {
  &__content {
    justify-content: space-between;
  }

  &__block-container {
    height: 100%;
  }

  /deep/ &__filter {
    font-size: 14px;
    margin-top: 8px;
    line-height: 22px;
    margin-left: 12px;
  }

  /deep/ &__filter-title {
    font-weight: 600;
    position: relative;
    &::before {
      content: '';
      position: absolute;
      top: 50%;
      left: -12px;
      transform: translateY(-50%);
      display: inline-block;
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: #2AD2E2;
    }
  }

  /deep/ &__filter-description {
    color: #CCCCCC;
  }
}
</style>
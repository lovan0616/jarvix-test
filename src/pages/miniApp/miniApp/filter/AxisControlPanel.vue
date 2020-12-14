<template>
  <section class="axis-control">
    <svg-icon
      icon-class="adjuster-horizontal" 
      class="axis-control__filter-icon"/>
    <single-axis-control-badge
      v-for="(controlOptionList, index) in controlList"
      :key="index"
      :initial-control-option-list="controlOptionList"
      :is-edit-mode="isEditMode"
      class="axis-control__list"
      @updateControlOptionList="updateControlOptionList($event, index)"
      @removeControl="removeControl(index)"
    />
  </section>
</template>

<script>
import SingleAxisControlBadge from './SingleAxisControlBadge'

export default {
  name: 'AxisControlPanel',
  components: {
    SingleAxisControlBadge
  },
  props: {
    initialControlList: {
      type: Array,
      required: true
    },
    isEditMode: {
      type: Boolean,
      required: true
    }
  },
  data () {
    return {
      controlList: []
    }
  },
  watch: {
    initialControlList: {
      deep: true,
      handler (updatedControlList) {
        this.controlList = updatedControlList
      }
    }
  },
  mounted () {
    this.controlList = JSON.parse(JSON.stringify(this.initialControlList))
  },
  methods: {
    updateControlOptionList (updatedControlOptionList, controlIndex) {
      const updatedControlList = this.controlList.map((control, index) => {
        if (index === controlIndex) return updatedControlOptionList
        return control
      })
      this.controlList = updatedControlList
      this.$emit('update:initial-control-list', updatedControlList)
      this.$emit('updateControl', updatedControlList)
    },
    removeControl (controlIndex) {
      const updatedControlList = this.controlList.filter((filter, index) => index !== controlIndex)
      this.$emit('update:initial-control-list', updatedControlList)
      this.$emit('updateControl', updatedControlList)
    }
  }
}
</script>

<style lang="scss" scoped>
.axis-control {
  position: relative;
  display: flex;
  align-items: center;

  &__filter-icon {
    margin-right: 11px;
    margin-bottom: 16px;
  }

  /deep/ .control {
    margin-bottom: 16px;
  }
}
</style>
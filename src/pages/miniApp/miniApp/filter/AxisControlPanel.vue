<template>
  <section
    :class="{ 'editing': isEditMode }"
    class="axis-control"
  >
    <svg-icon
      icon-class="adjuster" 
      class="axis-control__filter-icon"/>
    <single-axis-control-badge
      v-for="(controlOptionList, index) in controlList"
      :key="index"
      :initial-control-option-list="controlOptionList"
      :is-edit-mode="isEditMode"
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
      this.$emit('update:initial-control-list', updatedControlList)
    },
    removeControl (controlIndex) {
      const updatedControlList = this.controlList.filter((filter, index) => index !== controlIndex)
      this.$emit('update:initial-control-list', updatedControlList)
      this.$emit('removeControl', updatedControlList)
    }
  }
}
</script>

<style lang="scss" scoped>
.axis-control {
  position: relative;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.12);
  border-radius: 8px;
  margin-right: 20px;
  display: flex;
  align-items: center;

  &__filter-icon {
    margin-right: 11px;
  }

  &.editing {
    padding: 16px 19px;
    background: #1C292B;
  }
}
</style>
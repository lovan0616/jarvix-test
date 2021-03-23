<template>
  <router-view
    :has-emergency="hasEmergency"
    @insert="$emit('insert')"
  />
</template>

<script>
export default {
  name: 'Simulation',
  props: {
    hasEmergency: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {}
  }
}
</script>

<style lang="scss" scoped></style>

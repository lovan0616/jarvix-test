<template>
  <router-view/>
</template>

<script>
export default {
  name: 'ModelFlowManagementIndex',
  destroyed () {
    this.$store.commit('modelFlowManagement/updateCurrentFlowInfo', null)
  }
}
</script>

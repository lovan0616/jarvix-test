<template>
  <router-view/>
</template>

<script>
export default {
  name: 'ModelManagementIndex',
  data () {
    return {
    }
  },
  computed: {
    modelId () {
      return this.$route.params['model_id']
    }
  },
  mounted () {
  }
}
</script>

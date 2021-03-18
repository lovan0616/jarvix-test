<template>
  <section class="dialog">
    <spinner
      size="48"
      theme-color
    />
    <div class="dialog__title">
      Simulating ...
    </div>
    <default-button
      type="outline"
      @click="cancelSimulation"
    >
      Cancel
    </default-button>
  </section>
</template>

<script>

export default {
  name: '',
  data () {
    return {
      timer: null
    }
  },
  computed: {
  },
  mounted () {
    window.setTimeout(() => {
      this.$router.push({ name: 'DemoOTSimulationResult' })
    }, 3000)
  },
  methods: {
    cancelSimulation () {
      this.$emit('cancel')
    }
  }
}
</script>

<style lang="scss" scoped>
.dialog {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  &__title {
    margin-top: 24px;
    margin-bottom: 24px;
    font-size: 18px;
    line-height: 22px;
    color: var(--color-theme);
  }
}
</style>

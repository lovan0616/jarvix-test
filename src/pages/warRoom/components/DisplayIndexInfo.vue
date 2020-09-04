<template>
  <div
    :class="{ 'index-info--warning': isShowAlert }"
    class="index-info"
  >
    {{ formatComma(dataset.data) }}
  </div>
</template>

<script>
export default {
  name: 'DisplayIndexInfo',
  props: {
    dataset: { 
      type: Object, 
      default: () => ([])
    },
    isShowAlert: {
      type: Boolean,
      default: false
    }
  }
}
</script>

<style lang="scss" scoped>
.index-info {
  font-size: 32px;
  height: 37px;
  line-height: 37px;
  font-family: Oswald;
  font-weight: bold;
  color: #44D2FF;
  width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;

  &--warning {
    color: #FF5C46;
  }
}
</style>
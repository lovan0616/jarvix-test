<template>
  <div class="search-box search-box">
    <svg-icon
      icon-class="search"
      class="search-box__icon" />
    <input
      v-model.trim="queryString"
      :placeholder="placeholder"
      class="input search-box__field"
      autocomplete="off"
    >
  </div>
</template>
<script>
export default {
  name: 'SearchBlock',
  props: {
    value: {
      type: String,
      default: ''
    },
    placeholder: {
      type: String,
      default: ''
    }
  },
  computed: {
    queryString: {
      get () {
        return this.value
      },
      set (value) {
        this.$emit('input', value)
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.search-box {
  background: rgba(35, 61, 64, 0.6);
  padding: 10px;
  display: flex;
  align-items: center;
  border-radius: 5px;

  &__icon {
    margin-right: 6px;
  }

  &__field {
    font-size: 14px;
    line-height: 18px;
    border-bottom: none;
      
    &::placeholder {
      color: #888888;
      font-size: 14px;
    }
  }
}
</style>

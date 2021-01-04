<template>
  <div class="search-box">
    <svg-icon
      icon-class="search"
      class="search-box__icon" />
    <input
      v-model.trim="queryString"
      :placeholder="placeholder"
      class="input search-box__field"
      autocomplete="off"
    >
    <a
      v-show="value !== null && value !== ''"
      class="clear-btn"
      href="javascript:void(0)" 
      @click.prevent="clear">
      <svg-icon icon-class="remove-circle" />
    </a>
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
  },
  methods: {
    clear () {
      this.$emit('input', '')
    }
  }
}
</script>
<style lang="scss" scoped>
.search-box {
  background: rgba(35, 61, 64, 0.6);
  padding: 5px 10px;
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
    margin-right: 4px;
      
    &::placeholder {
      color: #888888;
      font-size: 14px;
    }
  }

  .clear-btn {
    display: flex;
    color: rgba(255, 255, 255, .5);

    &:hover {
      color: rgba(255, 255, 255, .8);
    }
  }
}
</style>

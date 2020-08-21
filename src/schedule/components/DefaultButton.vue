<template>
  <button
    :class="['default-button', buttonSize, buttonType]"
    :type="nativeType"
    :disabled="isDisabled"
    @click="$emit('click')"
  >
    <spinner
      v-show="showSpinner"
      size="16"
    />
    <slot />
  </button>
</template>

<script>
export default {
  name: 'DefaultButton',
  props: {
    isDisabled: {
      type: Boolean,
      default: false
    },
    size: {
      type: String,
      default: ''
    },
    type: {
      type: String,
      default: 'primary'
    },
    nativeType: {
      type: String,
      default: 'button'
    },
    showSpinner: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    buttonSize () {
      return this.size ? 'btn-' + this.size : 'btn'
    },
    buttonType () {
      return 'btn-' + this.type
    }
  }
}
</script>

<style lang="scss" scoped>
@mixin btn {
  font-size: 14px;
  font-weight: 300;
  border-radius: 4px;
  min-width: 72px;
  border: none;
  white-space: nowrap;
  word-break: keep-all;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  .spinner-block {
    margin-right: 8px;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
}

.btn {
  @include btn();
  height: 32px;
}

.btn-m {
  @include btn();
  padding: 11px 94px;
  height: 40px;
}

.btn-primary {
  color: var(--color-text);
  border: 1px solid var(--color-theme);
  background-color: var(--color-theme);
  transition: background-color 0.3s;

  &:hover, &:active {
    background-color: var(--color-theme);
    color: #444;
  }

  &:disabled {
    opacity: 0.25;
  }
}

.btn-secondary {
  color: $theme-color-primary;
  background-color:  rgba(255, 255, 255, 0.16);
  transition: background-color 0.3s;

  &:hover, &:active {
    background-color: #c7c7c7;
    color: #000;
  }

  &:disabled {
    opacity: 0.25;
  }
}

.btn-outline {
  color: var(--color-text);
  background-color: transparent;
  border: 1px solid var(--color-text);
  border-radius: 6px;
}
</style>

<template>
  <span :class="['flow-action-dropdown', `${shape}-like`]">
    <a class="link link-dropdown">{{ $t('modelFlow.function') }}</a>
    <dropdown-select
      :bar-data="flowActions" 
      @switchDialogName="$emit('action', $event)"
    />
    <svg-icon
      v-if="isShowDropdownArrow"
      icon-class="triangle"
      class="icon-arrow"
    />
  </span>
</template>

<script>
import DropdownSelect from '@/components/select/DropdownSelect'

export default {
  name: 'FlowActionDropdown',
  components: {
    DropdownSelect
  },
  props: {
    isFlowUpdating: {
      type: Boolean,
      default: false
    },
    shape: {
      type: String,
      default: ''
    },
    isShowDropdownArrow: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    flowActions () {
      return [
        { title: 'modelFlow.immediatelyUpdate', dialogName: 'manulUpdate', disabled: this.isFlowUpdating },
        { title: 'modelFlow.deleteModelFlow', dialogName: 'deleteModelFlow', disabled: this.isFlowUpdating }
      ]
    }
  }
}
</script>

<style lang="scss" scoped>
.flow-action-dropdown {
  position: relative;
  display: flex;
  align-items: center;
  color: $theme-color-primary;
  
  &:hover {
    .dropdown-select {
      visibility: visible;
    }
  }
  /deep/ .dropdown-select {
    position: relative;
    visibility: hidden;
    z-index: 1;
    &:hover {
      visibility: visible;
    }
    .dropdown-select-box {
      box-shadow: 0px 2px 5px rgba(34, 117, 125, 0.5);
      top: 10px;
      left: unset;
      right: 0;
      &::before {
        right: 4px;
      }
      .dropdown-flex {
        padding: 0 12px;
      }
    }
  }
  .icon-arrow {
    display: none;
    width: 8px;
    transition: all .3s ease;
    display: block;
    margin-left: 6px;
    transform: rotate(180deg);
    transform-origin: center center;
  }
  &.button-like {
    background: rgba(255, 255, 255, 0.16);
    padding: 5px 12px;
    border-radius: 4px;
    cursor: pointer;
    &:hover {
      .icon-arrow {
        transform: rotate(0);
      }
    }
    /deep/ .dropdown-select .dropdown-select-box {
      top: 16px;
      right: -26px;
    }
    .icon-arrow {
      display: block;
    }
    .link {
      text-decoration: none;
    }
  }
}
</style>
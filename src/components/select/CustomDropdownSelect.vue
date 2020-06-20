<template>
  <div
    class="dropdown"
    @mouseenter="toggleDropdownList('hover')"
    @mouseleave="toggleDropdownList('hover')"
  >
    <div 
      class="dropdown__select"
      @click="toggleDropdownList('click')"
    >
      <slot name="display" />
    </div>
    <ul
      :class="{ 'dropdown__list--show': isShowDropdownList }"
      class="dropdown__list"
    >
      <li
        v-for="item in dataList"
        :key="item.id"
        :class="{ 'dropdown__item--disabled': isLoading }"
        class="dropdown__item"
      >
        <a
          :class="{ 'dropdown__link--selected': isSelectedItem(item.id) }" 
          href="javascript:void(0);"
          class="dropdown__link"
          @click="selectItem(item.id)"
        >
          {{ item.name }}
        </a>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: "CustomDropdownSelect",
  props: {
    // hover 或 click 
    trigger: {
      type: String,
      default: 'hover'
    },
    dataList: {
      type: Array,
      required: true
    },
    selectedId: {
      type: Number,
      default: null
    },
    isLoading: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      isShowDropdownList: false
    }
  },
  methods: {
    toggleDropdownList(trigger) {
      if (trigger !== this.trigger) return
      this.isShowDropdownList = !this.isShowDropdownList
    },
    isSelectedItem(id) {
      return id === this.selectedId
    },
    selectItem(id) {
      if (this.isLoading || this.selectedId === id) return
      this.$emit('select', id)
    }
  }
}
</script>

<style lang="scss" scoped>
.dropdown {
  position: relative;

  &__list {
    position: absolute;
    top: 0;
    left: 100%;
    width: 207px;
    margin: 0;
    visibility: hidden;
    background: #2B3839;
    padding: 0;
    border-radius: 5px;
    box-shadow: 0px 4px 10px rgba(58, 178, 189, 0.5);

    &--show {
      visibility: visible;
    }
  }

  &__item {
    list-style-type: none;
    &:not(:last-of-type) {
      border-bottom: 1px solid #394045;
    }

    &--disabled {
      opacity: .3;
      cursor: wait;
    }
  }

  &__link {
    display: block;
    line-height: 44px;
    cursor: pointer;
    padding: 0 14px;
    color: #CCCCCC;
    width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;

    &::before {
      content: "\2022";
      color: #687072;
      font-weight: bold;
      display: inline-block;
      padding: 0 6px;
    }

    &:hover,
    &--selected {
      color: #FFFFFF;

      &::before {
        color: #2AD2E2;
      }
    }
  }
}
</style>
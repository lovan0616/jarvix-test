<template>
  <div
    class="dropdown"
    @mouseenter.self="toggleDropdownList('hover')"
    @mouseleave.self="toggleDropdownList('hover')"
  >
    <div 
      class="dropdown__select"
      @click="toggleDropdownList('click')"
    >
      <slot name="display" />
    </div>
    <div 
      :class="{ 'dropdown__list-container--show': isShowDropdownList }"
      class="dropdown__list-container"
    >
      <ul class="dropdown__list">
        <li
          v-for="item in dataList"
          :key="item.id"
          :class="{ 'dropdown__item--disabled': isLoading }"
          class="dropdown__item"
        >
          <a
            :class="{
              'dropdown__link--selected': isSelectedItem(item.id),
              'dropdown__link--point': hasBulletPoint,
              'dropdown__link--arrow': item.children
            }" 
            href="javascript:void(0);"
            class="dropdown__link"
            @click="selectItem(item.id)"
          >
            {{ item.name }}
          </a>
          <div
            v-if="item.children"
            class="dropdown__list-children"
          >
            <ul class="dropdown__list">
              <li
                v-for="children in item.children"
                :key="children.id"
                :class="{ 'dropdown__item--disabled': isLoading }"
                class="dropdown__item"
              >
                <a
                  :class="{
                    'dropdown__link--selected': isSelectedItem(children.id),
                    'dropdown__link--point': hasBulletPoint
                  }" 
                  href="javascript:void(0);"
                  class="dropdown__link"
                  @click="selectItem(children.id)"
                >
                  {{ children.name }}
                </a>
              </li>
            </ul>
          </div>
        </li>
      </ul>
    </div>
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
      type: [Number, String],
      default: null
    },
    isLoading: {
      type: Boolean,
      default: false
    },
    hasBulletPoint: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      isShowDropdownList: false
    }
  },
  mounted () {
    if (this.trigger === 'click') {
      document.addEventListener('click', this.autoCloseDropdownList)
    }
  },
  destroyed () {
    if (this.trigger === 'click') {
      document.removeEventListener('click', this.autoCloseDropdownList)
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
      if (this.trigger === 'click') this.toggleDropdownList('click')
      this.$emit('select', id)
    },
    autoCloseDropdownList (event) {
      if (this.$el.contains(event.target) || !this.isShowDropdownList) return
      this.toggleDropdownList('click')
    }
  }
}
</script>

<style lang="scss" scoped>
.dropdown {
  position: relative;

  &__list-container, &__list-children {
    position: absolute;
    top: 0;
    left: 100%;
    width: 207px;
    visibility: hidden;
    background: #2B3839;
    border-radius: 5px;
    box-shadow: 0px 4px 10px rgba(58, 178, 189, 0.5);

    &--show {
      visibility: visible;
    }
  }

  &__list-children {
    top: 0;
    left: 100%;
    width: auto;
  }

  &__list {
    width: 100%;
    margin: 0;
    padding: 0;
  }

  &__item {
    position: relative;
    list-style-type: none;
    &:not(:last-of-type) {
      border-bottom: 1px solid #394045;
    }

    &--disabled {
      opacity: .3;
      cursor: wait;
    }

    &:hover {
      .dropdown__list-children {
        visibility: visible
      }
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

    &--point {
      &::before {
        content: "\2022";
        color: #687072;
        font-weight: bold;
        display: inline-block;
        padding: 0 6px;
      }
    }

    &--arrow {
      &::after {
        position: absolute;
        content: '';
        top: calc(50% - 4px);
        right: 8px;
        border-top: 4px solid transparent;
        border-bottom: 4px solid transparent;
        border-left: 4px solid #CCCCCC;
      }
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
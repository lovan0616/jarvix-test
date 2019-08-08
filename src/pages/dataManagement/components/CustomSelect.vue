<template>
  <div class="custom-select-block">
    <div class="custom-select"
      @click="toggleDropdown"
    >
      <svg-icon :icon-class="icon" class="type-icon"></svg-icon>
      <div class="selected-option">{{ defaultMsg }}</div>
      <svg-icon icon-class="dropdown" class="arrow-icon"></svg-icon>
    </div>
    <div class="option-list-block"
      v-show="isDropdownOpen"
      :style="[dropdownPosition, {'max-height': optionListMaxHeight + 'px'}]"
    >
      <div class="option">欄位XXXX</div>
      <div class="option">欄位XXXX</div>
      <div class="option">欄位XXXX</div>
      <div class="option">欄位XXXX</div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'CustomSelect',
  props: {
    icon: {
      type: String
    },
    optionList: {
      type: Array
    },
    defaultMsg: {
      type: String
    }
  },
  data () {
    return {
      isDropdownOpen: false,
      onTop: false,
      optionListMaxHeight: 160
    }
  },
  mounted () {
    document.addEventListener('click', this.autoHide, false)
  },
  destroyed () {
    document.removeEventListener('click', this.autoHide, false)
  },
  methods: {
    autoHide (evt) {
      if (!this.isDropdownOpen) return false
      if (!this.$el.contains(evt.target)) {
        this.isDropdownOpen = false
      }
    },
    toggleDropdown () {
      this.isDropdownOpen = !this.isDropdownOpen

      this.adjestPosition()
    },
    chooseOption (value) {
    },
    adjestPosition () {
      if (!this.isDropdownOpen) return

      let rect = this.$el.getBoundingClientRect()
      let viewHeight = Math.max(document.documentElement.clientHeight, window.innerHeight || 0)

      // 螢幕可視空間的高度 - 目前元素底部距離上方的高度如果小於下拉高度，就移到上方
      this.onTop = (viewHeight - rect.bottom) < this.optionListMaxHeight
    }
  },
  computed: {
    dropdownPosition () {
      if (this.onTop) {
        // 減 1 是為了蓋在 border 上
        return {
          bottom: '100%',
          boxShadow: '0px -4px 12px rgba(0, 0, 0, 0.12)'
        }
      } else {
        return {
          top: '39px',
          boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.12)'
        }
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.custom-select-block {
  position: relative;
  .custom-select {
    width: 100%;
    display: flex;
    align-items: center;
    flex-wrap: nowrap;
    border-radius: 2px;
    padding: 8px 20px;
    background-color: $theme-bg-color;
    cursor: pointer;
    overflow: auto;

    .type-icon {
      margin-right: 12px;
      color: $theme-color-primary;
    }
    .selected-option {
      flex: 1;
      line-height: 24px;
      font-size: 14px;
    }
  }

  .option-list-block {
    position: absolute;
    left: 0;
    width: 100%;
    background-color: $theme-bg-darker-color;
    border-radius: 4px;
    z-index: 50;

    .option {
      padding: 8px 16px;
      font-size: 14px;
      line-height: 24px;
    }
  }
}
</style>

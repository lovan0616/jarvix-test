<template>
  <div
    ref="container"
    :class="{
      'grey-bg': isEditMode,
      'blue-bg': !isEditMode && isShowControlOptionList,
      'hoverable': !isEditMode 
    }"
    class="control"
    @click="toggleControlOptionList"
  >
    <div class="control__title">{{ displayName }}</div>
    <div
      v-if="isEditMode"
      class="control__delete-icon-box" 
      @click="removeControl">
      <svg-icon
        icon-class="close" 
        class="control__delete-icon"/>
    </div>
    <svg-icon
      v-else
      icon-class="dropdown" 
      class="control__dropdown-icon"/>
    <!--Enum-->
    <div
      v-if="isShowControlOptionList"
      class="control__selector-panel selector"
      @click.stop>
      <spinner
        v-if="isLoading"
        class="filter-spinner"
        size="20"
      />
      <template v-else>
        <div 
          v-if="controlOptionList.length === 0" 
          class="empty-message">
          {{ $t('message.emptyResult') }}
        </div>
        <div class="selector__list-block">
          <template v-for="(value, index) in controlOptionList">
            <!--Control panel filter-->
            <label
              :key="index"
              name="control"
              class="radio">
              <input
                :checked="value.isSelected"
                class="radio__input"
                type="radio"
                @input="updateControlOptionList($event, index, value.name)"
              >
              <span class="radio__name">{{ value.name }}</span>
            </label>
          </template>
        </div>
      </template>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SingleAxisControlBadge',
  inject: ['$validator'],
  props: {
    initialControlOptionList: {
      type: Array,
      required: true
    },
    isEditMode: {
      type: Boolean,
      required: true
    }
  },
  data () {
    return {
      controlOptionList: [],
      isLoading: false,
      isShowControlOptionList: false,
      isProcessing: false,
    }
  },
  computed: {
    displayName () {
      if (this.isEditMode) return '自變項目'
      const selectedOption = this.initialControlOptionList.find(option => option.isSelected)
      // 設定預設前，會沒有被選取的對象，因此需暫時給定空值
      return `自變項目: ${selectedOption ? selectedOption.columnName : ''}`
    }
  },
  watch: {
    initialControlOptionList: {
      deep: true,
      handler (val) {
        this.formatOptionList()
      }
    },
  },
  mounted () {
    this.formatOptionList()
    document.addEventListener('click', this.autoHide, false)
  },
  destroyed () {
    document.removeEventListener('click', this.autoHide, false)
  },
  methods: {
    autoHide (evt) {
      if (!this.isShowControlOptionList) return false
      if (!this.$el.contains(evt.target))  this.toggleControlOptionList()
    },
    formatOptionList () {
      const selectedOption = this.initialControlOptionList.find(option => option.isSelected)
      this.controlOptionList = this.initialControlOptionList.map((option, index) => ({
        value: option.columnName,
        name: option.columnName,
        isSelected: option.isSelected
      }))
      // preview 和 view 模式下，控制項預設為第一個值，各組建結果需要立即套用該控制項
      if (!this.isEditMode && !selectedOption) this.updateControlOptionList(null, 0)
    },
    toggleControlOptionList () {
      if (this.isEditMode) return
      this.isShowControlOptionList = !this.isShowControlOptionList
    },
    updateControlOptionList (event, index) {
      const updatedOptionList = this.initialControlOptionList.map((option, optionIndex) => ({
        ...option,
        isSelected: optionIndex === index
      }))
      this.$emit('updateControlOptionList', updatedOptionList)
    },
    removeControl () {
      this.$emit('removeControl')
    }
  }
}
</script>

<style lang="scss" scoped>
.control {
  position: relative;
  border: 1px solid #DEDEDE;
  border-radius: 20px;
  padding: 6px 12px;
  display: flex;
  align-items: center;
  user-select: none;

  &__title {
    font-size: 12px;
    line-height: 17px;
    margin-right: 4px;
  }

  &__delete-icon-box {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background: #A7A7A7;
    cursor: pointer;
  }

  &__delete-icon,
  &__dropdown-icon {
    font-size: 4px;
  }

  &__input-panel,
  &__selector-panel {
    position: absolute;
    left: 0;
    top: 100%;
    width: 215px;
    background-color: var(--color-bg-gray);
    border-radius: 5px;
    overflow: hidden;
    filter: drop-shadow(2px 2px 5px rgba(12, 209, 222, .5));
  }

  &:not(:last-of-type) {
    margin-right: 8px;
  }

  &.grey-bg {
    border: none;
    background: rgba(255, 255, 255, 0.2);
  }

  &.blue-bg {
    background: #2AD2E2;
    border: 1px solid rgba(255, 255, 255, 0.2);
  }

  &.hoverable {
    cursor: pointer;
  }

  .input-panel {
    background: #303435;
    border-radius: 5px;
    padding: 12px;

    &__input-group {
      margin-bottom: 8px;
    }

    &__label {
      color: #CCCCCC;
      font-size: 12px;
      margin-bottom: 4px;
      display: block;
    }

    &__input {
      background: #141C1D;
      opacity: 0.99;
      border-radius: 5px;
      border: none;
      width: 100%;
      height: 40px;
      padding: 8px;

      &::placeholder {
        color: #888888;
      }
    }

    &.error-text {
      margin-top: 5px;
    }
  }
}

.selector {
  &__input-block {
    margin: 12px 12px 8px 12px;
    padding: 9px 12px;
    width: calc(100% - 24px);
    font-size: 14px;
    color: #888888;
    border: none;
    border-radius: 8px;
    background-color: #141C1D;

    &:focus {
      outline: none;
    }
      
    .placeholder {
      font-size: 14px;
      line-height: 22px;
      color: #888888;
    }
  }

  &__list-block {
    max-height: 220px;
    overflow-y: auto;

    &::-webkit-scrollbar {
      width: 8px;
    }

    &::-webkit-scrollbar-track {
      background-color: transparent;
    }

    &::-webkit-scrollbar-thumb {
      background-color: rgba(0, 0, 0, 0.7);
    }  

    .radio {
      padding: 8px 12px;
      min-height: 32px;
      cursor: pointer;
      display: block;
      font-size: 14px;
      color: #CCCCCC;

      &__input {
        display: none;
        &:checked {
          & + .radio__name {
            color: #2AD2E2;
          }
        }
      }

      &:hover {
        color: #2AD2E2;
      }
    }
  }

  .empty-message {
    margin-bottom: 12px;
    padding: 0 12px;
    font-size: 12px;
    line-height: 20px;
    color: #CCC;
  }
}
</style>
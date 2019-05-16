<template>
  <div class="question-select">
    <input type="text" class="input question-input"
      ref="questionInput"
      v-model="appQuestion"
      :placeholder="appQuestionPlaceholder"
      @click="toggleDropdown"
      @keyup.enter="enterQuestion"
    >
    <div class="option-list"
      v-show="isDropdownOpen"
      :style="[dropdownPosition, {'max-height': optionListMaxHeight + 'px'}]"
    >
      <div class="option default"
        @click="chooseOption(suggestions.default)"
      >
        <svg-icon
          icon-class="folder"
          class="folder-icon"
        ></svg-icon> {{suggestions.default}}
      </div>
      <div class="class-block"
        v-for="(category, index) in suggestions.categories"
        :key="index"
      >
        <div class="class-name">{{ category.name }}</div>
        <div class="class-list">
          <div class="option"
            v-for="(question, questionIndex) in category.questionList"
            :key="questionIndex"
            @click="chooseOption(question)"
          >{{ question }}</div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'

export default {
  name: 'QuestionSelect',
  props: {
    icon: {
      type: String,
      default: null
    }
  },
  data () {
    return {
      isDropdownOpen: false,
      onTop: false,
      appQuestionPlaceholder: '请输入问题，例如：价格和成本的相关性',
      optionListMaxHeight: 320
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
    enterQuestion (e) {
      this.$refs.questionInput.blur()
      this.$store.dispatch('bookmark/updateResultRouter')
      this.isDropdownOpen = false
    },
    toggleDropdown () {
      this.isDropdownOpen = !this.isDropdownOpen

      this.adjestPosition()
    },
    chooseOption (value) {
      this.$store.commit('bookmark/setAppQuestion', value)
      this.enterQuestion()
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
    ...mapGetters('bookmark', ['suggestions']),
    appQuestion: {
      get () {
        return this.$store.getters['bookmark/appQuestion']
      },
      set (value) {
        this.$store.commit('bookmark/setAppQuestion', value)
      }
    },
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
.question-select {
  position: relative;
  text-align: left;

  .question-input {
    padding: 8px 20px;
    font-size: 20px;
    line-height: 23px;
  }

  .option-list {
    width: 100%;
    position: absolute;
    left: 0;
    background: #FFFFFF;
    border-radius: 4px;
    overflow: auto;
    padding: 10px 0;
    // 必須蓋過 element-ui 的 spinner
    z-index: 2010;
  }

  .class-list {
    margin-bottom: 10px;

    .option {
      padding: 7px 15px 7px 30px;
    }
  }

  .option {
    font-size: 14px;
    padding: 10px 15px;
    line-height: 16px;
    cursor: pointer;

    &:hover {
      background-color: #EFF5F6;
    }

     &.default {
      display: flex;
      align-items: center;
      margin-bottom: 10px;
    }
  }

  .folder-icon {
    margin-right: 10px;
  }

  .class-name {
    font-size: 16px;
    line-height: 20px;
    color: #979797;
    padding-left: 15px;
    margin-bottom: 10px;
  }

  .search-icon {
    font-size: 20px;
    line-height: 40px;
  }
}
</style>

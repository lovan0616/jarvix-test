<template>
  <div class="suggest-question-block">
    <div class="arrow arrow-left"
      @click="movePrev"
    ><svg-icon
      icon-class="arrow-right"
      class="arrow-icon"
    ></svg-icon></div>
    <div class="arrow arrow-right"
      @click="moveNext"
    ><svg-icon icon-class="arrow-right"></svg-icon></div>
    <div class="suggest-question-list">
      <div class="suggest-question-item"
        v-for="(question, index) in questionList"
        :key="index"
      >
        <div class="question-category">{{ index === 0 ? '比較類' : ''}}</div>
        <div class="question-name"
          @click="chooseRelatedQuestion(question)"
        >{{ question }}</div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import { tns } from '../../../../node_modules/tiny-slider/src/tiny-slider'

export default {
  name: 'RecommendQuestionList',
  props: {
    questionList: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
      mySlider: null,
      currentIndex: 0,
      categoryColor: [
        '#48666A',
        '#78A5A9',
        '#9FC2C6'
      ]
    }
  },
  destroyed () {
    this.mySlider.destroy()
  },
  watch: {
    questionList: {
      handler (e) {
        if (e.length) {
          console.log(e.length)
          this.$nextTick(() => {
            this.sliderInit()
          })
        }
      },
      immediate: true
    }
  },
  methods: {
    sliderInit () {
      this.mySlider = tns({
        container: '.suggest-question-list',
        items: 5,
        slideBy: 'page',
        fixedWidth: 152,
        controls: false,
        nav: false,
        mouseDrag: true,
        swipeAngle: false,
        loop: false,
        gutter: 15,
        speed: 500
      })
    },
    movePrev () {
      this.mySlider.goTo('prev')
    },
    moveNext () {
      this.mySlider.goTo('next')
    },
    chooseRelatedQuestion (question) {
      this.$emit('choose', { question, 'bookmark_Id': parseInt(this.bookmarkId) })
    }
  },
  computed: {
    ...mapGetters('bookmark', ['bookmarkId'])
  }
}
</script>
<style lang="scss" scoped>
.suggest-question-block {
  position: relative;
  width: 100%;
  margin-bottom: 10px;
  overflow: hidden;

  &:hover {
    .arrow {
      &.arrow-left {
        left: 0;
      }
      &.arrow-right {
        right: 0;
      }
    }
  }

  .arrow {
    position: absolute;
    top: 0;
    width: 20px;
    line-height: 100px;
    color: #444;
    background: #fff;
    opacity: 0.9;
    text-align: center;
    z-index: 1;
    cursor: pointer;
    transition: all 0.3s;

    &.arrow-left {
      left: -20px;
      box-shadow: 4px 0px 16px rgba(0, 0, 0, 0.08);

      .arrow-icon {
        transform: rotate(180deg)
      }
    }
    &.arrow-right {
      right: -20px;
      box-shadow: -4px 0px 16px rgba(0, 0, 0, 0.08);
    }
  }

  .suggest-question-list {
    .question-category {
      font-size: 18px;
      line-height: 1;
      letter-spacing: 0.1em;
      color: #444;
      height: 18px;
    }
    .question-name {
      display: flex;
      align-items: center;
      height: 60px;
      background-color: #48666A;
      color: #fff;
      border-radius: 4px;
      margin: 10px 0 13px;
      transition: all 0.3s;
      font-size: 14px;
      line-height: 21px;
      letter-spacing: 0.5px;
      padding: 0 10px;
      cursor: pointer;

      &:hover {
        transform: translate3d(0,-5px,0);
        box-shadow: 0 20px 35px -20px rgba(0,0,0,0.4);
      }
    }
  }
}
</style>

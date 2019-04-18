<template>
  <transition name="popup">
    <div class="popup-guiding" v-if="showDialog">
      <div class="popup-guiding-main">
        <a href="javascript:void(0)" class="btn-close"
          @click="closePopup"
        >
          <svg-icon icon-class="close" class="close-icon"></svg-icon>
        </a>
        <div class="popup-guiding-top popup-container">
          <div
            class="step"
            :class="{ 'is-actived': index + 1 === currentStep }"
            v-for="(step, index) in stepList"
            :key="index"
            @click="chooseStep(index + 1)"
          >
            <div class="step-label">{{ index + 1 }}</div>
            <div class="step-name">{{ step.name }}</div>
          </div>
        </div>
        <div class="guide-title-block popup-container">
          {{ stepList[currentStep - 1].hint }}
        </div>
        <div class="popup-guiding-center">
          <div class="step-control-block">
            <a class="step-control" href="javasctipt:void(0)"
              v-if="currentStep > min"
              @click="chooseStep(currentStep - 1)"
            >上一步</a>
          </div>
          <div class="img-block popup-container">
            <img class="pic"
              :class="{ 'is-actived': index + 1 === currentStep }"
              :src="require(`@/assets/images/${step.imgSrc}`)"
              v-for="(step, index) in stepList"
              :key="index"
            >
          </div>
          <div class="step-control-block">
            <a class="step-control" href="javasctipt:void(0)"
              v-if="currentStep < stepList.length"
              @click="chooseStep(currentStep + 1)"
            >下一步</a>
            <button class="btn-finish"
              v-else
              @click="closePopup"
            >结束</button>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>

export default {
  name: 'PopupGuiding',
  data () {
    return {
      stepList: [
        {
          name: '选择资料集',
          hint: '选择想要分析的资料集',
          imgSrc: 'step_1.jpg'
        },
        {
          name: '使用推荐语句',
          hint: '使用介绍资料集了解资料，并透过依照建议问句进行询问',
          imgSrc: 'step_2.jpg'
        },
        {
          name: '看快速指引',
          hint: '你也可以使用快速指引，一键开始进行搜寻分析',
          imgSrc: 'step_3.jpg'
        }
      ],
      currentStep: 1,
      min: 1,
      // 為了 transition
      showDialog: false
    }
  },
  mounted () {
    this.showDialog = true
    document.getElementsByTagName('body')[0].style.overflow = 'hidden'
    document.addEventListener('click', this.autoHide, false)
  },
  destroyed () {
    this.showDialog = false
    document.getElementsByTagName('body')[0].removeAttribute('style')
    document.removeEventListener('click', this.autoHide, false)
  },
  methods: {
    autoHide (evt) {
      if (!this.$el.firstElementChild.contains(evt.target)) {
        this.closePopup()
      }
    },
    chooseStep (num) {
      this.currentStep = num
    },
    closePopup () {
      this.currentStep = 1
      this.$emit('update')
    }
  }
}
</script>

<template>
  <transition name="popup">
    <div 
      v-if="showDialog" 
      class="popup-guiding">
      <div class="popup-guiding-main">
        <a 
          href="javascript:void(0)" 
          class="btn-close"
          @click="closePopup"
        >
          <svg-icon 
            icon-class="close" 
            class="close-icon"/>
        </a>
        <div class="popup-guiding-top popup-container">
          <div
            v-for="(step, index) in stepList"
            :class="{ 'is-actived': index + 1 === currentStep }"
            :key="index"
            class="step"
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
            <a 
              v-if="currentStep > min" 
              class="step-control"
              href="javasctipt:void(0)"
              @click="chooseStep(currentStep - 1)"
            >{{ $t('guiding.prevStep') }}</a>
          </div>
          <div class="img-block popup-container">
            <img 
              v-for="(step, index) in stepList"
              :class="{ 'is-actived': index + 1 === currentStep }"
              :src="require(`@/assets/images/${step.imgSrc}`)"
              :key="index"
              class="pic"
            >
          </div>
          <div class="step-control-block">
            <a 
              v-if="currentStep < stepList.length" 
              class="step-control"
              href="javasctipt:void(0)"
              @click="chooseStep(currentStep + 1)"
            >{{ $t('guiding.nextStep') }}</a>
            <button 
              v-else
              class="btn-finish"
              @click="closePopup"
            >{{ $t('guiding.endStep') }}</button>
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
      currentStep: 1,
      min: 1,
      // 為了 transition
      showDialog: false
    }
  },
  computed: {
    stepList () {
      return [
        {
          name: this.$t('guiding.step1.name'),
          hint: this.$t('guiding.step1.hint'),
          imgSrc: 'step_1.jpg'
        },
        {
          name: this.$t('guiding.step2.name'),
          hint: this.$t('guiding.step2.hint'),
          imgSrc: 'step_2.jpg'
        },
        {
          name: this.$t('guiding.step3.name'),
          hint: this.$t('guiding.step3.hint'),
          imgSrc: 'step_3.jpg'
        }
      ]
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

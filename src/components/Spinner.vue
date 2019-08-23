<template>
  <div class="spinner-block">
    <div class="spinner-container">
      <div class="spinner-circle"
        :style="spinnerSize"
      >
        <div class="sp-circle1 sp-circle"></div>
        <div class="sp-circle2 sp-circle"></div>
        <div class="sp-circle3 sp-circle"></div>
        <div class="sp-circle4 sp-circle"></div>
        <div class="sp-circle5 sp-circle"></div>
        <div class="sp-circle6 sp-circle"></div>
        <div class="sp-circle7 sp-circle"></div>
        <div class="sp-circle8 sp-circle"></div>
        <div class="sp-circle9 sp-circle"></div>
        <div class="sp-circle10 sp-circle"></div>
        <div class="sp-circle11 sp-circle"></div>
        <div class="sp-circle12 sp-circle"></div>
      </div>
      <div class="spinner-title"
        v-if="title"
      >{{ title }}</div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'Spinner',
  props: {
    title: {
      type: String,
      default: null
    },
    size: {
      type: [Number, String],
      default: 40
    }
  },
  computed: {
    spinnerSize () {
      return {
        width: this.size + 'px',
        height: this.size + 'px'
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.spinner-block {
  display: flex;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.35);
  border-radius: 8px;
  padding: 48px 0;

  .spinner-container {
    margin: 0 auto;
  }

  .spinner-title {
    color: $theme-text-color;
    margin-top: 12px;
  }
}
.spinner-circle {
  margin: 0 auto;
  position: relative;

  .sp-circle {
    width: 100%;
    height: 100%;
    position: absolute;
    left: 0;
    top: 0;

    &:before {
      content: '';
      display: block;
      margin: 0 auto;
      width: 15%;
      height: 15%;
      background-color: #fff;
      border-radius: 100%;
      animation: sp-circleFadeDelay 1.2s infinite ease-in-out both;
    }
  }

  .sp-circle2 {
    transform: rotate(30deg);

    &:before {
      animation-delay: -1.1s;
    }
  }
  .sp-circle3 {
    transform: rotate(60deg);

    &:before {
      animation-delay: -1s;
    }
  }
  .sp-circle4 {
    transform: rotate(90deg);

    &:before {
      animation-delay: -0.9s;
    }
  }
  .sp-circle5 {
    transform: rotate(120deg);

    &:before {
      animation-delay: -0.8s;
    }
  }
  .sp-circle6 {
    transform: rotate(150deg);

    &:before {
      animation-delay: -0.7s;
    }
  }
  .sp-circle7 {
    transform: rotate(180deg);

    &:before {
      animation-delay: -0.6s;
    }
  }
  .sp-circle8 {
    transform: rotate(210deg);

    &:before {
      animation-delay: -0.5s;
    }
  }
  .sp-circle9 {
    transform: rotate(240deg);

    &:before {
      animation-delay: -0.4s;
    }
  }
  .sp-circle10 {
    transform: rotate(270deg);

    &:before {
      animation-delay: -0.3s;
    }
  }
  .sp-circle11 {
    transform: rotate(300deg);

    &:before {
      animation-delay: -0.2s;
    }
  }
  .sp-circle12 {
    transform: rotate(330deg);

    &:before {
      animation-delay: -0.1s;
    }
  }
}

@keyframes sp-circleFadeDelay {
  0%, 39%, 100% { opacity: 0; }
  40% { opacity: 1; }
}
</style>

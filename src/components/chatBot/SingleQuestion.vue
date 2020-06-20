<template>
  <div class="single-question">
    <span class="question-dot">●</span>
    <div class="question-text-box">
      <span
        v-for="(example, exampleIndex) in exampleQuestion"
        :key="exampleIndex"
        :class="['question-type-text', example.type ? `question-${example.type}` : '']"
        @mouseover="tooltipOn(example.type, $event)"
      >
        {{ example.text }}
        <div
          v-if="example.type"
          :class="['question-type', `question-${example.type}-type`, `${position.class}`]"
        >
          {{ $t(`askHelper.${example.type}`) }}
        </div>
      </span>
    </div>
  </div>
</template>
<script>
export default {
  name: 'SingleQuestion',
  props: {
    exampleQuestion: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
      position: {
        class: ''
      }
    }
  },
  methods: {
    tooltipOn (type, event) {
      // tooltip 在 collapse 最底下的位置要在上面
      let eventBottom = event.target.getBoundingClientRect().bottom
      let parentBottom = event.target.parentElement.parentElement.parentElement.getBoundingClientRect().bottom
      let minusBottom = parentBottom - eventBottom
      if (minusBottom > 63) {
        this.position.class = `question-${type}-up-type`
      } else {
        this.position.class = `question-${type}-down-type`
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.single-question {

  .question-dot {
    padding-right: 4px;
  }

  .question-text-box {
    display: flex;
    flex-wrap: wrap;
  }

  .question-type-text {
    position: relative;

    &:hover {
      .question-type {
        visibility: visible
      }
    }
   }

  .question-category {
    border-bottom: 1px solid #44D2FF;
    cursor: pointer;

    &:hover {
      color: #FFFFFF;
      background-color: #44D2FF;
    }
  }

  .question-numeric {
    border-bottom: 1px solid #00A3FF;
    cursor: pointer;

    &:hover {
      color: #FFFFFF;
      background-color: #00A3FF;
    }
  }

  .question-filter {
    border-bottom: 1px solid #FF9559;
    cursor: pointer;

    &:hover {
      color: #FFFFFF;
      background-color: #FF9559;
    }
  }

  .question-value {
    border-bottom: 1px solid #CA66DA;
    cursor: pointer;

    &:hover {
      color: #FFFFFF;
      background-color: #CA66DA;
    }
  }

  .question-type {
    visibility: hidden;
    position: absolute;
    font-size: 12px;
    padding: 4px 8px;
    text-align: center;
    border-radius: 8px;
    z-index: 1;
    color: #FFFFFF;
    box-shadow: 0px 2px 15px rgba(71, 235, 251, 0.5);
  }

  .question-category-type {
    width: 176px;
    background: #44D2FF;
  }

  .question-numeric-type {
    width: 160px;
    background: #00A3FF;
  }

  .question-filter-type {
    width: 112px;
    background: #FF9559;
  }

  .question-value-type {
    width: 188px;
    background: #CA66DA;
  }

  .question-category-up-type {
    left: -30px;
    bottom: -50px;
  }

  .question-category-down-type {
    left: -30px;
    bottom: 24px;
  }

  .question-numeric-up-type {
    left: -30px;
    bottom: -50px;
  }

  .question-numeric-down-type {
    left: -30px;
    bottom: 24px;
  }

  .question-filter-up-type {
    left: -30px;
    bottom: -30px;
  }

  .question-filter-down-type {
    left: -30px;
    bottom: 24px;
  }

  .question-value-up-type {
    left: -30px;
    bottom: -50px;
  }

  .question-value-down-type {
    left: -30px;
    bottom: 24px;
  }
}

</style>

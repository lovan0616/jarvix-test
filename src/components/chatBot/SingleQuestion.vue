<template>
  <div class="single-question">
    <span class="question-dot">●</span>
    <span
    v-for="(example, exampleIndex) in exampleQuestion"
    :key="exampleIndex"
    :class="['question-type-text', example.type ? `question-${example.type}` : '']"
    @mouseover="tooltipOn(example.type, $event)"
    :name="example.type"
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
</template>
<script>
export default {
  name: 'SingleQuestion',
  props: {
    exampleQuestion: {
      type: Array
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
      let eventBottom = event.target.getBoundingClientRect().bottom
      let parentBottom = event.relatedTarget.parentElement.parentElement.getBoundingClientRect().bottom
      let minusBottom = parentBottom - eventBottom
      if (minusBottom > 63) {
        this.position.class = 'question-up-type'
      } else {
        this.position.class = 'question-down-type'
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
  }

  .question-numeric {
    border-bottom: 1px solid #00A3FF;
    cursor: pointer;
  }

  .question-filter {
    border-bottom: 1px solid #FF9559;
    cursor: pointer;
  }

  .question-value {
    border-bottom: 1px solid #CA66DA;
    cursor: pointer;
  }

  .question-type {
    visibility: hidden;
    position: absolute;
    font-size: 12px;
    padding: 4px 8px;
    text-align: center;
    border-radius: 8px;
    z-index: 1;
  }

  .question-category-type {
    width: 150px;
    background: #44D2FF;
  }

  .question-numeric-type {
    width: 150px;
    background: #00A3FF;
  }

  .question-filter-type {
    width: 80px;
    background: #FF9559;
  }

  .question-value-type {
    width: 160px;
    background: #CA66DA;
  }

  .question-up-type {
    left: -30px;
    bottom: -50px;
  }

  .question-down-type {
    left: -30px;
    bottom: 24px;
  }
}

</style>

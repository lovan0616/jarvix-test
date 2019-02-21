<template>
  <div class="outer">
    <div class="main">
      <div class="top">
        <div :class="['question', { 'is-actived': step === question.step }]"
          v-for="question in questions" :key="question.id"
        >
          <div class="circle">{{ question.step }} </div>
          <div>{{ question.word }}</div>
          <div v-if="question.step < max" class="line"></div>
        </div>
      </div>
      <div class="center">
        <div :class="['pic', { 'is-actived': question.step === step }]"
          v-for="question in questions" :key="question.id"
        >
          {{ question.pic }}
        </div>
      </div>
      <div class="bottom">
        <div :class="['back', { 'is-actived': step > min }]"
          @click="back"
        >
          &lt; 上一步
        </div>
        <div>
          <div :class="['next', { 'is-actived': question.step === step}]"
            v-for="question in questions" :key="question.id"
          >
            {{ question.hint }}
          </div>
          <div> {{ step }}/{{ max }} </div>
        </div>
        <div :class="['next', { 'is-actived': step < max }]"
          @click="next"
        >
          下一步 &gt;
        </div>
        <div :class="['understand', { 'is-actived': step === max }]"
          @click="close"
        >
          我知道了
        </div>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  name: 'PageGuiding',
  props: {
  },
  created () {

  },
  data () {
    return {
      step: 1,
      min: 1,
      max: 3,
      questions: [
        {
          word: '選擇資料集',
          hint: '選擇想要分析的資料集',
          pic: 'pic1',
          step: 1
        },
        {
          word: '使用推薦問題',
          hint: '透過推薦問題，了解問題類型以及問法',
          pic: 'pic2',
          step: 2
        },
        {
          word: '查看快速指引',
          hint: '你也可以使用「介紹資料集」，來查看資料並找出想問的問題',
          pic: 'pic3',
          step: 3
        }
      ]
    }
  },
  computed: {

  },
  methods: {
    next: function () {
      if (this.step < this.max) {
        this.step = this.step + 1
      }
    },
    back: function () {
      if (this.step > this.min) {
        this.step = this.step - 1
      }
    },
    close: function () {
      this.$parent.guiding = false
    }
  }
}
</script>

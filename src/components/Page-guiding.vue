<template>
  <div>
    <template v-if="popup">
      <div class="page-guiding">
        <div class="main">
          <div class="top">
            <div :class="['question', { 'is-actived': index + 1 === step }]"
              v-for="(question, index) in questions" :key="question.id"
            >
              <div class="circle">{{ index + 1 }}</div>
              <div>{{ question.word }}</div>
            </div>
          </div>
          <div class="center">
            <div :class="['pic', { 'is-actived': index + 1 === step }]"
              v-for="(question, index) in questions" :key="question.id"
            >
              {{ question.pic }}
            </div>
          </div>
          <div class="line"></div>
          <div class="bottom">
            <div :class="['back', { 'is-actived': step > min }]"
              @click="back"
            >
              &lt; 上一步
            </div>
            <div>
              <div :class="[ 'middle-top', { 'is-actived': index + 1 === step }]"
                v-for="(question, index) in questions" :key="question.id"
              >
                {{ question.hint }}
              </div>
              <div class='middle-bottom'> {{ step }}/{{ questions.length }} </div>
            </div>
            <div :class="['next', { 'is-actived': step < questions.length }]"
              @click="next"
            >
              下一步 &gt;
            </div>
            <div :class="['understand', { 'is-actived': step === questions.length }]"
              @click='close'
            >
              我知道了
            </div>
          </div>
        </div>
      </div>
      </template>
  </div>
</template>

<script>

export default {
  name: 'PageGuiding',
  props: {
    popup: { type: Boolean, default: false }
  },
  data () {
    return {
      questions: [
        {
          word: '選擇資料集',
          hint: '選擇想要分析的資料集',
          pic: 'pic1'
        },
        {
          word: '使用推薦問題',
          hint: '透過推薦問題，了解問題類型以及問法',
          pic: 'pic2'
        },
        {
          word: '查看快速指引',
          hint: '你也可以使用「介紹資料集」，來查看資料並找出想問的問題',
          pic: 'pic3'
        }
      ],
      step: 1,
      min: 1
    }
  },
  methods: {
    next () {
      if (this.step < this.questions.length) {
        this.step = this.step + 1
      }
    },
    back () {
      if (this.step > this.min) {
        this.step = this.step - 1
      }
    },
    close () {
      this.popup = !this.popup
    }
  }
}
</script>

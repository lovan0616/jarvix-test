<template>
  <div class="sy-landing-page">
    <!-- #### Header #### -->
    <header>
      <div class="container center">
        <!-- Logo -->
        <img src="@/assets/images/synergieslogo.svg"
        class="logo" alt="Synergies" />

        <!-- Titles -->
        <h1>{{ headerTitle }}</h1>
        <h2>{{ headerSubTitle }}</h2>

        <!-- Search Input -->
        <sy-speech-autocomplete-input
          v-bind="inputProps"
          @onEnter="onQuestionEnter"
        >
        </sy-speech-autocomplete-input>
      </div>
    </header>

    <!-- #### Main Content #### -->
    <main>
      <div class="container center">
        <!-- Description -->
        <div class="description">
          <p v-for="(sentence, i) in mainDescription" :key="i">
            {{ sentence }}
          </p>
        </div>

        <!-- Question List -->
        <sy-qeustion-list
          v-bind="bindQuestionListProps"
          @onItemClick="onQuestionEnter"
        ></sy-qeustion-list>

      </div>
    </main>

  </div>
</template>

<script>
import SyQeustionList from '../../components/question-list/'
import SySpeechAutocompleteInput from '../../components/speech-autocomplete-input/'
export default {
  name: 'SyLandingPage',
  components: {
    SyQeustionList,
    SySpeechAutocompleteInput
  },
  props: {
    headerTitle: { type: String, default: '智能分析 GPS' },
    headerSubTitle: { type: String, default: '輸入任何您想要知道的問題：' },
    mainDescription: { type: Array, default: () => [ '或者', '您可以試試以下' ] },
    questionList: { type: Array, default: () => [] },
    questionListProps: { type: Object, default: () => ({}) },
    inputProps: { type: Object, default: () => ({}) }
  },
  computed: {
    bindQuestionListProps () {
      return { ...this.questionListProps, data: this.questionList }
    },
    bindInputProps () {
      return { ...this.questionListProps, data: this.questionList }
    }
  },
  methods: {
    onQuestionEnter (e, d) {
      this.$emit('onQuestionEnter', e, d)
    }
  }
}
</script>

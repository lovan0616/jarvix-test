<template>
  <div class="page-index">
    <div class="bg"></div>
    <main class="container center">
      <img class="logo" src="@/assets/images/synergies_logo.svg" alt="Synergies" />
      <h1 class="title">{{ title }}</h1>
      <p class="description">{{ description }}</p>
      <!-- Search Input -->
      <el-autocomplete class="search-input"
        ref="autocomplete"
        v-model="app_question"
        :fetch-suggestions="app_querySearch"
        :placeholder="app_question_placeholder"
        @keypress.enter.native="app_onEnterQuestion"
        @select="app_onEnterQuestion"
      ></el-autocomplete>
    </main>
  </div>
</template>

<script>
import appHandleQuestion from '../mixins/app-handle-question.js'

export default {
  name: 'PageIndex',
  mixins: [
    appHandleQuestion
  ],
  data () {
    return {
      title: 'SyGPS',
      description: '我是系統說明文字，還是一堆系統說明文字，看我看我。我是系統說明文字，還是一堆系統說明文字，看我看我。我是系統說明文字，還是一堆系統說明文字，看我看我。'
    }
  }
}
</script>

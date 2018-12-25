<template>
  <div class="page-index">
    <!-- #### Header #### -->
    <header>
      <div class="container center">
        <!-- Logo -->
        <img src="../assets/images/synergieslogo.svg"
        class="logo" alt="Synergies" />

        <!-- Titles -->
        <h1>{{ header.title }}</h1>
        <h2>{{ header.subTitle }}</h2>

        <!-- Search Input -->
        <el-autocomplete class="search-input"
          ref="autocomplete"
          v-model="app_question"
          :fetch-suggestions="app_querySearch"
          :placeholder="app_question_placeholder"
          @keypress.enter.native="app_onEnterQuestion"
          @select="app_onEnterQuestion"
        ></el-autocomplete>
      </div>
    </header>

    <!-- #### Main Content #### -->
    <main>
      <div class="container center">
        <!-- Description -->
        <div class="description">
          <p v-for="(sentence, i) in main.description" :key="i">
            {{ sentence }}
          </p>
        </div>

        <!-- Question List -->
        <ul class="question-list" >
          <li class="question-list-item"
              v-for="(question, i) in quickStart" :key="i"
              @click="onItemClick(question.value)">
              <i class="el-icon-search" />
            “{{ question.value }}”
          </li>
        </ul>

      </div>
    </main>

  </div>
</template>

<script>
import appHandleQuestion from '../mixins/app-handle-question.js'

export default {
  name: 'PageIndex',
  data () {
    return {
      header: {
        title: '智能分析 SyGPS',
        subTitle: '输入任何您想要知道有关 资料的问题：'
      },
      main: {
        description: [
          '或者',
          '您可以试试以下'
        ]
      }

    }
  },
  computed: {
    quickStart () {
      return this.app_suggestions.filter((item, index) => index < 3)
    }
  },
  methods: {
    onItemClick (question) {
      this.app_setQuestion(question)
      this.app_onEnterQuestion()
    }
  },
  mixins: [
    appHandleQuestion
  ]
}
</script>

<style scoped lang="scss">
// Import global styles
@import '../styles/common/variables.scss';
@import '../styles/App.scss';

.page-index {
  // Local Variables
  $header-height: 330px;

  // ======================
  //         Global
  // ======================
  width: 100vw;

  p { margin: 0; }

  ul {
    list-style: none;
    margin: 0;
    -webkit-padding-start: 0;
  }

  .container {
    width: 600px;
    padding: 24px 24px;
  }

  .center {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
  }

  // ======================
  //         Header
  // ======================
  header {
    position: relative;
    display: flex;
    justify-content: center;
    width: 100%;
    height: $header-height;
    background: url(../assets/images/earth_bg.png), linear-gradient(to right, #005055, #0f9696);
    background-repeat: no-repeat;
    background-position: center bottom;
    color: #fff;
    box-shadow: $theme-box-shadow-m;

    // ---- Logo ----
    .logo {
      width: 150px;
      margin: 20px 0;
    }

    // ---- Title/Subitle ----
    h1, h2 {
      margin: 0 0 20px;
    }

    // Title
    h1 {
      letter-spacing: 4px;
    }

    // Subtitle
    h2 {
      font-size: 20px;
      font-weight: 400;
      letter-spacing: 1.2px;
    }
  }

  // ======================
  //      Main Content
  // ======================
  main {
    display: flex;
    justify-content: center;
    background: #f5f5f5;
    min-height: calc(100vh - #{$header-height});

    // ---- Description ----
    .description {
      p {
        margin-bottom: 20px;
        font-size: 20px;
        font-weight: bold;
      }
    }

    // ---- Question ----
    .question-list {
      width: 100%;

      &-item {
        padding: 12px 16px;
        margin-bottom: 16px;
        background: #fff;
        border-radius: $theme-border-radius-base;
        text-align: left;
        color: $theme-color-primary-dark;
        font-weight: 600;
        cursor: pointer;
        transition: all .2s;
        box-shadow: $theme-box-shadow-m;
        letter-spacing: 1.5px;

        &:last-child { margin-bottom: 0; }

        &:hover {
          box-shadow: $theme-box-shadow-l;
          color: $theme-color-primary;
        }

        .el-icon-search { color: $theme-color-primary; }

      }

    }
  }

}
</style>

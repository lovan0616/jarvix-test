<template>
  <div class="function-description">
    <h1 class="title">{{ $t('editing.functionDescription') }}</h1>
    <el-tabs v-model="activeTab" type="card" class="function-table">
      <el-tab-pane label="基本介紹" name="基本介紹">
        <el-collapse accordion v-model="activeCollapse">
          <el-collapse-item title="介面說明" name="介面說明">
            <div class="description-image-box">
              <img src="@/assets/images/function-description/basic/index.png" alt="">
              <frame width="100%" height="30px" top="0">
              <frame width="185px" height="330px" top="32px">
              <frame width="445px" height="300px" top="40px" left="200px">
              <row-description text="導引列" top="5" right />
              <row-description text="Chatroom" top="100" />
              <row-description text="隱藏Chatroom" width="320" top="180"/>
              <row-description text="主畫面" width="165" top="80" right/>
            </div>
          </el-collapse-item>
          <el-collapse-item title="導覽列介紹" name="導覽列介紹">
            <div class="description-image-box">
              <img src="@/assets/images/function-description/basic/nav-group-management.png" alt="">
              <frame width="180px" height="90px" top="56px" left="367px">
              <row-description text="專案管理" width="262" top="90" right />
            </div>
            <div class="description-image-box">
              <img src="@/assets/images/function-description/basic/nav-group.png" alt="">
              <frame width="205px" height="136px" top="55px" left="392px">
              <row-description text="專案切換" width="211" top="113" right />
            </div>
            <div class="description-image-box">
              <img src="@/assets/images/function-description/basic/nav-account.png" alt="">
              <frame width="205px" height="186px" top="57px" left="394px">
              <row-description text="帳號功能選單" width="209" top="146" right />
            </div>
            <div class="description-image-box">
              <img src="@/assets/images/function-description/basic/nav-func-desc.png" alt="">
              <frame width="34px" height="34px" top="17px" left="592px">
              <row-description text="功能說明" top="26" width="182" right />
            </div>
          </el-collapse-item>
          <el-collapse-item title="首頁功能說明" name="首頁功能說明">
            <div class="description-image-box">
              <img src="@/assets/images/function-description/basic/index.png" alt="">
              <frame width="447px" height="200px" top="41px" left="200px">
              <frame width="447px" height="93px" top="246px" left="200px">
              <row-description text="查看資料表的詳細內容" top="130" width="160" right />
              <row-description text="系統紀錄的常用問題" top="270" width="160" right />
            </div>
          </el-collapse-item>
        </el-collapse>
      </el-tab-pane>
      <el-tab-pane label="問題分析操作" name="問題分析操作">
        <el-collapse accordion v-model="activeCollapse">
          <el-collapse-item title="如何問問題？" name="如何問問題？">
            <div class="description-image-box">
              <img src="@/assets/images/function-description/question/entry.png" alt="">
              <frame width="184px" height="138px" top="68px" left="220px">
              <frame width="184px" height="35px" top="310px" left="220px">
              <row-description text="點擊系統推薦的問句" width="365" top="80"/>
              <row-description text="問題文字輸入" width="404" top="317" right/>
            </div>
          </el-collapse-item>
          <el-collapse-item title="如何啟用問句協助功能？" name="如何啟用問句協助功能？">
            <div class="description-image-box space-between">
              <img src="@/assets/images/function-description/question/entry.png" alt="">
              <img src="@/assets/images/function-description/question/vocabulary.png" alt="">
              <frame width="30px" height="20px" top="337px" left="114px">
              <frame width="184px" height="35px" top="310px" left="220px">
              <row-description text="點擊系統推薦的問句" width="365" top="80"/>
              <row-description text="問題文字輸入" width="404" top="317" right/>
            </div>
          </el-collapse-item>
        </el-collapse>
      </el-tab-pane>
      <!-- <el-tab-pane label="個人釘板使用" name="pinboard">
        <el-collapse accordion v-model="activeCollapse">
          <el-collapse-item title="介面說明" name="1">1
          </el-collapse-item>
          <el-collapse-item title="導覽列介紹" name="2">2
          </el-collapse-item>
          <el-collapse-item title="首頁功能說明" name="3">3
          </el-collapse-item>
        </el-collapse>
      </el-tab-pane>
      <el-tab-pane label="資料管理" name="data">
        <el-collapse accordion v-model="activeCollapse">
          <el-collapse-item title="介面說明" name="1">1
          </el-collapse-item>
          <el-collapse-item title="導覽列介紹" name="2">2
          </el-collapse-item>
          <el-collapse-item title="首頁功能說明" name="3">3
          </el-collapse-item>
        </el-collapse>
      </el-tab-pane>
      <el-tab-pane label="帳戶使用者管理" name="account">
        <el-collapse accordion v-model="activeCollapse">
          <el-collapse-item title="介面說明" name="1">1
          </el-collapse-item>
          <el-collapse-item title="導覽列介紹" name="2">2
          </el-collapse-item>
          <el-collapse-item title="首頁功能說明" name="3">3
          </el-collapse-item>
        </el-collapse>
      </el-tab-pane>
      <el-tab-pane label="專案成員管理" name="group">
        <el-collapse accordion v-model="activeCollapse">
          <el-collapse-item title="介面說明" name="1">1
          </el-collapse-item>
          <el-collapse-item title="導覽列介紹" name="2">2
          </el-collapse-item>
          <el-collapse-item title="首頁功能說明" name="3">3
          </el-collapse-item>
        </el-collapse>
      </el-tab-pane> -->
    </el-tabs>
  </div>
</template>

<script>
import RowDescription from './components/RowDescription'
import Frame from './components/Frame'

export default {
  name: 'FunctionDescription',
  components: {
    RowDescription,
    Frame
  },
  data () {
    return {
      activeTab: '問題分析操作',
      activeCollapse: '如何啟用問句協助功能？'
    }
  }
}
</script>

<style lang="scss">
.function-table.el-tabs {
  background: rgba(0, 0, 0, .55);
  box-shadow: 0 4px 8px rgba(0, 0, 0, .12);
  border-radius: 8px;
  padding: 24px;
  &>.el-tabs__header {
    border: none;
    .el-tabs__nav {
      width: 100%;
      border: none;
    }
    .el-tabs__item {
      border: none;
      color:  #AAAAAA;
      border-bottom: 3px solid #324B4E;
      text-align: center;
      &.is-active {
        color: #fff;
        background: linear-gradient(360deg, #324B4E 0%, rgba(50, 75, 78, 0) 100%);
        border-bottom: 3px solid $theme-color-primary;
      }
    }
  }
  .el-tabs__content {
    overflow-y: auto;
    height: calc(100vh - 280px - #{$header-height});
  }
}
.description-image-box {
  margin: 20px auto;
  width: 660px;
  position: relative;
  text-align: center;
  &.space-between {
    display: flex;
    justify-content: space-between;
  }
}
</style>

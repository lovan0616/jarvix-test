<template>
  <div class="function-description">
    <h1 class="title">{{ $t('editing.functionDescription') }}</h1>
    <div class="function-table">
      <div class="function-table-head">
        <div
          @click="showBasic"
          :class="['function-table-head-cell', { 'head-active': tabBtn.basicBtn === true }]"
        >
          {{ $t('editing.basicIntroduce') }}
        </div>
        <div
          @click="showQuestion"
          :class="['function-table-head-cell', { 'head-active': tabBtn.questionBtn === true }]"
        >
          {{ $t('editing.questionAnalyzeUse') }}
        </div>
        <div
          @click="showPinboard"
          :class="['function-table-head-cell', { 'head-active': tabBtn.pinboardBtn === true }]"
        >
          {{ $t('editing.questionAnalyzeUse') }}
        </div>
        <div
          @click="showData"
          :class="['function-table-head-cell', { 'head-active': tabBtn.dataBtn === true }]"
        >
          {{ $t('nav.dataManagement') }}
        </div>
        <div class="function-table-head-cell"></div>
      </div>

      <div v-if="tabBtn.basicBtn === true" class="function-table-body">
        <div
          @click="toggleInterface"
          class="function-content-title"
        >
          <div>{{ $t('editing.interfaceDescription') }}</div>
          <svg-icon
            :class="['content-icon', { 'rotate': basicContent.isShowInterface === true }]"
            icon-class="dropdown"
          >
          </svg-icon>
        </div>
        <transition name="fade" mode="out-in">
          <div class="single-description" v-if="basicContent.isShowInterface">
            <div class="description-image-box">
              <img class="description-image" src="@/assets/images/functionDescription/basic-interface.png" :alt="$t('editing.interfaceDescription')">
              <div class="description-square first-interface-square"></div>
              <div class="description-text-box first-interface-box">
                <div class="description-space">Chatroom</div>
                <div class="description-round-empty"></div>
                <div class="description-line first-interface-line"></div>
                <div class="description-round-full"></div>
              </div>
              <div class="description-text-box second-interface-box">
                <div class="description-space">{{ $t('editing.hide') }}Chatroom</div>
                <div class="description-round-empty"></div>
                <div class="description-line second-interface-line"></div>
                <div class="description-round-full"></div>
              </div>
              <div class="description-square third-interface-square"></div>
              <div class="description-text-box third-interface-box">
                <div class="description-round-full"></div>
                <div class="description-line third-interface-line"></div>
                <div class="description-round-empty description-space"></div>
                <div>{{ $t('editing.guidingRow') }}</div>
              </div>
              <div class="description-square fouth-interface-square"></div>
              <div class="description-text-box fouth-interface-box">
                <div class="description-round-full"></div>
                <div class="description-line fouth-interface-line"></div>
                <div class="description-round-empty description-space"></div>
                <div>{{ $t('editing.mainLayout') }}</div>
              </div>
            </div>
          </div>
        </transition>
        <div
          @click="toggleGuiding"
          class="function-content-title"
        >
          <div>{{ $t('editing.guidingRowIntroduce') }}</div>
          <svg-icon
            :class="['content-icon', { 'rotate': basicContent.isShowGuiding === true }]"
            icon-class="dropdown"
          >
          </svg-icon>
        </div>
        <transition name="fade" mode="out-in">
          <div class="single-description" v-if="basicContent.isShowGuiding">
            <div class="description-image-box description-space-image">
              <img class="description-image" src="@/assets/images/functionDescription/basic-setting.png" :alt="$t('editing.settingFunctionMenu')">
              <div class="description-square first-menu-square"></div>
              <div class="description-text-box first-menu-box">
                <div class="description-round-full"></div>
                <div class="description-line first-menu-line"></div>
                <div class="description-round-empty description-space"></div>
                <div>{{ $t('editing.settingFunctionMenu') }}</div>
              </div>
            </div>
            <div class="description-image-box">
              <img class="description-image" src="@/assets/images/functionDescription/basic-account.png" :alt="$t('editing.accountFunctionMenu')">
              <div class="description-square second-menu-square"></div>
              <div class="description-text-box second-menu-box">
                <div class="description-round-full"></div>
                <div class="description-line second-menu-line"></div>
                <div class="description-round-empty description-space"></div>
                <div>{{ $t('editing.accountFunctionMenu') }}</div>
              </div>
            </div>
          </div>
        </transition>
        <div
          @click="toggleIndexPageFunction"
          class="function-content-title"
        >
          <div>{{ $t('editing.indexPageFunctionIntroduce') }}</div>
          <svg-icon
            :class="['content-icon', { 'rotate': basicContent.isShowIndexPageFunction === true }]"
            icon-class="dropdown"
          >
          </svg-icon>
        </div>
        <transition name="fade" mode="out-in">
          <div class="single-description" v-if="basicContent.isShowIndexPageFunction">
            <div class="description-image-box">
              <img class="description-image" src="@/assets/images/functionDescription/basic-interface.png" :alt="$t('editing.checkoutDataSheetDetail')">
              <div class="description-square first-index-square"></div>
              <div class="description-text-box first-index-box">
                <div class="description-round-full"></div>
                <div class="description-line first-index-line"></div>
                <div class="description-round-empty description-space"></div>
                <div class="description-text">{{ $t('editing.checkoutDataSheetDetail') }}</div>
              </div>
              <div class="description-square second-index-square"></div>
              <div class="description-text-box second-index-box">
                <div class="description-round-full"></div>
                <div class="description-line second-index-line"></div>
                <div class="description-round-empty description-space"></div>
                <div class="description-text">{{ $t('editing.systemLogQuestion') }}</div>
              </div>
            </div>
          </div>
        </transition>
      </div>

      <!-- 問題分析操作 -->

      <!-- 個人釘板使用 -->

      <div v-if="tabBtn.dataBtn === true" class="function-table-body">
        <div
          @click="toggleAddData"
          class="function-content-title"
        >
          <div>{{ $t('editing.howAddData') }}？</div>
          <svg-icon
            :class="['content-icon', { 'rotate': dataContent.isShowAddData === true }]"
            icon-class="dropdown"
          >
          </svg-icon>
        </div>
        <transition name="fade" mode="out-in">
          <div class="single-description" v-if="dataContent.isShowAddData">
            <div class="description-image-box description-space-image">
              <img class="description-image" src="@/assets/images/functionDescription/basic-setting.png" :alt="$t('editing.enterDataManage')">
              <div class="description-square first-data-square"></div>
              <div class="description-text-box first-data-box">
                <div class="description-round-full"></div>
                <div class="description-line first-data-line"></div>
                <div class="description-round-empty description-space"></div>
                <div class="description-space">Step1:<br>{{ $t('editing.enterDataManage') }}</div>
              </div>
            </div>
            <div class="description-image-box">
              <img class="description-image" src="@/assets/images/functionDescription/data-table-select.png" :alt="$t('editing.newDataSource')">
              <div class="description-square second-data-square"></div>
              <div class="description-text-box second-data-box">
                <div class="description-space description-text-right">Step2:<br>{{ $t('editing.newDataSource') }}</div>
                <div class="description-round-empty"></div>
                <div class="description-line second-data-line"></div>
                <div class="description-round-full"></div>
              </div>
            </div>
          </div>
        </transition>
        <div
          @click="toggleAddSheet"
          class="function-content-title"
        >
          <div>{{ $t('editing.enterDataManage') }}？</div>
          <svg-icon
            :class="['content-icon', { 'rotate': dataContent.isShowAddSheet === true }]"
            icon-class="dropdown"
          >
          </svg-icon>
        </div>
        <transition name="fade" mode="out-in">
          <div class="single-description" v-if="dataContent.isShowAddSheet">
            <div class="description-image-box description-space-image">
              <img class="description-image" src="@/assets/images/functionDescription/data-table-select.png" :alt="$t('editing.pickupData')">
              <div class="description-square first-sheet-square"></div>
              <div class="description-text-box first-sheet-box">
                <div class="description-space description-text-right">Step1:<br>{{ $t('editing.pickupData') }}</div>
                <div class="description-round-empty"></div>
                <div class="description-line first-sheet-line"></div>
                <div class="description-round-full"></div>
              </div>
            </div>
            <div class="description-image-box">
              <img class="description-image" src="@/assets/images/functionDescription/data-table.png" :alt="$t('editing.newTable')">
              <div class="description-square second-sheet-square"></div>
              <div class="description-text-box second-sheet-box">
                <div class="description-space description-text-right">Step2:<br>{{ $t('editing.newTable') }}</div>
                <div class="description-round-empty"></div>
                <div class="description-line second-sheet-line"></div>
                <div class="description-round-full"></div>
              </div>
            </div>
          </div>
        </transition>
        <div
          @click="toggleEditData"
          class="function-content-title"
        >
          <div>{{ $t('editing.howEditDataSheet') }}？</div>
          <svg-icon
            :class="['content-icon', { 'rotate': dataContent.isShowEditData === true }]"
            icon-class="dropdown"
          >
          </svg-icon>
        </div>
        <transition name="fade" mode="out-in">
          <div class="single-description" v-if="dataContent.isShowEditData">
            <div class="description-image-box description-space-image">
              <img class="description-image" src="@/assets/images/functionDescription/data-table.png" :alt="$t('editing.clickEditColumn')">
              <div class="description-square first-data-edit-square"></div>
              <div class="description-text-box first-data-edit-box">
                <div class="description-round-full"></div>
                <div class="description-line first-data-edit-line"></div>
                <div class="description-round-empty description-space"></div>
                <div>Step1:<br>{{ $t('editing.clickEditColumn') }}</div>
              </div>
            </div>
            <div class="description-image-box description-space-image">
              <img class="description-image" src="@/assets/images/functionDescription/data-sheet-table.png" :alt="$t('editing.clickEditColumn')">
              <div class="description-square second-data-edit-square"></div>
              <div class="description-text-box second-data-edit-box">
                <div class="description-round-full"></div>
                <div class="description-line second-data-edit-line"></div>
                <div class="description-round-empty description-space"></div>
                <div>Step2:<br>{{ $t('editing.clickEditColumn') }}</div>
              </div>
            </div>
            <div class="description-image-box description-space-image">
              <img class="description-image" src="@/assets/images/functionDescription/data-sheet-table-edit.png" :alt="$t('editing.editAlias')">
              <div class="description-square third-data-edit-square"></div>
              <div class="description-text-box third-data-edit-box">
                <div class="description-space description-text-right">Step3:<br>{{ $t('editing.editAlias') }}</div>
                <div class="description-round-empty"></div>
                <div class="description-line third-data-edit-line"></div>
                <div class="description-round-full"></div>
              </div>
              <div class="description-square forth-data-edit-square"></div>
              <div class="description-text-box forth-data-edit-box">
                <div class="description-round-full"></div>
                <div class="description-line forth-data-edit-line"></div>
                <div   class="description-round-empty description-space"></div>
                <div>Step3:<br>{{ $t('editing.confirmEdit') }}</div>
              </div>
            </div>
            <div class="description-image-box">
              <img class="description-image" src="@/assets/images/functionDescription/data-sheet-build.png" :alt="$t('editing.completeBuild')">
              <div class="description-square fifth-data-edit-square"></div>
              <div class="description-text-box fifth-data-edit-box">
                <div class="description-round-full"></div>
                <div class="description-line fifth-data-edit-line"></div>
                <div class="description-round-empty description-space"></div>
                <div class="description-space">Step4:<br>{{ $t('editing.completeBuild') }}</div>
              </div>
            </div>
          </div>
        </transition>
        <div
          @click="toggleConnectData"
          class="function-content-title"
        >
          <div>{{ $t('editing.howConnectDataSheet') }}？</div>
          <svg-icon
            :class="['content-icon', { 'rotate': dataContent.isShowConnectData === true }]"
            icon-class="dropdown"
          >
          </svg-icon>
        </div>
        <transition name="fade" mode="out-in">
          <div class="single-description" v-if="dataContent.isShowConnectData">
            <div class="description-image-box description-space-image">
              <img class="description-image" src="@/assets/images/functionDescription/data-table.png" :alt="$t('editing.clickDataSheetConnect')">
              <div class="description-square first-data-connect-square"></div>
              <div class="description-text-box first-data-connect-box">
                <div class="description-round-full"></div>
                <div class="description-line first-data-connect-line"></div>
                <div class="description-round-empty description-space"></div>
                <div>Step1:<br>{{ $t('editing.clickDataSheetConnect') }}</div>
              </div>
            </div>
            <div class="description-image-box description-space-image">
              <img class="description-image" src="@/assets/images/functionDescription/data-sheet-connect.png" :alt="$t('editing.addDataSheetConnect')">
              <div class="description-square second-data-connect-square"></div>
              <div class="description-text-box second-data-connect-box">
                <div class="description-space description-text-right">Step2:<br>{{ $t('editing.addDataSheetConnect') }}</div>
                <div class="description-round-empty"></div>
                <div class="description-line second-data-connect-line"></div>
                <div class="description-round-full"></div>
              </div>
            </div>
            <div class="description-image-box description-space-image">
              <img class="description-image" src="@/assets/images/functionDescription/data-sheet-connect-column.png" :alt="$t('editing.andConnectColumn')">
              <div class="description-square third-data-connect-square"></div>
              <div class="description-text-box third-data-connect-box">
                <div class="description-space description-text-right">Step3:<br>{{ $t('editing.slectDataSheet') }}<br>{{ $t('editing.andConnectColumn') }}</div>
                <div class="description-round-empty"></div>
                <div class="description-line third-data-connect-line"></div>
                <div class="description-round-full"></div>
              </div>
            </div>
            <div class="description-image-box description-space-image">
              <img class="description-image" src="@/assets/images/functionDescription/data-sheet-connect-store.png" :alt="$t('editing.storeSetting')">
              <div class="description-square fourth-data-connect-square"></div>
              <div class="description-text-box fourth-data-connect-box">
                <div class="description-round-full"></div>
                <div class="description-line fourth-data-connect-line"></div>
                <div class="description-round-empty description-space"></div>
                <div>Step4:<br>{{ $t('editing.storeSetting') }}</div>
              </div>
            </div>
          </div>
        </transition>
      </div>
    </div>
  </div>
</template>
<script>

export default {
  name: 'FunctionDescription',
  components: {

  },
  data () {
    return {
      tabBtn: {
        basicBtn: true,
        questionBtn: false,
        pinboardBtn: false,
        dataBtn: false
      },
      basicContent: {
        isShowInterface: false,
        isShowGuiding: false,
        isShowIndexPageFunction: false
      },
      questionContent: {},
      pinboardContent: {},
      dataContent: {
        isShowAddData: false,
        isShowAddSheet: false,
        isShowEditData: false,
        isShowConnectData: false
      }
    }
  },
  mounted () {

  },
  methods: {
    closeTab () {
      for (let index in this.tabBtn) {
        this.tabBtn[index] = false
      }
    },
    showBasic () {
      this.closeTab()
      this.tabBtn.basicBtn = true
    },
    showQuestion () {
      this.closeTab()
      this.tabBtn.questionBtn = true
    },
    showPinboard () {
      this.closeTab()
      this.tabBtn.pinboardBtn = true
    },
    showData () {
      this.closeTab()
      this.tabBtn.dataBtn = true
    },
    toggleInterface () {
      this.basicContent.isShowInterface = !this.basicContent.isShowInterface
    },
    toggleGuiding () {
      this.basicContent.isShowGuiding = !this.basicContent.isShowGuiding
    },
    toggleIndexPageFunction () {
      this.basicContent.isShowIndexPageFunction = !this.basicContent.isShowIndexPageFunction
    },
    // 問題分析操作
    // 個人釘板使用
    toggleAddData () {
      this.dataContent.isShowAddData = !this.dataContent.isShowAddData
    },
    toggleAddSheet () {
      this.dataContent.isShowAddSheet = !this.dataContent.isShowAddSheet
    },
    toggleEditData () {
      this.dataContent.isShowEditData = !this.dataContent.isShowEditData
    },
    toggleConnectData () {
      this.dataContent.isShowConnectData = !this.dataContent.isShowConnectData
    }
  }
}
</script>
<style lang="scss" scoped>

.function-description {

  .function-table {
    background: rgba(0, 0, 0, .55);
    box-shadow: 0px 4px 8px rgba(0, 0, 0, .12);
    border-radius: 8px;
    padding: 24px;

    &-head {
      display: flex;
    }

    &-head-cell {
      padding: 10px 0px;
      border-bottom: 3px solid #324B4E;
      text-align: center;
      cursor: pointer;
      color: #AAA;
      transition: all 0.3s;

      &:not(:last-child) {
        width: 120px;
        margin-right: 2px;
      }

      &:last-child {
        flex: 1;
      }
    }

    .head-active {
      background: linear-gradient(360deg, #324B4E 0%, rgba(50, 75, 78, 0) 100%);
      border-bottom: 3px solid #4DE2F0;
      color: #FFF;
    }

    &-body {
      padding-top: 10px;
    }

    .function-content-title {
      display: flex;
      justify-content: space-between;
      padding: 10px 0px 10px 10px;
      border-bottom: 1px solid #52696A;
      cursor: pointer;

      .content-icon {
        margin-right: 10px;
        transition: transform 0.3s;
      }

      .rotate {
        transform: rotate(180deg);
      }
    }
  }

  .single-description {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    padding: 37px 0px;

    .description-image-box {
      position: relative;
      width: 660px;
    }

    .description-image {

    }

    .description-text-box {
      position: absolute;
      display: flex;
      align-items: center;
      color: #FFDF6F;
    }

    .description-space {
        margin-right: 4px;
    }

    .description-space-image {
        margin-bottom: 53px;
    }

    .description-round-empty {
      width: 8px;
      height: 8px;
      border: 1px solid #FFDF6F;
      border-radius: 99px;
    }

    .description-line {
      height: 1px;
      background: #FFDF6F;
    }

    .description-round-full {
      width: 8px;
      height: 8px;
      background: #FFDF6F;
      border-radius: 99px;
    }

    .description-square {
      position: absolute;
      border: 3px solid #FFDF6F;
    }

    .description-text {
        width: 100px;
    }

    .description-text-right {
      text-align: right;
    }

    // interface
    .first-interface-box {
      left: -120px;
      top: 10px;
    }

    .first-interface-square {
      width: 184px;
      height: 100%;
      left: 0px;
      top: 0px;
    }

    .first-interface-line {
      width: 15px;
    }

    .second-interface-box {
      left: -156px;
      top: 148px;
    }

    .second-interface-line {
      width: 185px;
    }

    .third-interface-box {
      right: -85px;
      top: 0px;
    }

    .third-interface-square {
      width: 187px;
      height: 28px;
      right: 0px;
      top: 0px;
    }

    .third-interface-line {
      width: 15px;
    }

    .fouth-interface-box {
      right: -84px;
      top: 68px;
    }

    .fouth-interface-square {
      width: 442px;
      height: 294px;
      right: 16px;
      top: 30px;
    }

    .fouth-interface-line {
      width: 29px;
    }

    // menu

    .first-menu-box {
      right: -144px;
      top: 68px;
    }

    .first-menu-square {
      width: 202px;
      height: 220px;
      right: 105px;
      top: 7px;
    }

    .first-menu-line {
      width: 126px;
    }

    .second-menu-box {
      right: -138px;
      top: 55px;
    }

    .second-menu-square {
      width: 185px;
      height: 179px;
      right: 26px;
      top: 6px;
    }

    .second-menu-line {
      width: 42px;
    }

    // index page
    .first-index-box {
      right: -130px;
      top: 53px;
    }

    .first-index-square {
      width: 441px;
      height: 113px;
      right: 18px;
      top: 32px;
    }

    .first-index-line {
      width: 28px;
    }

    .second-index-box {
      right: -131px;
      top: 183px;
    }

    .second-index-square {
      width: 442px;
      height: 172px;
      right: 17px;
      top: 153px;
    }

    .second-index-line {
      width: 28px;
    }

    // data
    .first-data-box {
      right: -141px;
      top: 43px;
    }

    .first-data-square {
      width: 166px;
      height: 43px;
      right: 119px;
      top: 46px;
    }

    .first-data-line {
      width: 134px;
    }

    .second-data-box {
      left: -122px;
      top: 63px;
    }

    .second-data-square {
      width: 66px;
      height: 27px;
      left: 24px;
      top: 74px;
    }

    .second-data-line {
      width: 40px;
    }

    .first-sheet-box {
      left: -125px;
      top: 179px;
    }

    .first-sheet-square {
      width: 74px;
      height: 27px;
      left: 28px;
      top: 189px;
    }

    .first-sheet-line {
      width: 48px;
    }

    .second-sheet-box {
      left: -123px;
      top: 63px;
    }

    .second-sheet-square {
      width: 70px;
      height: 27px;
      left: 22px;
      top: 74px;
    }

    .second-sheet-line {
      width: 40px;
    }

    .first-data-edit-box {
      right: -137px;
      top: 105px;
    }

    .first-data-edit-square {
      width: 41px;
      height: 21px;
      right: 116px;
      top: 118px;
    }

    .first-data-edit-line {
      width: 131px;
    }

    .second-data-edit-box {
      right: -138px;
      top: 49px;
    }

    .second-data-edit-square {
      width: 47px;
      height: 20px;
      right: 201px;
      top: 63px;
    }

    .second-data-edit-line {
      width: 217px;
    }

    .third-data-edit-box {
      left: -108px;
      top: 49px;
    }

    .third-data-edit-square {
      width: 66px;
      height: 22px;
      left: 263px;
      top: 62px;
    }

    .third-data-edit-line {
      width: 283px;
    }

    .forth-data-edit-box {
      right: -104px;
      top: 49px;
    }

    .forth-data-edit-square {
      width: 33px;
      height: 20px;
      right: 206px;
      top: 63px;
    }

    .forth-data-edit-line {
      width: 222px;
    }

    .fifth-data-edit-box {
      right: -110px;
      top: 4px;
    }

    .fifth-data-edit-square {
      width: 46px;
      height: 25px;
      right: 173px;
      top: 15px;
    }

    .fifth-data-edit-line {
      width: 191px;
    }

    // connect
    .first-data-connect-box {
      right: -158px;
      top: 64px;
    }

    .first-data-connect-square {
      width: 62px;
      height: 21px;
      right: 96px;
      top: 77px;
    }

    .first-data-connect-line {
      width: 112px;
    }

    .second-data-connect-box {
      left: -154px;
      top: 30px;
    }

    .second-data-connect-square {
      width: 59px;
      height: 28px;
      left: 176px;
      top: 40px;
    }

    .second-data-connect-line {
      width: 191px;
    }

    .third-data-connect-box {
      left: -140px;
      top: 90px;
    }

    .third-data-connect-square {
      width: 120px;
      height: 51px;
      left: 194px;
      top: 102px;
    }

    .third-data-connect-line {
      width: 211px;
    }

    .fourth-data-connect-box {
      right: -104px;
      top: 159px;
    }

    .fourth-data-connect-square {
      width: 45px;
      height: 28px;
      right: 174px;
      top: 168px;
    }

    .fourth-data-connect-line {
      width: 190px;
    }
  }
}

</style>

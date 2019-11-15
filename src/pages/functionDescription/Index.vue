<template>
  <div class="function-description">
    <h1 class="title">{{ $t('editing.functionDescription') }}</h1>
    <div class="function-table">
      <div class="function-table-head">
        <div
          @click="showBasic"
          :class="['function-table-head-cell', { 'head-active': tabBtn.basicBtn === true }]"
        >
          {{ $t('description.basicIntroduce') }}
        </div>
        <div
          @click="showQuestion"
          :class="['function-table-head-cell', { 'head-active': tabBtn.questionBtn === true }]"
        >
          {{ $t('description.questionAnalyzeUse') }}
        </div>
        <div
          @click="showPinboard"
          :class="['function-table-head-cell', { 'head-active': tabBtn.pinboardBtn === true }]"
        >
          {{ $t('description.questionAnalyzeUse') }}
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
          <div>{{ $t('description.interfaceDescription') }}</div>
          <svg-icon
            :class="['content-icon', { 'rotate': basicContent.isShowInterface === true }]"
            icon-class="dropdown"
          >
          </svg-icon>
        </div>
        <transition name="fade" mode="out-in">
          <div class="single-description" v-if="basicContent.isShowInterface">
            <div class="description-image-box">
              <img class="description-image" src="@/assets/images/functionDescription/basic-interface.png" :alt="$t('description.interfaceDescription')">
              <div class="description-square first-interface-square"></div>
              <row-description
                :className="'first-interface-box'"
                :lineClassName="'first-interface-line'"
                :text="'Chatroom'"
              >
              </row-description>
              <row-description
                :className="'second-interface-box'"
                :lineClassName="'second-interface-line'"
                :text="`${langDescriptionHide}Chatroom`"
              >
              </row-description>

              <div class="description-square third-interface-square"></div>
              <row-description
                :positionLeft="false"
                :className="'third-interface-box'"
                :lineClassName="'third-interface-line'"
                :text="$t('description.guidingRow')"
              >
              </row-description>
              <div class="description-square fouth-interface-square"></div>
              <row-description
                :positionLeft="false"
                :className="'fouth-interface-box'"
                :lineClassName="'fouth-interface-line'"
                :text="$t('description.mainLayout')"
              >
              </row-description>
            </div>
          </div>
        </transition>
        <div
          @click="toggleGuiding"
          class="function-content-title"
        >
          <div>{{ $t('description.guidingRowIntroduce') }}</div>
          <svg-icon
            :class="['content-icon', { 'rotate': basicContent.isShowGuiding === true }]"
            icon-class="dropdown"
          >
          </svg-icon>
        </div>
        <transition name="fade" mode="out-in">
          <div class="single-description" v-if="basicContent.isShowGuiding">
            <div class="description-image-box description-space-image">
              <img class="description-image" src="@/assets/images/functionDescription/basic-setting.png" :alt="$t('description.settingFunctionMenu')">
              <div class="description-square first-menu-square"></div>
              <row-description
                :positionLeft="false"
                :className="'first-menu-box'"
                :lineClassName="'first-menu-line'"
                :text="$t('description.settingFunctionMenu')"
              >
              </row-description>
            </div>
            <div class="description-image-box">
              <img class="description-image" src="@/assets/images/functionDescription/basic-account.png" :alt="$t('description.accountFunctionMenu')">
              <div class="description-square second-menu-square"></div>
              <row-description
                :positionLeft="false"
                :className="'second-menu-box'"
                :lineClassName="'second-menu-line'"
                :text="$t('description.accountFunctionMenu')"
              >
              </row-description>
            </div>
          </div>
        </transition>
        <div
          @click="toggleIndexPageFunction"
          class="function-content-title"
        >
          <div>{{ $t('description.indexPageFunctionIntroduce') }}</div>
          <svg-icon
            :class="['content-icon', { 'rotate': basicContent.isShowIndexPageFunction === true }]"
            icon-class="dropdown"
          >
          </svg-icon>
        </div>
        <transition name="fade" mode="out-in">
          <div class="single-description" v-if="basicContent.isShowIndexPageFunction">
            <div class="description-image-box">
              <img class="description-image" src="@/assets/images/functionDescription/basic-interface.png" :alt="$t('description.checkoutDataSheetDetail')">
              <div class="description-square first-index-square"></div>
              <row-description
                :positionLeft="false"
                :className="'first-index-box'"
                :lineClassName="'first-index-line'"
                :text="$t('description.checkoutDataSheetDetail')"
                :twoRow="true"
              >
              </row-description>
              <div class="description-square second-index-square"></div>
              <row-description
                :positionLeft="false"
                :className="'second-index-box'"
                :lineClassName="'second-index-line'"
                :text="$t('description.systemLogQuestion')"
                :twoRow="true"
              >
              </row-description>
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
          <div>{{ $t('description.howAddData') }}？</div>
          <svg-icon
            :class="['content-icon', { 'rotate': dataContent.isShowAddData === true }]"
            icon-class="dropdown"
          >
          </svg-icon>
        </div>
        <transition name="fade" mode="out-in">
          <div class="single-description" v-if="dataContent.isShowAddData">
            <div class="description-image-box description-space-image">
              <img class="description-image" src="@/assets/images/functionDescription/basic-setting.png" :alt="$t('description.enterDataManage')">
              <div class="description-square first-data-square"></div>
              <row-description
                :positionLeft="false"
                :className="'first-data-box'"
                :lineClassName="'first-data-line'"
                :text="$t('description.enterDataManage')"
                :step="'Step1:'"
              >
              </row-description>
            </div>
            <div class="description-image-box">
              <img class="description-image" src="@/assets/images/functionDescription/data-table-select.png" :alt="$t('editing.newDataSource')">
              <div class="description-square second-data-square"></div>
              <row-description
                :className="'second-data-box'"
                :lineClassName="'second-data-line'"
                :text="$t('editing.newDataSource')"
                :step="'Step2:'"
              >
              </row-description>
            </div>
          </div>
        </transition>
        <div
          @click="toggleAddSheet"
          class="function-content-title"
        >
          <div>{{ $t('description.enterDataManage') }}？</div>
          <svg-icon
            :class="['content-icon', { 'rotate': dataContent.isShowAddSheet === true }]"
            icon-class="dropdown"
          >
          </svg-icon>
        </div>
        <transition name="fade" mode="out-in">
          <div class="single-description" v-if="dataContent.isShowAddSheet">
            <div class="description-image-box description-space-image">
              <img class="description-image" src="@/assets/images/functionDescription/data-table-select.png" :alt="$t('description.pickupData')">
              <div class="description-square first-sheet-square"></div>
              <row-description
                :className="'first-sheet-box'"
                :lineClassName="'first-sheet-line'"
                :text="$t('description.pickupData')"
                :step="'Step1:'"
              >
              </row-description>
            </div>
            <div class="description-image-box">
              <img class="description-image" src="@/assets/images/functionDescription/data-table.png" :alt="$t('editing.newTable')">
              <div class="description-square second-sheet-square"></div>
              <row-description
                :className="'second-sheet-box'"
                :lineClassName="'second-sheet-line'"
                :text="$t('editing.newTable')"
                :step="'Step2:'"
              >
              </row-description>
            </div>
          </div>
        </transition>
        <div
          @click="toggleEditData"
          class="function-content-title"
        >
          <div>{{ $t('description.howEditDataSheet') }}？</div>
          <svg-icon
            :class="['content-icon', { 'rotate': dataContent.isShowEditData === true }]"
            icon-class="dropdown"
          >
          </svg-icon>
        </div>
        <transition name="fade" mode="out-in">
          <div class="single-description" v-if="dataContent.isShowEditData">
            <div class="description-image-box description-space-image">
              <img class="description-image" src="@/assets/images/functionDescription/data-table.png" :alt="$t('description.clickEditColumn')">
              <div class="description-square first-data-edit-square"></div>
              <row-description
                :positionLeft="false"
                :className="'first-data-edit-box'"
                :lineClassName="'first-data-edit-line'"
                :text="$t('description.clickEditColumn')"
                :step="'Step1:'"
              >
              </row-description>
            </div>
            <div class="description-image-box description-space-image">
              <img class="description-image" src="@/assets/images/functionDescription/data-sheet-table.png" :alt="$t('description.clickEditColumn')">
              <div class="description-square second-data-edit-square"></div>
              <row-description
                :positionLeft="false"
                :className="'second-data-edit-box'"
                :lineClassName="'second-data-edit-line'"
                :text="$t('description.clickEditColumn')"
                :step="'Step2:'"
              >
              </row-description>
            </div>
            <div class="description-image-box description-space-image">
              <img class="description-image" src="@/assets/images/functionDescription/data-sheet-table-edit.png" :alt="$t('description.editAlias')">
              <div class="description-square third-data-edit-square"></div>
              <row-description
                :className="'third-data-edit-box'"
                :lineClassName="'third-data-edit-line'"
                :text="$t('description.editAlias')"
                :step="'Step3:'"
              >
              </row-description>
              <div class="description-square forth-data-edit-square"></div>
              <row-description
                :positionLeft="false"
                :className="'forth-data-edit-box'"
                :lineClassName="'forth-data-edit-line'"
                :text="$t('description.confirmEdit')"
                :step="'Step3:'"
              >
              </row-description>
            </div>
            <div class="description-image-box">
              <img class="description-image" src="@/assets/images/functionDescription/data-sheet-build.png" :alt="$t('description.completeBuild')">
              <div class="description-square fifth-data-edit-square"></div>
              <row-description
                :positionLeft="false"
                :className="'fifth-data-edit-box'"
                :lineClassName="'fifth-data-edit-line'"
                :text="$t('description.completeBuild')"
                :step="'Step4:'"
              >
              </row-description>
            </div>
          </div>
        </transition>
        <div
          @click="toggleConnectData"
          class="function-content-title"
        >
          <div>{{ $t('description.howConnectDataSheet') }}？</div>
          <svg-icon
            :class="['content-icon', { 'rotate': dataContent.isShowConnectData === true }]"
            icon-class="dropdown"
          >
          </svg-icon>
        </div>
        <transition name="fade" mode="out-in">
          <div class="single-description" v-if="dataContent.isShowConnectData">
            <div class="description-image-box description-space-image">
              <img class="description-image" src="@/assets/images/functionDescription/data-table.png" :alt="$t('description.clickDataSheetConnect')">
              <div class="description-square first-data-connect-square"></div>
              <row-description
                :positionLeft="false"
                :className="'first-data-connect-box'"
                :lineClassName="'first-data-connect-line'"
                :text="$t('description.clickDataSheetConnect')"
                :step="'Step1:'"
              >
              </row-description>
            </div>
            <div class="description-image-box description-space-image">
              <img class="description-image" src="@/assets/images/functionDescription/data-sheet-connect.png" :alt="$t('description.addDataSheetConnect')">
              <div class="description-square second-data-connect-square"></div>
              <row-description
                :className="'second-data-connect-box'"
                :lineClassName="'second-data-connect-line'"
                :text="$t('description.addDataSheetConnect')"
                :step="'Step2:'"
              >
              </row-description>
            </div>
            <div class="description-image-box description-space-image">
              <img class="description-image" src="@/assets/images/functionDescription/data-sheet-connect-column.png" :alt="$t('description.andConnectColumn')">
              <div class="description-square third-data-connect-square"></div>
              <row-description
                :className="'third-data-connect-box'"
                :lineClassName="'third-data-connect-line'"
                :text="$t('description.slectDataSheet')"
                :step="'Step3:'"
              >
              </row-description>
            </div>
            <div class="description-image-box description-space-image">
              <img class="description-image" src="@/assets/images/functionDescription/data-sheet-connect-store.png" :alt="$t('description.storeSetting')">
              <div class="description-square fourth-data-connect-square"></div>
              <row-description
                :positionLeft="false"
                :className="'fourth-data-connect-box'"
                :lineClassName="'fourth-data-connect-line'"
                :text="$t('description.storeSetting')"
                :step="'Step4:'"
              >
              </row-description>
            </div>
          </div>
        </transition>
      </div>
    </div>
  </div>
</template>
<script>
import rowDescription from './components/rowDescription'
export default {
  name: 'FunctionDescription',
  components: {
    rowDescription
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
      },
      langDescriptionHide: this.$t('description.hide')
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

    .first-interface-square {
      width: 184px;
      height: 100%;
      left: 0px;
      top: 0px;
    }

    .third-interface-square {
      width: 187px;
      height: 28px;
      right: 0px;
      top: 0px;
    }

    .fouth-interface-square {
      width: 442px;
      height: 294px;
      right: 16px;
      top: 30px;
    }

    // menu

    .first-menu-square {
      width: 202px;
      height: 220px;
      right: 105px;
      top: 7px;
    }

    .second-menu-square {
      width: 185px;
      height: 179px;
      right: 26px;
      top: 6px;
    }

    // index page

    .first-index-square {
      width: 441px;
      height: 113px;
      right: 18px;
      top: 32px;
    }

    .second-index-square {
      width: 442px;
      height: 172px;
      right: 17px;
      top: 153px;
    }

    // data

    .first-data-square {
      width: 166px;
      height: 43px;
      right: 119px;
      top: 46px;
    }

    .second-data-square {
      width: 66px;
      height: 27px;
      left: 24px;
      top: 74px;
    }

    .first-sheet-square {
      width: 74px;
      height: 27px;
      left: 28px;
      top: 189px;
    }

    .second-sheet-square {
      width: 70px;
      height: 27px;
      left: 22px;
      top: 74px;
    }

    .first-data-edit-square {
      width: 41px;
      height: 21px;
      right: 116px;
      top: 118px;
    }

    .second-data-edit-square {
      width: 47px;
      height: 20px;
      right: 201px;
      top: 63px;
    }

    .third-data-edit-square {
      width: 66px;
      height: 22px;
      left: 263px;
      top: 62px;
    }

    .forth-data-edit-square {
      width: 33px;
      height: 20px;
      right: 206px;
      top: 63px;
    }

    .fifth-data-edit-square {
      width: 46px;
      height: 25px;
      right: 173px;
      top: 15px;
    }

    // connect

    .first-data-connect-square {
      width: 62px;
      height: 21px;
      right: 96px;
      top: 77px;
    }

    .second-data-connect-square {
      width: 59px;
      height: 28px;
      left: 176px;
      top: 40px;
    }

    .third-data-connect-square {
      width: 120px;
      height: 51px;
      left: 194px;
      top: 102px;
    }

    .fourth-data-connect-square {
      width: 45px;
      height: 28px;
      right: 174px;
      top: 168px;
    }
  }
}

</style>

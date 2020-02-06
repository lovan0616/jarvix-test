<template>
  <div class="function-description">
    <h1 class="title">{{ $t('editing.functionDescription') }}</h1>
    <div class="function-table">
      <div class="function-table-head">
        <div
          @click="showBasic"
          :class="['function-table-head-cell', { 'head-active': tabBtn.basicBtn }]"
        >
          {{ $t('description.basicIntroduce') }}
        </div>
        <div
          @click="showQuestion"
          :class="['function-table-head-cell', { 'head-active': tabBtn.questionBtn }]"
        >
          {{ $t('description.questionAnalyzeUse') }}
        </div>
        <div
          @click="showPinboard"
          :class="['function-table-head-cell', { 'head-active': tabBtn.pinboardBtn }]"
        >
          {{ $t('description.personalPinboard') }}
        </div>
        <div
          @click="showData"
          :class="['function-table-head-cell', { 'head-active': tabBtn.dataBtn }]"
        >
          {{ $t('nav.dataManagement') }}
        </div>
        <div class="function-table-head-cell"></div>
      </div>

      <div v-if="tabBtn.basicBtn " class="function-table-body">
        <div
          @click="toggleInterface"
          class="function-content-title"
        >
          <div>{{ $t('description.interfaceDescription') }}</div>
          <svg-icon
            :class="['content-icon', { 'rotate': basicContent.isShowInterface }]"
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
                class="first-interface-box"
                :lineClassName="'first-interface-line'"
                :text="'Chatroom'"
              >
              </row-description>
              <row-description
                class="second-interface-box"
                :lineClassName="'second-interface-line'"
                :text="`${langDescriptionHide}Chatroom`"
              >
              </row-description>

              <div class="description-square third-interface-square"></div>
              <row-description
                :positionLeft="false"
                class="third-interface-box"
                :lineClassName="'third-interface-line'"
                :text="$t('description.guidingRow')"
              >
              </row-description>
              <div class="description-square fouth-interface-square"></div>
              <row-description
                :positionLeft="false"
                class="fouth-interface-box"
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
            :class="['content-icon', { 'rotate': basicContent.isShowGuiding }]"
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
                class="first-menu-box"
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
                class="second-menu-box"
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
            :class="['content-icon', { 'rotate': basicContent.isShowIndexPageFunction }]"
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
                class="first-index-box"
                :lineClassName="'first-index-line'"
                :text="$t('description.checkoutDataSheetDetail')"
              >
              </row-description>
              <div class="description-square second-index-square"></div>
              <row-description
                :positionLeft="false"
                class="second-index-box"
                :lineClassName="'second-index-line'"
                :text="$t('description.systemLogQuestion')"
              >
              </row-description>
            </div>
          </div>
        </transition>
      </div>

      <!-- 問題分析操作 -->

      <div v-if="tabBtn.questionBtn" class="function-table-body">
        <div
          @click="toggleAskQuestion"
          class="function-content-title"
        >
          <div>{{ $t('description.howToAsk') }}</div>
          <svg-icon
            :class="['content-icon', { 'rotate': questionContent.isShowAskQuestion }]"
            icon-class="dropdown"
          >
          </svg-icon>
        </div>
        <transition name="fade" mode="out-in">
          <div class="single-description" v-if="questionContent.isShowAskQuestion">
            <div class="description-image-box">
              <img class="description-image" src="@/assets/images/functionDescription/question-recommend.png" :alt="$t('description.questionClick')">
              <div class="description-square first-ask-square"></div>
              <row-description
                class="first-ask-box"
                :lineClassName="'first-ask-line'"
                :text="$t('description.questionClick')"
              >
              </row-description>
              <div class="description-square second-ask-square"></div>
              <row-description
                :positionLeft="false"
                class="second-ask-box"
                :lineClassName="'second-ask-line'"
                :text="$t('description.questionInput')"
              >
              </row-description>
            </div>
          </div>
        </transition>
        <div
          @click="toggleSearchQuestion"
          class="function-content-title"
        >
          <div>{{ $t('description.howToSearchAssist') }}</div>
          <svg-icon
            :class="['content-icon', { 'rotate': questionContent.isShowSearchQuestion }]"
            icon-class="dropdown"
          >
          </svg-icon>
        </div>
        <transition name="fade" mode="out-in">
          <div class="single-description" v-if="questionContent.isShowSearchQuestion">
            <!-- <div class="description-inner-text">{{ $t('description.activateHint') }}</div>
            <div class="description-row-image-box description-space-image">
              <img class="description-row-image" src="@/assets/images/functionDescription/question-hint.png" :alt="$t('description.howToSearchAssist')">
              <div class="description-square first-assist-square"></div>
              <row-description
                :positionLeft="false"
                class="first-assist-box"
                :lineClassName="'first-assist-line'"
                :text="'Step1:<br>' + $t('description.inputKeyWord')"
              >
              </row-description>
              <img src="@/assets/images/functionDescription/question-hint.png" :alt="$t('description.settingFunctionMenu')">
              <div class="description-square second-assist-square"></div>
              <row-description
                :positionLeft="false"
                class="second-assist-box"
                :lineClassName="'second-assist-line'"
                :text="'Step2:<br>' + $t('description.questionHint')"
              >
              </row-description>
            </div> -->
            <div class="description-inner-text">{{ $t('description.openQuestionDescription') }}</div>
            <div class="description-row-image-box description-space-image">
              <img class="description-row-image" src="@/assets/images/functionDescription/question-recommend.png" :alt="$t('description.clickOpenQuestion')">
              <div class="description-square third-assist-square"></div>
              <row-description
                :positionLeft="false"
                class="third-assist-box"
                :lineClassName="'third-assist-line'"
                :text="'Step1:<br>' + $t('description.clickOpenQuestion')"
              >
              </row-description>
              <img src="@/assets/images/functionDescription/question-description.png" :alt="$t('description.questionDescriptionContent')">
              <div class="description-square fourth-assist-square"></div>
              <row-description
                :positionLeft="false"
                class="fourth-assist-box"
                :lineClassName="'fourth-assist-line'"
                :text="'Step2:<br>' + $t('description.questionDescriptionContent')"
              >
              </row-description>
            </div>

          </div>
        </transition>
        <div
          @click="toggleAnalyzeResult"
          class="function-content-title"
        >
          <div>{{ $t('description.analyzeResultDescription') }}</div>
          <svg-icon
            :class="['content-icon', { 'rotate': questionContent.isShowAnalyzeResult }]"
            icon-class="dropdown"
          >
          </svg-icon>
        </div>
        <transition name="fade" mode="out-in">
          <div class="single-description" v-if="questionContent.isShowAnalyzeResult">
            <div class="description-image-box">
              <img class="description-image" src="@/assets/images/functionDescription/question-result.png" :alt="$t('description.analyzeResultDescription')">
              <!-- <div class="description-square first-result-square"></div>
              <row-description
                class="first-result-box"
                :lineClassName="'first-result-line'"
                :text="$t('description.systemResponseResult')"
              >
              </row-description> -->
              <div class="description-square second-result-square"></div>
              <row-description
                :positionLeft="false"
                class="second-result-box"
                :lineClassName="'second-result-line'"
                :text="$t('description.questionAnalyzeDetail')"
              >
              </row-description>
            </div>
          </div>
        </transition>

        <div
          @click="toggleDeepQuestion"
          class="function-content-title"
        >
          <div>{{ $t('description.howToDeepen') }}</div>
          <svg-icon
            :class="['content-icon', { 'rotate': questionContent.isShowDeepQuestion }]"
            icon-class="dropdown"
          >
          </svg-icon>
        </div>
        <transition name="fade" mode="out-in">
          <div class="single-description" v-if="questionContent.isShowDeepQuestion">
            <div class="description-image-box">
              <img class="description-image" src="@/assets/images/functionDescription/question-deepen.png" :alt="$t('description.systemRecommendQuestion')">
              <div class="description-square first-deep-square"></div>
              <row-description
                class="first-deep-box"
                :lineClassName="'first-deep-line'"
                :text="$t('description.systemRecommendQuestion')"
              >
              </row-description>
              <div class="description-square second-deep-square"></div>
              <row-description
                :positionLeft="false"
                class="second-deep-box"
                :lineClassName="'second-deep-line'"
                :text="$t('description.systemTargetFace')"
              >
              </row-description>
              <div class="description-square third-deep-square"></div>
              <row-description
                :positionLeft="false"
                class="third-deep-box"
                :lineClassName="'third-deep-line'"
                :text="$t('description.systemRecommendQuestion')"
              >
              </row-description>
            </div>
          </div>
        </transition>
      </div>

      <!-- 個人釘板使用 -->

      <div v-if="tabBtn.pinboardBtn" class="function-table-body">
        <div
          @click="toggleAddPinboard"
          class="function-content-title"
        >
          <div>{{ $t('description.howToAddPinboard') }}</div>
          <svg-icon
            :class="['content-icon', { 'rotate': pinboardContent.isShowAddPinboard }]"
            icon-class="dropdown"
          >
          </svg-icon>
        </div>
        <transition name="fade" mode="out-in">
          <div class="single-description" v-if="pinboardContent.isShowAddPinboard">
            <div class="description-image-box description-space-image">
              <img class="description-image" src="@/assets/images/functionDescription/pinboard-click-board.png" :alt="$t('description.clickPinboard')">
              <div class="description-square first-pinboard-square"></div>
              <row-description
                :positionLeft="false"
                class="first-pinboard-box"
                :lineClassName="'first-pinboard-line'"
                :text="'Step1:<br>' + $t('description.clickPinboard')"
              >
              </row-description>
            </div>
            <div class="description-image-box description-space-image">
              <img class="description-image" src="@/assets/images/functionDescription/pinboard-select-class.png" :alt="$t('description.selectPinboardClass')">
              <div class="description-square second-pinboard-square"></div>
              <row-description
                :positionLeft="false"
                class="second-pinboard-box"
                :lineClassName="'second-pinboard-line'"
                :text="'Step2:<br>' + $t('description.selectPinboardClass')"
              >
              </row-description>
            </div>
            <div class="description-image-box">
              <img class="description-image" src="@/assets/images/functionDescription/pinboard-complete-cancel.png" :alt="$t('description.pinboardCompleteCancel')">
              <div class="description-square third-pinboard-square"></div>
              <row-description
                :positionLeft="false"
                class="third-pinboard-box"
                :lineClassName="'third-pinboard-line'"
                :text="'Step3:<br>' + $t('description.pinboardCompleteCancel')"
              >
              </row-description>
            </div>
          </div>
        </transition>
        <div
          @click="toggleManageClass"
          class="function-content-title"
        >
          <div>{{ $t('description.howToClassManage') }}</div>
          <svg-icon
            :class="['content-icon', { 'rotate': pinboardContent.isShowManageClass }]"
            icon-class="dropdown"
          >
          </svg-icon>
        </div>
        <transition name="fade" mode="out-in">
          <div class="single-description" v-if="pinboardContent.isShowManageClass">
            <div class="description-image-box description-space-image">
              <img class="description-image" src="@/assets/images/functionDescription/pinboard-enter-board.png" :alt="$t('description.enterPersonalPinboard')">
              <div class="description-square first-class-square"></div>
              <row-description
                :positionLeft="false"
                class="first-class-box"
                :lineClassName="'first-class-line'"
                :text="'Step1:<br>' + $t('description.enterPersonalPinboard')"
              >
              </row-description>
            </div>
            <div class="description-image-box description-space-image">
              <img class="description-image" src="@/assets/images/functionDescription/pinboard-add-board.png" :alt="$t('description.enableAddClass')">
              <div class="description-square second-class-square"></div>
              <row-description
                class="second-class-box"
                :lineClassName="'second-class-line'"
                :text="'Step2:<br>' + $t('description.enableAddClass')"
              >
              </row-description>
            </div>
            <div class="description-image-box">
              <img class="description-image" src="@/assets/images/functionDescription/pinboard-select-menu.png" :alt="$t('description.classFunctionMenu')">
              <div class="description-square third-class-square"></div>
              <row-description
                class="third-class-box"
                :lineClassName="'third-class-line'"
                :text="'Step3:<br>' + $t('description.classFunctionMenu')"
              >
              </row-description>
            </div>
          </div>
        </transition>

        <div
          @click="toggleSharePinboard"
          class="function-content-title"
        >
          <div>{{ $t('description.howToShare') }}</div>
          <svg-icon
            :class="['content-icon', { 'rotate': pinboardContent.isShowSharePinboard }]"
            icon-class="dropdown"
          >
          </svg-icon>
        </div>
        <transition name="fade" mode="out-in">
          <div class="single-description" v-if="pinboardContent.isShowSharePinboard">
            <div class="description-inner-text">{{ $t('description.sharePinboardContent') }}</div>
            <div class="description-image-box description-space-image">
              <img class="description-image" src="@/assets/images/functionDescription/pinboard-select-menu.png" :alt="$t('description.clickMenuShare')">
              <div class="description-square first-share-square"></div>
              <row-description
                class="first-share-box"
                :lineClassName="'first-share-line'"
                :text="'Step1:<br>' + $t('description.clickMenuShare')"
              >
              </row-description>
            </div>
            <div class="description-image-box description-space-image">
              <img class="description-image" src="@/assets/images/functionDescription/pinboard-share-dialog.png" :alt="$t('description.shareLink')">
              <div class="description-square second-share-square"></div>
              <row-description
                class="second-share-box"
                :lineClassName="'second-share-line'"
                :text="'Step2:<br>' + $t('description.shareLink')"
              >
              </row-description>
            </div>
            <div class="description-inner-text">{{ $t('description.shareSinglePinboard') }}</div>
            <div class="description-image-box description-space-image">
              <img class="description-image" src="@/assets/images/functionDescription/pinboard-select-single-class.png" :alt="$t('description.clickSingleClass')">
              <div class="description-square third-share-square"></div>
              <row-description
                class="third-share-box"
                :lineClassName="'third-share-line'"
                :text="'Step1:<br>' + $t('description.clickSingleClass')"
              >
              </row-description>
            </div>
            <div class="description-image-box description-space-image">
              <img class="description-image" src="@/assets/images/functionDescription/pinboard-click-share.png" :alt="$t('description.clickShare')">
              <div class="description-square fourth-share-square"></div>
              <row-description
                :positionLeft="false"
                class="fourth-share-box"
                :lineClassName="'fourth-share-line'"
                :text="'Step2:<br>' + $t('description.clickShare')"
              >
              </row-description>
            </div>
            <div class="description-image-box">
              <img class="description-image" src="@/assets/images/functionDescription/pinboard-share-dialog.png" :alt="$t('description.shareLink')">
              <div class="description-square fifth-share-square"></div>
              <row-description
                class="fifth-share-box"
                :lineClassName="'fifth-share-line'"
                :text="'Step3:<br>' + $t('description.shareLink')"
              >
              </row-description>
            </div>
          </div>
        </transition>
      </div>
      <div v-if="tabBtn.dataBtn" class="function-table-body">
        <div
          @click="toggleAddData"
          class="function-content-title"
        >
          <div>{{ $t('description.howAddData') }}？</div>
          <svg-icon
            :class="['content-icon', { 'rotate': dataContent.isShowAddData }]"
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
                class="first-data-box"
                :lineClassName="'first-data-line'"
                :text="'Step1:<br>' + $t('description.enterDataManage')"

              >
              </row-description>
            </div>
            <div class="description-image-box">
              <img class="description-image" src="@/assets/images/functionDescription/data-table-select.png" :alt="$t('editing.newDataSource')">
              <div class="description-square second-data-square"></div>
              <row-description
                class="second-data-box"
                :lineClassName="'second-data-line'"
                :text="'Step2:<br>' + $t('editing.newDataSource')"
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
            :class="['content-icon', { 'rotate': dataContent.isShowAddSheet }]"
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
                class="first-sheet-box"
                :lineClassName="'first-sheet-line'"
                :text="'Step1:<br>' + $t('description.pickupData')"
              >
              </row-description>
            </div>
            <div class="description-image-box">
              <img class="description-image" src="@/assets/images/functionDescription/data-table.png" :alt="$t('editing.newTable')">
              <div class="description-square second-sheet-square"></div>
              <row-description
                class="second-sheet-box"
                :lineClassName="'second-sheet-line'"
                :text="'Step2:<br>' + $t('editing.newTable')"
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
            :class="['content-icon', { 'rotate': dataContent.isShowEditData }]"
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
                class="first-data-edit-box"
                :lineClassName="'first-data-edit-line'"
                :text="'Step1:<br>' + $t('description.clickEditColumn')"
              >
              </row-description>
            </div>
            <div class="description-image-box description-space-image">
              <img class="description-image" src="@/assets/images/functionDescription/data-sheet-table.png" :alt="$t('description.clickEditColumn')">
              <div class="description-square second-data-edit-square"></div>
              <row-description
                :positionLeft="false"
                class="second-data-edit-box"
                :lineClassName="'second-data-edit-line'"
                :text="'Step2:<br>' + $t('description.clickEditColumn')"
              >
              </row-description>
            </div>
            <div class="description-image-box description-space-image">
              <img class="description-image" src="@/assets/images/functionDescription/data-sheet-table-edit.png" :alt="$t('description.editAlias')">
              <div class="description-square third-data-edit-square"></div>
              <row-description
                class="third-data-edit-box"
                :lineClassName="'third-data-edit-line'"
                :text="'Step3:<br>' + $t('description.editAlias')"
              >
              </row-description>
              <div class="description-square fourth-data-edit-square"></div>
              <row-description
                :positionLeft="false"
                class="fourth-data-edit-box"
                :lineClassName="'fourth-data-edit-line'"
                :text="'Step3:<br>' + $t('description.confirmEdit')"
              >
              </row-description>
            </div>
            <div class="description-image-box">
              <img class="description-image" src="@/assets/images/functionDescription/data-sheet-build.png" :alt="$t('description.completeBuild')">
              <div class="description-square fifth-data-edit-square"></div>
              <row-description
                :positionLeft="false"
                class="fifth-data-edit-box"
                :lineClassName="'fifth-data-edit-line'"
                :text="'Step4:<br>' + $t('description.completeBuild')"
              >
              </row-description>
            </div>
          </div>
        </transition>
        <!-- <div
          @click="toggleConnectData"
          class="function-content-title"
        >
          <div>{{ $t('description.howConnectDataSheet') }}？</div>
          <svg-icon
            :class="['content-icon', { 'rotate': dataContent.isShowConnectData }]"
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
                class="first-data-connect-box"
                :lineClassName="'first-data-connect-line'"
                :text="'Step1:<br>' + $t('description.clickDataSheetConnect')"
              >
              </row-description>
            </div>
            <div class="description-image-box description-space-image">
              <img class="description-image" src="@/assets/images/functionDescription/data-sheet-connect.png" :alt="$t('description.addDataSheetConnect')">
              <div class="description-square second-data-connect-square"></div>
              <row-description
                class="second-data-connect-box"
                :lineClassName="'second-data-connect-line'"
                :text="'Step2:<br>' + $t('description.addDataSheetConnect')"
              >
              </row-description>
            </div>
            <div class="description-image-box description-space-image">
              <img class="description-image" src="@/assets/images/functionDescription/data-sheet-connect-column.png" :alt="$t('description.andConnectColumn')">
              <div class="description-square third-data-connect-square"></div>
              <row-description
                class="third-data-connect-box"
                :lineClassName="'third-data-connect-line'"
                :text="'Step3:<br>' + $t('description.slectDataSheet') + '<br>' + $t('description.andConnectColumn')"
              >
              </row-description>
            </div>
            <div class="description-image-box description-space-image">
              <img class="description-image" src="@/assets/images/functionDescription/data-sheet-connect-store.png" :alt="$t('description.storeSetting')">
              <div class="description-square fourth-data-connect-square"></div>
              <row-description
                :positionLeft="false"
                class="fourth-data-connect-box"
                :lineClassName="'fourth-data-connect-line'"
                :text="'Step4:<br>' + $t('description.storeSetting')"
              >
              </row-description>
            </div>
          </div>
        </transition> -->
      </div>
    </div>
  </div>
</template>
<script>
import RowDescription from './components/RowDescription'
export default {
  name: 'FunctionDescription',
  components: {
    RowDescription
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
      questionContent: {
        isShowAskQuestion: false,
        isShowSearchQuestion: false,
        isShowAnalyzeResult: false,
        isShowDeepQuestion: false
      },
      pinboardContent: {
        isShowAddPinboard: false,
        isShowManageClass: false,
        isShowSharePinboard: false
      },
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
    // 基本介紹
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
    toggleAskQuestion () {
      this.questionContent.isShowAskQuestion = !this.questionContent.isShowAskQuestion
    },
    toggleSearchQuestion () {
      this.questionContent.isShowSearchQuestion = !this.questionContent.isShowSearchQuestion
    },
    toggleAnalyzeResult () {
      this.questionContent.isShowAnalyzeResult = !this.questionContent.isShowAnalyzeResult
    },
    toggleDeepQuestion () {
      this.questionContent.isShowDeepQuestion = !this.questionContent.isShowDeepQuestion
    },
    // 個人釘板使用
    toggleAddPinboard () {
      this.pinboardContent.isShowAddPinboard = !this.pinboardContent.isShowAddPinboard
    },
    toggleManageClass () {
      this.pinboardContent.isShowManageClass = !this.pinboardContent.isShowManageClass
    },
    toggleSharePinboard () {
      this.pinboardContent.isShowSharePinboard = !this.pinboardContent.isShowSharePinboard
    },
    // 資料管理
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

    .description-inner-text {
      align-self: flex-start;
      margin-bottom: 17px;
    }

    .description-image-box {
      position: relative;
      width: 660px;
      display: flex;
      justify-content: center;
    }

    .description-row-image-box {
      position: relative;
      width: 760px;
      display: flex;
    }

    .description-row-image {
      margin-right: 280px;
    }

    .description-image {

    }

    .description-space-image {
        margin-bottom: 53px;
    }

    .description-round-empty {
      width: 8px;
      height: 8px;
      border: 1px solid $theme-color-warning;
      border-radius: 99px;
    }

    .description-line {
      height: 1px;
      background: $theme-color-warning;
    }

    .description-round-full {
      width: 8px;
      height: 8px;
      background: $theme-color-warning;
      border-radius: 99px;
    }

    .description-square {
      position: absolute;
      border: 3px solid $theme-color-warning;
    }

    .description-text {
        width: 100px;
    }

    .description-text-right {
      text-align: right;
    }

    // interface
    .first-interface-box {
      left: -118px;
      top: 74px;
    }

    .first-interface-square {
      width: 184px;
      height: 100%;
      left: 0px;
      top: 0px;
    }

    .second-interface-box {
      left: -156px;
      top: 148px;
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

    // question

    .first-ask-box {
      left: 4px;
      top: 67px;
    }

    .first-ask-square {
      width: 186px;
      height: 146px;
      left: 220px;
      top: 38px;
    }

    .second-ask-box {
      right: 61px;
      top: 318px;
    }

    .second-ask-square {
      width: 186px;
      height: 38px;
      right: 254px;
      top: 309px;
    }

    // assist
    .first-assist-box {
      top: 303px;
      left: 73px;
    }

    .first-assist-square {
      top: 335px;
      left: 45px;
      width: 24px;
    }

    .second-assist-box {
      top: 185px;
      right: -92px;
    }

    .second-assist-square {
      width: 189px;
      height: 121px;
      top: 192px;
      right: 79px;
    }

    .third-assist-box {
      top: 331px;
      left: 153px;
    }

    .third-assist-square {
      top: 352px;
      left: 114px;
      width: 32px;
    }

    .fourth-assist-box {
      top: 18px;
      right: -95px;
    }

    .fourth-assist-square {
      width: 189px;
      height: 315px;
      top: 0px;
      right: 75px;
    }

    // result

    .first-result-box {
      left: -159px;
      top: 192px;
    }

    .first-result-square {
      width: 89px;
      height: 48px;
      left: 0px;
      top: 189px;
    }

    .second-result-box {
      right: -142px;
      top: 71px;
    }

    .second-result-square {
      width: 463px;
      height: 336px;
      right: 6px;
      top: 23px;
    }

    // deep

    .first-deep-box {
      left: -155px;
      top: 232px;
    }

    .first-deep-square {
      width: 131px;
      height: 78px;
      left: 6px;
      top: 231px;
    }

    .second-deep-box {
      top: 74px;
      right: -155px;
    }

    .second-deep-square {
      width: 453px;
      height: 182px;
      top: 0px;
      right: 10px;
    }

    .third-deep-box {
      right: -156px;
      top: 259px;
    }

    .third-deep-square {
      width: 454px;
      height: 178px;
      right: 9px;
      top: 185px;
    }

    // pinboard

    .first-pinboard-box {
      top: 40px;
      right: -104px;
    }

    .first-pinboard-square {
      height: 31px;
      width: 58px;
      top: 48px;
      right: 32px;
    }

    .second-pinboard-box {
      top: 61px;
      right: -137px;
    }

    .second-pinboard-square {
      width: 102px;
      height: 90px;
      top: 36px;
      right: 24px;
    }

    .third-pinboard-box {
      top: 14px;
      right: -154px;
    }

    .third-pinboard-square {
      width: 60px;
      height: 25px;
      top: 37px;
      right: 24px;
    }

    // manage class

    .first-class-box {
      top: -6px;
      right: -130px;
    }

    .first-class-square {
      width: 59px;
      height: 27px;
      top: 3px;
      right: 132px;
    }

    .second-class-box {
      top: 56px;
      left: -158px;
    }

    .second-class-square {
      top: 67px;
      left: 11px;
      width: 62px;
      height: 25px;
    }

    .third-class-box {
      top: 55px;
      left: -139px;
    }

    .third-class-square {
      height: 92px;
      width: 90px;
      top: 55px;
      left: 244px;
    }

    // share pinboard

    .first-share-box {
      top: 84px;
      left: -155px;
    }

    .first-share-square {
      width: 79px;
      height: 26px;
      left: 249px;
      top: 94px;
    }

    .second-share-box {
      left: -102px;
      top: 98px;
    }

    .second-share-square {
      width: 247px;
      height: 100px;
      top: 73px;
      left: 207px;
    }

    .third-share-box {
      left: -140px;
      top: 95px;
    }

    .third-share-square {
      width: 163px;
      height: 58px;
      left: 12px;
      top: 90px;
    }

    .fourth-share-box {
      top: 62px;
      right: -104px;
    }

    .fourth-share-square {
      width: 46px;
      height: 26px;
      top: 73px;
      right: 61px;
    }

    .fifth-share-box {
      top: 99px;
      left: -104px;
    }

    .fifth-share-square {
      width: 247px;
      height: 100px;
      top: 73px;
      left: 205px;
    }

    // data

    .first-data-box {
      right: -136px;
      top: 43px;
    }

    .first-data-square {
      width: 166px;
      height: 43px;
      right: 119px;
      top: 46px;
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

    .fourth-data-edit-box {
      right: -104px;
      top: 49px;
    }

    .fourth-data-edit-square {
      width: 33px;
      height: 20px;
      right: 206px;
      top: 63px;
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

    .third-data-connect-box {
      left: -123px;
      top: 90px;
    }

    .third-data-connect-square {
      width: 120px;
      height: 51px;
      left: 194px;
      top: 102px;
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
  }
}

</style>

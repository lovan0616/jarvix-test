<template>
  <div class="function-description">
    <h1 class="title">{{ $t('editing.functionDescription') }}</h1>
    <el-tabs v-model="activeTab" type="card">
      <el-tab-pane :label="$t('description.basic.intro')" name="basic">
        <el-collapse accordion v-model="activeCollapse">
          <el-collapse-item :title="$t('description.basic.ui')" name="uiIntro">
            <div class="description-image-box">
              <img src="@/assets/images/function-description/basic/index.png">
              <frame width="100%" height="30px" top="0">
              <frame width="185px" height="330px" top="32px">
              <frame width="445px" height="300px" top="40px" left="200px">
              <row-description :text="$t('description.basic.nav')" top="5px" right />
              <row-description text="Chatroom" top="100px" />
              <row-description :text="`${$t('description.basic.hide')}<br>Chatroom`" width="350px" top="170px"/>
              <row-description :text="$t('description.basic.index')" width="195px" top="80px" right/>
            </div>
          </el-collapse-item>
          <el-collapse-item :title="$t('description.basic.navIntro')" name="navIntro">
            <div class="description-image-box">
              <img src="@/assets/images/function-description/basic/nav-group-management.png">
              <frame width="180px" height="90px" top="56px" left="367px">
              <row-description :text="$t('description.basic.groupManage')" width="292px" top="90px" right />
            </div>
            <div class="description-image-box">
              <img src="@/assets/images/function-description/basic/nav-group.png" alt="">
              <frame width="205px" height="136px" top="55px" left="392px">
              <row-description :text="$t('description.basic.groupSwitch')" width="241px" top="113px" right />
            </div>
            <div class="description-image-box">
              <img src="@/assets/images/function-description/basic/nav-account.png" alt="">
              <frame width="205px" height="186px" top="57px" left="394px">
              <row-description :text="$t('description.basic.account')" width="239px" top="146px" right />
            </div>
            <div class="description-image-box">
              <img src="@/assets/images/function-description/basic/nav-func-desc.png" alt="">
              <frame width="34px" height="34px" top="17px" left="592px">
              <row-description :text="$t('description.basic.funcDesc')" top="26px" width="212px" right />
            </div>
          </el-collapse-item>
          <el-collapse-item :title="$t('description.basic.indexFuncIntro')" name="indexFuncIntro">
            <div class="description-image-box">
              <img src="@/assets/images/function-description/basic/index.png" alt="">
              <frame width="447px" height="200px" top="41px" left="200px">
              <frame width="447px" height="93px" top="246px" left="200px">
              <row-description :text="$t('description.basic.checkDataFrameDetail')" top="130px" width="190px" right />
              <row-description :text="$t('description.basic.faq')" top="270px" width="190px" right />
            </div>
          </el-collapse-item>
        </el-collapse>
      </el-tab-pane>
      <el-tab-pane :label="$t('description.question.analysis')" name="question">
        <el-collapse accordion v-model="activeCollapse">
          <el-collapse-item :title="$t('description.question.how')" name="how">
            <div class="description-image-box">
              <img src="@/assets/images/function-description/question/entry.png" alt="">
              <frame width="184px" height="138px" top="68px" left="220px">
              <frame width="184px" height="35px" top="310px" left="220px">
              <row-description :text="$t('description.question.recommended')" width="395px" top="80px"/>
              <row-description :text="$t('description.question.input')" width="434px" top="317px" right/>
            </div>
          </el-collapse-item>
          <el-collapse-item :title="$t('description.question.assistant')" name="howToStartUpAssistant">
            <p class="sub-title">{{ $t('description.question.info1') }}</p>
            <div class="description-image-box space-between">
              <img src="@/assets/images/function-description/question/entry.png" alt="">
              <img src="@/assets/images/function-description/question/vocabulary.png" alt="">
              <frame width="30px" height="20px" top="337px" left="114px">
              <frame width="189px" height="288px" top="31px" left="440px">
              <row-description :text="$t('description.question.click')" width="291px" top="88%"/>
              <row-description :text="$t('description.question.vocabulary')" width="209px" top="117px" right/>
            </div>
            <p class="sub-title">{{ $t('description.question.info2') }}</p>
            <div class="description-image-box space-between">
              <img src="@/assets/images/function-description/question/entry.png" alt="">
              <img src="@/assets/images/function-description/question/vocabulary.png" alt="">
              <frame width="30px" height="20px" top="337px" left="114px">
              <frame width="189px" height="288px" top="31px" left="440px">
              <row-description :text="$t('description.question.click')" width="291px" top="88%"/>
              <row-description :text="$t('description.question.sample')" width="209px" top="117px" right/>
            </div>
          </el-collapse-item>
          <el-collapse-item :title="$t('description.question.resultInfo')" name="resultInfo">
            <div class="description-image-box">
              <img src="@/assets/images/function-description/question/result.png" alt="">
              <frame width="451px" height="232px" top="37px" left="197px">
              <row-description :text="$t('description.question.result')" width="190px" top="80px" right/>
            </div>
            <div class="description-image-box">
              <img src="@/assets/images/function-description/question/result.png" alt="">
              <frame width="55px" height="22px" top="77px" left="89%" />
              <frame width="28px" height="153px" top="100px" left="93%" />
              <frame width="30px" height="28px" top="154px" left="87%" />
              <row-description :text="$t('description.question.basicInfo')" width="196px" top="69px" right />
              <row-description :text="$t('description.question.graphicTool')" width="196px" top="120px" right />
              <row-description :text="$t('description.question.fetchMore')" width="235px" top="150px" right />
            </div>
          </el-collapse-item>
          <el-collapse-item :title="$t('description.question.howToDeepen')" name="howToDeepen">
            <div class="description-image-box">
              <img src="@/assets/images/function-description/question/result.png" alt="">
              <frame width="185px" height="122px" top="185px" />
              <frame width="437px" height="101px" top="269px" left="31%" />
              <row-description :text="$t('description.question.recommended')" width="178px" top="200px"/>
              <row-description :text="$t('description.question.insights')" width="197px" top="80%" right />
            </div>
          </el-collapse-item>
        </el-collapse>
      </el-tab-pane>
      <el-tab-pane :label="$t('description.pinboard.personal')" name="pinboard">
        <el-collapse accordion v-model="activeCollapse">
          <el-collapse-item :title="$t('description.pinboard.how')" name="how">
            <div class="description-image-box">
              <img src="@/assets/images/function-description/pinboard/entry.png" alt="">
              <frame width="67px" height="33px" top="71px" left="557px">
              <row-description :text="$t('description.pinboard.clickPinboard')" width="212px" top="69px" right/>
            </div>
            <div class="description-image-box">
              <img src="@/assets/images/function-description/pinboard/classification.png" alt="">
              <frame width="102px" height="88px" top="47px" left="81%" />
              <row-description :text="$t('description.pinboard.classification')" width="202px" top="62px" right />
            </div>
            <div class="description-image-box">
              <img src="@/assets/images/function-description/pinboard/cancel.png" alt="">
              <frame width="59px" height="23px" top="47px" left="578px" />
              <row-description :text="$t('description.pinboard.cancel')" width="202px" top="30px" right />
            </div>
          </el-collapse-item>
          <el-collapse-item :title="$t('description.pinboard.howToClassify')" name="howToClassify">
            <div class="description-image-box">
              <img src="@/assets/images/function-description/pinboard/entry-personal.png" alt="">
              <frame width="111px" height="44px" top="11px" left="320px" />
              <row-description :text="$t('description.pinboard.entry')" width="407px" top="15px" right />
            </div>
            <div class="description-image-box">
              <img src="@/assets/images/function-description/pinboard/personal-panel.png" alt="">
              <frame width="61px" height="29px" top="74px" left="12px" />
              <row-description :text="$t('description.pinboard.addClass')" width="190px" top="70px" />
            </div>
            <div class="description-image-box">
              <img src="@/assets/images/function-description/pinboard/personal-panel-action.png" alt="">
              <frame width="88px" height="83px" top="63px" left="246px" />
              <row-description :text="$t('description.pinboard.classificationAction')" width="425px" top="79px" />
            </div>
          </el-collapse-item>
          <el-collapse-item :title="$t('description.pinboard.share')" name="share">
            <p class="sub-title">{{ $t('description.pinboard.title1') }}</p>
            <div class="description-image-box">
              <img src="@/assets/images/function-description/pinboard/personal-panel-action.png" alt="">
              <frame width="81px" height="25px" top="104px" left="249px" />
              <row-description :text="$t('description.pinboard.clickShareBtn1')" width="427px" top="98px" />
            </div>
            <div class="description-image-box">
              <img src="@/assets/images/function-description/pinboard/personal-share-pop.png" alt="">
              <frame width="249px" height="104px" top="68px" left="206px" />
              <row-description :text="`Step2:<br>${$t('description.pinboard.shareLink')}`" width="384px" top="101px" />
            </div>
            <p class="sub-title">{{ $t('description.pinboard.title2') }}</p>
            <div class="description-image-box">
              <img src="@/assets/images/function-description/pinboard/personal-panel.png" alt="">
              <frame width="164px" height="63px" top="96px" left="12px">
              <row-description :text="$t('description.pinboard.clickClass')" width="190px" top="109px" />
            </div>
            <div class="description-image-box">
              <img src="@/assets/images/function-description/pinboard/panel.png" alt="">
              <frame width="45px" height="26px" top="81px" left="554px" />
              <row-description :text="$t('description.pinboard.clickShareBtn2')" width="240px" top="74px" right />
            </div>
            <div class="description-image-box">
              <img src="@/assets/images/function-description/pinboard/panel-share-pop.png" alt="">
              <frame width="249px" height="104px" top="68px" left="206px" />
              <row-description :text="`Step3:<br>${$t('description.pinboard.shareLink')}`" width="384px" top="101px" />
            </div>
          </el-collapse-item>
        </el-collapse>
      </el-tab-pane>
      <el-tab-pane :label="$t('nav.dataManagement')" name="dataManagement">
        <el-collapse accordion v-model="activeCollapse">
          <el-collapse-item :title="$t('description.data.howToAddDataSource')" name="howToAddDataSource">
            <p class="sub-title">{{ $t('description.data.byFile') }}</p>
            <div class="description-image-box">
              <img src="@/assets/images/function-description/data/entry-nav.png" alt="">
              <frame width="184px" height="47px" top="54px" left="367px" />
              <row-description :text="$t('description.data.entry')" width="288px" top="58px" right />
            </div>
            <div class="description-image-box">
              <img src="@/assets/images/function-description/data/list-data-source.png" alt="">
              <frame width="66px" height="24px" top="84px" left="24px" />
              <row-description :text="$t('description.data.addDataSource')" width="203px" top="76px" />
            </div>
            <div class="description-image-box">
              <img src="@/assets/images/function-description/data/upload-by-file.png" alt="">
              <frame width="146px" height="131px" top="53px" left="186px" />
              <row-description :text="$t('description.data.selectByFile')" width="364px" top="99px" />
            </div>
            <div class="description-image-box">
              <img src="@/assets/images/function-description/data/upload-by-file-select-file.png" alt="">
              <frame width="405px" height="182px" top="75px" left="128px" />
              <row-description :text="$t('description.data.selectLocalFile')" width="307px" top="145px" />
            </div>
            <div class="description-image-box">
              <img src="@/assets/images/function-description/data/upload-by-file-processing.png" alt="">
              <frame width="405px" height="168px" top="75px" left="128px" />
              <row-description :text="$t('description.data.uploading')" width="307px" top="130px" />
            </div>
            <div class="description-image-box">
              <img src="@/assets/images/function-description/data/upload-select-column.png" alt="">
              <frame width="405px" height="231px" top="83px" left="128px" />
              <row-description :text="`Step6:<br>${$t('description.data.selectColumn')}`" width="307px" top="130px" />
            </div>
            <div class="description-image-box">
              <img src="@/assets/images/function-description/data/upload-data-clean.png" alt="">
              <frame width="405px" height="231px" top="83px" left="128px" />
              <row-description :text="`Step7:<br>${$t('description.data.dataCleansing')}`" width="307px" top="130px" />
            </div>
            <div class="description-image-box">
              <img src="@/assets/images/function-description/data/data-building.png" alt="">
              <frame width="92%" height="27px" top="161px" left="26px" />
              <row-description :text="`Step8:<br>${$t('description.data.building')}`" width="203px" top="145px" />
            </div>
            <p class="sub-title">{{ $t('description.data.byDB') }}</p>
            <div class="description-image-box">
              <img src="@/assets/images/function-description/data/upload-by-db.png" alt="">
              <frame width="148px" height="131px" top="53px" left="328px" />
              <row-description :text="$t('description.data.selectByDB')" width="362px" top="80px" right />
            </div>
            <div class="description-image-box">
              <img src="@/assets/images/function-description/data/upload-by-db-connection-setting.png" alt="">
              <frame width="405px" height="250px" top="61px" left="128px" />
              <row-description :text="$t('description.data.connectionSetting')" width="307px" top="145px" />
            </div>
            <div class="description-image-box">
              <img src="@/assets/images/function-description/data/upload-by-db-select-table.png" alt="">
              <frame width="405px" height="182px" top="75px" left="128px" />
              <row-description :text="$t('description.data.selectDataFrame')" width="307px" top="145px" />
            </div>
            <div class="description-image-box">
              <img src="@/assets/images/function-description/data/upload-select-column.png" alt="">
              <frame width="405px" height="231px" top="83px" left="128px" />
              <row-description :text="`Step4:<br>${$t('description.data.selectColumn')}`" width="307px" top="145px" />
            </div>
            <div class="description-image-box">
              <img src="@/assets/images/function-description/data/upload-data-clean.png" alt="">
              <frame width="405px" height="231px" top="83px" left="128px" />
              <row-description :text="`Step5:<br>${$t('description.data.dataCleansing')}`" width="307px" top="145px" />
            </div>
            <div class="description-image-box">
              <img src="@/assets/images/function-description/data/data-building.png" alt="">
              <frame width="92%" height="27px" top="161px" left="26px" />
              <row-description :text="`Step6:<br>${$t('description.data.building')}`" width="203px" top="145px" />
            </div>
          </el-collapse-item>
          <el-collapse-item :title="$t('description.data.howToAddDataFrame')" name="howToAddDataFrame">
            <div class="description-image-box">
              <img src="@/assets/images/function-description/data/list-data-source.png" alt="">
              <frame width="66px" height="24px" top="126px" left="24px" />
              <row-description :text="$t('description.data.clickDataSource')" width="203px" top="118px" />
            </div>
            <div class="description-image-box">
              <img src="@/assets/images/function-description/data/list-table.png" alt="">
              <frame width="66px" height="24px" top="84px" left="24px" />
              <row-description :text="$t('description.data.addDataFrame')" width="203px" top="76px" />
            </div>
          </el-collapse-item>
          <el-collapse-item :title="$t('description.data.howToAddColumnAlias')" name="howToAddColumnAlias">
            <div class="description-image-box">
              <img src="@/assets/images/function-description/data/table-action.png" alt="">
              <frame width="84px" height="28px" top="139px" left="433px" />
              <row-description :text="`Step1:<br>${$t('description.data.clickEdit')}`" width="321px" top="133px" right />
            </div>
            <div class="description-image-box">
              <img src="@/assets/images/function-description/data/table-column.png" alt="">
              <frame width="34px" height="20px" top="62px" left="420px" />
              <row-description :text="`Step2:<br>${$t('description.data.clickEdit')}`" width="384px" top="51px" right />
            </div>
            <div class="description-image-box">
              <img src="@/assets/images/function-description/data/table-column-edit.png" alt="">
              <frame width="59px" height="21px" top="61px" left="266px" />
              <frame width="34px" height="20px" top="62px" left="420px" />
              <row-description :text="$t('description.data.editAlias')" width="444px" top="52px" />
              <row-description :text="$t('description.data.confirm')" width="384px" top="52px" right />
            </div>
            <div class="description-image-box">
              <img src="@/assets/images/function-description/data/table-column-build.png" alt="">
              <frame width="44px" height="25px" top="15px" left="442px" />
              <row-description :text="$t('description.data.finish')" width="352px" top="8px" right />
            </div>
          </el-collapse-item>
        </el-collapse>
      </el-tab-pane>
      <el-tab-pane :label="$t('description.account.management')" name="account">
        <el-collapse accordion v-model="activeCollapse">
          <el-collapse-item :title="$t('description.account.howToEnter')" name="howToEnter">
            <div class="description-image-box">
              <img src="@/assets/images/function-description/account/entry-nav.png" alt="">
              <frame width="206px" height="48px" top="106px" left="394px" />
              <row-description :text="$t('description.account.entry')" width="237px" top="110px" right />
            </div>
            <div class="description-image-box">
              <img src="@/assets/images/function-description/account/entry-sidenav.png" alt="">
              <frame width="112px" height="27px" top="72px" />
              <row-description :text="$t('description.account.entrySideNav')" top="57px"  />
            </div>
          </el-collapse-item>
          <el-collapse-item :title="$t('description.account.howToInvite')" name="howToInvite">
            <div class="description-image-box">
              <img src="@/assets/images/function-description/account/list.png" alt="">
              <frame width="67px" height="27px" top="69px" left="132px" />
              <row-description :text="$t('description.account.clickInvite')" width="310px" top="63px" />
            </div>
            <div class="description-image-box">
              <img src="@/assets/images/function-description/account/pop-add.png" alt="">
              <frame width="306px" height="85px" top="46px" left="178px" />
              <row-description :text="$t('description.account.confirmInvite')" width="356px" top="44px" />
            </div>
          </el-collapse-item>
          <el-collapse-item :title="$t('description.account.howToUpdateRole')" name="howToUpdateRole">
            <div class="description-image-box">
              <img src="@/assets/images/function-description/account/list.png" alt="">
              <frame width="46px" height="27px" top="111px" left="509px" />
              <row-description :text="$t('description.account.clickUpdate')" width="283px" top="105px" right />
            </div>
            <div class="description-image-box">
              <img src="@/assets/images/function-description/account/pop-update.png" alt="">
              <frame width="253px" height="113px" top="68px" left="204px" />
              <row-description :text="$t('description.account.confirmUpdate')" width="382px" top="85px" />
            </div>
          </el-collapse-item>
        </el-collapse>
      </el-tab-pane>
      <el-tab-pane :label="$t('description.group.management')" name="group">
        <el-collapse accordion v-model="activeCollapse">
          <el-collapse-item :title="$t('description.group.howToEnter')" name="howToEnter">
            <div class="description-image-box">
              <img src="@/assets/images/function-description/group-member/entry-nav.png" alt="">
              <frame width="184px" height="46px" top="100px" left="368px" />
              <row-description :text="$t('description.group.entry')" width="285px" top="95px" right />
            </div>
            <div class="description-image-box">
              <img src="@/assets/images/function-description/group-member/list.png" alt="">
              <frame width="111px" height="27px" top="49px" />
              <row-description :text="$t('description.group.selectMember')" top="43px" />
            </div>
          </el-collapse-item>
          <el-collapse-item :title="$t('description.group.howToInvite')" name="howToInvite">
            <div class="description-image-box">
              <img src="@/assets/images/function-description/group-member/list.png" alt="">
              <frame width="67px" height="26px" top="69px" left="132px" />
              <row-description :text="$t('description.group.clickInvite')" width="310px" top="63px" />
            </div><div class="description-image-box">
              <img src="@/assets/images/function-description/group-member/add.png" alt="">
              <frame width="173px" height="27px" top="81px" left="129px" />
              <row-description :text="$t('description.group.confirmInvite')" width="307px" top="56px" />
            </div>
          </el-collapse-item>
        </el-collapse>
      </el-tab-pane>
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
      activeTab: 'basic',
      activeCollapse: 'uiIntro'
    }
  }
}
</script>

<style lang="scss" scoped>
/deep/ .el-tabs {
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
    .el-collapse {
      .el-collapse-item__header {
        padding-left: 0;
        font-size: 16px;
      }
    }
  }
}

p.sub-title {
  margin: 0;
  font-size: 14px;
}
.description-image-box {
  margin: 20px auto 30px auto;
  width: 660px;
  position: relative;
  text-align: center;
  &.space-between {
    display: flex;
    justify-content: space-between;
  }
}
</style>

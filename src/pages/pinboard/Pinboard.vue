<template>
  <div class="page-pinboard">
    <h1 class="page-title">{{ isPersonalPinboard ? $t('editing.pinboard') : $t('editing.projectPinboard') }}</h1>
    <div 
      v-if="boardName"
      class="bread-crumb-block"
    >
      <router-link 
        :to="{name: prevPage}"
        class="page root"
      >{{ $t('editing.allCategory') }}</router-link>
      <span class="divider">/</span>
      <span class="page">{{ boardName }}</span>
      <a
        v-if="isSortable"
        class="sort-btn"
        href="javascript:void(0)"
        @click="isShowSortingDialog=true">
        <svg-icon
          icon-class="vector"
          class="icon"/> {{ $t('button.sortSetting') }}
      </a>
    </div>
    <sorting-dialog
      v-if="isShowSortingDialog"
      :board-list="boardList"
      @close="closeSortingDialog"
    />
    <spinner
      v-if="isLoading"
    />
    <empty-info-block
      v-else-if="filterList.length === 0"
      :msg="$t('editing.emptyPinboard')"
    />
    <component
      v-for="result in boardList"
      :key="result.pinboardId"
      :is="result.layout"
      :data-pinboard-id="result.pinboardId"
      :data-data-source-id="result.dataSourceId"
      :data-data-frame-id="result.dataFrameId"
      :data-frame-id="result.dataFrameId"
      :result-info="result.info"
      :restrictions="result.restrictions"
      :question="result.question"
      @unPin="unPin"
    />
  </div>
</template>
<script>
import EmptyInfoBlock from '@/components/EmptyInfoBlock'
import SortingDialog from './components/SortingDialog'

export default {
  name: 'PagePinboard',
  components: {
    EmptyInfoBlock,
    SortingDialog
  },
  data () {
    return {
      isLoading: true,
      isShowSortingDialog: false,
      timeoutFunction: null,
      boardList: [],
      boardName: null
    }
  },
  computed: {
    pinboardList () {
      return this.isPersonalPinboard 
        ? this.$store.state.pinboard.pinboardList
        : this.$store.state.pinboard.groupPinboardList
    },
    pinboardInfo () {
      return this.isPersonalPinboard 
       ? this.$store.state.pinboard.pinboardInfo
       : this.$store.state.pinboard.groupPinboardInfo
    },
    filterList () {
      return this.boardList.filter(element => !element.isDeleted)
    },
    prevPage () {
      return this.isPersonalPinboard ? 'PersonalPagePinboardList' : 'ProjectPagePinboardList'
    },
    groupId () {
      return this.$route.params.group_id
    },
    isPersonalPinboard () {
      return this.$route.name === 'PersonalPagePinboard'
    },
    isSortable () {
      return this.filterList.length > 1
    }
  },
  mounted () {
    this.getPinboardInfo()
    this.getPinboardName()
  },
  methods: {
    getPinboardName () {
      if (this.pinboardList.length > 0) {
        this.setPinboardName()
      } else {
        if (this.isPersonalPinboard) {
          this.$store.dispatch('pinboard/getPinboardList').then(() => {
            this.setPinboardName()
          })
        } else {
          this.$store.dispatch('pinboard/getGroupPinboardList', this.groupId).then(() => {
            this.setPinboardName()
          })
        }
      }
    },
    setPinboardName () {
      let currentBoard = this.pinboardList.filter(element => element.id === parseInt(this.$route.params.id))
      this.boardName = currentBoard.length > 0 ? currentBoard[0].name : null
    },
    getPinboardInfo () {
      this.$store.dispatch('pinboard/getPinboardById', this.$route.params.id).then(response => {
        if (response.length === 0) {
          this.isLoading = false
          return false
        }
        response.forEach(element => {
          this.boardList.push({
            pinboardId: element.id,
            resultId: element.resultId,
            dataSourceId: element.dataSourceId,
            dataFrameId: element.dataFrameId,
            layout: null,
            info: null,
            isDeleted: false
          })
          this.getComponent(element)
        })
      }).catch(() => {
        this.isLoading = false
      })
    },
    getComponent (res) {
      window.clearTimeout(this.timeoutFunction)
      let currentResult = this.getResult(res.id)
      this.$store.dispatch('chatBot/getComponentList', res.resultId)
        .then(componentResponse => {
          switch (componentResponse.status) {
            case 'Process':
            case 'Ready':
              this.timeoutFunction = window.setTimeout(() => {
                this.getComponent(res)
              }, 1000)
              break
            case 'Complete':
              currentResult.info = componentResponse.componentIds
              currentResult.restrictions = componentResponse.restrictions
              currentResult.layout = this.getLayout(componentResponse.layout)
              currentResult.question = componentResponse.segmentationPayload.question
              this.$nextTick(() => {
                this.isLoading = false
              })
              break
            case 'Disable':
            case 'Delete':
            case 'Warn':
            case 'Fail':
              currentResult.info = []
              currentResult.layout = 'EmptyResult'
              this.isLoading = false
              break
          }
        })
    },
    getResult (pinboardId) {
      return this.boardList.filter(element => element.pinboardId === pinboardId)[0]
    },
    closeSortingDialog (isSorted) {
      this.isShowSortingDialog = false
      if(isSorted) {
        this.boardList = []
        this.getPinboardInfo()
      }
    },
    unPin (pinBoardId) {
      this.boardList.forEach(element => {
        if(element.pinboardId === pinBoardId)
          element.isDeleted = true
      })
    }
  },
}
</script>
<style lang="scss" scoped>
.page-pinboard {
  .bread-crumb-block {
    line-height: 20px;
    margin-bottom: 32px;
    font-weight: 700;

    .page {
      &.root {
        color: #65cfd9;
        text-decoration: underline;
      }
    }
    .divider {
      color: #979797;
      margin: 0 4px;
    }
    .sort-btn {
      float: right;
      position: relative;
      font-size: 14px;
      line-height: 26px;
      color: $theme-text-color;
      padding: 2px 12px;
      border-radius: 4px;
      border: 1px solid #fff;
      
      &:hover {
        background-color: #63cbd5;
        color: #fff;
      }
    }
  }
  .page-title {
    margin-top: 0;
  }
  .single-pinboard {
    transition: all 0.3s;

    &:not(:last-child) {
      margin-bottom: 30px;
    }
  }
}
</style>

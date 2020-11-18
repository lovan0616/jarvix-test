<template>
  <div class="dialog">
    <nav class="dialog__nav">
      <div class="nav--left">
        <div
          class="icon-arrow"
          @click="$emit('closeDialog')">
          <svg-icon icon-class="arrow-left" />
        </div>
        {{ $t('miniApp.createComponent') }}
      </div>
      <div class="nav--right">
        <div
          v-if="!isLoading && isAddable === false"
          class="message"
        >
          <svg-icon
            class="icon"
            icon-class="information-circle"
          />
          {{ $t('miniApp.componentNotAddable') }}
        </div>
        <button
          :disabled="!isAddable"
          class="btn btn-default"
          @click="createComponent"
        >
          {{ $t('button.create') }}
        </button>
      </div>
    </nav>
    <div class="dialog__content">
      <div class="key-result-chart">
        <div class="search-bar">
          <data-frame-menu
            :redirect-on-change="false"
            :is-show-preview-entry="true"
            :is-show-advance-setting-entry="false"
          />
          <ask-block
            :redirect-on-ask="false"
            :is-show-ask-helper-entry="false"
          />
        </div>
        <dashboard-component
          :is-addable.sync="isAddable"
          :is-loading.sync="isLoading"
        />
        <transition name="fast-fade-in">
          <section 
            v-if="isShowPreviewDataSource"
            class="preview-datasource">
            <preview-data-source
              :is-previewing="true"
              mode="popup"
            />
            <a 
              href="javascript:void(0)" 
              class="preview-datasource__close-btn"
              @click="closePreviewDataSource"
            ><svg-icon icon-class="close"/></a>
          </section>
        </transition>
      </div>
      <div
        v-if="currentResultInfo && currentResultInfo.key_result"
        class="key-result-setting">
        <div class="setting__header">
          <svg-icon icon-class="filter-setting"/>
          圖表設定
        </div>
        <div class="setting__content">
          <div class="setting__block">
            <div class="input-label">圖表名稱</div>
            <input-verify
              v-validate="`required|max:${max}`"
              v-model="componentDisplayName"
              name="componentDisplayName"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import DataFrameMenu from '@/components/select/DataFrameMenu'
import AskBlock from '@/components/chatBot/AskBlock'
import ResultDisplay from '@/pages/result/ResultDisplay'
import DashboardComponent from './DashboardComponent'
import InputVerify from '@/components/InputVerify'
import { mapState } from 'vuex'
import { v4 as uuidv4 } from 'uuid'

export default {
  inject: ['$validator'],
  name: 'CreateComponentDialog',
  components: {
    DataFrameMenu,
    AskBlock,
    ResultDisplay,
    DashboardComponent,
    InputVerify
  },
  data () {
    return {
      componentDisplayName: '',
      isAddable: null,
      isLoading: false
    }
  },
  computed: {
    ...mapState('result', ['currentResultId', 'currentResultInfo']),
    ...mapState('dataSource', ['appQuestion']),
    max () {
      return this.$store.getters['validation/fieldCommonMaxLength']
    },
    isShowPreviewDataSource () {
      return this.$store.state.previewDataSource.isShowPreviewDataSource
    }
  },
  mounted () {
  },
  destroyed () {
    this.$store.commit('result/updateCurrentResultInfo', null)
    this.$store.commit('result/updateCurrentResultId', null)
    this.$store.commit('dataSource/setAppQuestion', null)
    if (this.isShowPreviewDataSource) this.closePreviewDataSource()
  },
  methods: {
    createComponent () {
      this.$validator.validateAll().then(valid => {
        if (!valid) return
        
        this.$emit('create', {
          id: uuidv4(),
          keyResultId: this.currentResultInfo.key_result[0],
          resultId: this.currentResultId,
          orderSequence: null, // 由 Dashboard 層給定
          config: {
            diaplayedName: this.componentDisplayName,
            question: this.currentResultInfo.question
          }
        })
      })
    },
    closePreviewDataSource () {
      this.$store.commit('previewDataSource/togglePreviewDataSource', false)
    }
  },
}
</script>

<style lang="scss" scoped>
.dialog {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  &__nav {
    flex: 0 0 56px;
    padding: 0 24px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: rgba(0, 0, 0, 0.55);
    border-bottom: 1px solid #232C2E;
    .nav--left {
      display: flex;
      align-items: center;
      .icon-arrow {
        cursor: pointer;
        color: $theme-color-primary;
        margin-right: 20px;
      }
    }
    .nav--right {
      display: flex;
      .message {
        font-size: 12px;
        line-height: 36px;
        color: #FFDF6F;
        margin-right: 6px;
      }
    }
  }
  &__content {
    flex: 1;
    height: 0;
    overflow: overlay;
    display: flex;
    
    .key-result-chart {
      position: relative;
      flex: 1;
      border-right: 1px solid #232C2E;
      .search-bar {
        position: relative;
        z-index: 4;
        height: 60px;
        display: flex;
        padding: 8px 24px;
        border-bottom: 1px solid #232C2E;
        .data-frame-select-block {
          width: 300px;
          margin-right: 16px;
        }
      }
    }
    .key-result-setting {
      flex: 0 0 280px;
      .setting {
        &__header {
          height: 60px;
          padding: 16px 24px;
          display: flex;
          align-items: center;
          border-bottom: 1px solid #232C2E;
          .svg-icon {
            width: 16px;
            color: $theme-color-primary;
            margin-right: 12px;
          }
        }
        &__content {
          padding: 16px 24px;
          border-bottom: 1px solid #232C2E;
        }
      }
    }

    .preview-datasource {
      height: calc(100vh - 56px - 60px);
      position: absolute;
      top: 60px;
      right: 0;
      left: 0;
      background: rgba(0, 0, 0, 0.89);
      overflow: auto;
      padding: 40px;
      text-align: left;

      &__close-btn {
        position: absolute;
        top: 32px;
        right: 40px;
        color: #fff;
        font-size: 14px;
      }
    }
  }
}
</style>
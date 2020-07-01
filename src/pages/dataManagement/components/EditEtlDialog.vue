<template>
  <div class="full-page-dialog">
    <div class="dialog-container">
      <div class="dialog-title">
        {{ isReviewMode ? $t('button.reviewEtlSetting') : $t('button.editEtlSetting') }}
        <a 
          href="javascript:void(0)" 
          class="close-btn"
          @click="closeDialog"
        ><svg-icon icon-class="close"/></a>
      </div>
      <spinner
        v-if="isLoading"
        :title="$t('editing.loading')"
        class="spinner-container"
        size="50"
      />
      <div v-else>
        <div class="dialog-header-block">
          <div class="data-frame-name">{{ $t('editing.tableName') }}：{{ dataFrameName }}</div>
        </div>
        <div class="dialog-content-block">
          <etl-setting
            :is-review-mode="isReviewMode"
            :show-data-frame-name="false"
          />
        </div>
        <div 
          v-if="isReviewMode" 
          class="dialog-button-block">
          <button
            type="button"
            class="btn btn-outline"
            @click="closeDialog"
          >{{ $t('button.close') }}
          </button>
        </div>
        <div 
          v-else 
          class="dialog-button-block">
          <button
            :disabled="isProcessing"
            type="button"
            class="btn btn-outline"
            @click="closeDialog"
          >{{ $t('button.cancel') }}
          </button>
          <button
            :disabled="isProcessing"
            type="button"
            class="btn btn-default"
            @click="buildData"
          >{{ $t('button.buildData') }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { dataPreprocessor } from '@/API/DataSource'
import EtlSetting from '@/pages/dataManagement/components/etl/EtlChooseColumn';
import { Message } from 'element-ui'

export default {
  name: 'EditEtlDialog',
  components: {
    EtlSetting
  },
  props: {
    isReviewMode: {
      type: Boolean,
      default: false
    },
  },
  data () {
    return {
      isProcessing: false
    }
  },
  computed: {
    isLoading () {
      return this.$store.state.dataManagement.etlTableList.length === 0
    },
    dataFrameName () {
      const target = this.$store.state.dataManagement.etlTableList[0]
      return target ? target.primaryAlias : ''
    }
  },
  mounted () {
  },
  destroyed () {
    this.$store.commit('dataManagement/clearEtlTableList')
  },
  methods: {
    buildData () {
      // 使用新的再編輯的 preprocessor API
    },
    closeDialog () {
      this.$emit('close')
    },
  }
}
</script>

<style lang="scss" scoped>
.full-page-dialog {
  .dialog-container {
    width: 90%;
  }
  .dialog-title {
    position: relative;

    .close-btn {
      position: absolute;
      top: 0;
      right: 0;
      color: #fff;
      font-size: 14px;
    }
  }

  .dialog-header-block {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 12px;

    .data-frame-name {
      font-size: 14px;
      @include text-hidden
    }
  }
  .dialog-button-block {
    display: flex;
    justify-content: flex-end;
    margin-top: 16px;
    .btn + .btn {
      margin-left: 20px;
    }
  }
}
</style>

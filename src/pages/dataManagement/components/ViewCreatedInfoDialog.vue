<template>
  <div class="created-info-dialog full-page-dialog">
    <div class="dialog-container">
      <div class="dialog-title">
        {{ $t('editing.builtInfo') }}
        <a 
          href="javascript:void(0)" 
          class="close-btn"
          @click="closeDialog"
        ><svg-icon icon-class="close"/></a>
      </div>
      <div class="dialog-header-block">
        <div class="data-frame-name">
          {{ $t('editing.dataFrame') }}：{{ dataFrameInfo.primaryAlias }}
        </div>
      </div>
      <spinner 
        v-if="isLoading"
        :title="$t('editing.loading')"
        class="spinner-container"
        size="50"
      />
      <div 
        v-else
        class="dialog-content-block info__list"
      >
        <div class="info__item">
          <div class="info__title">{{ $t('editing.sourceOfData') }}</div>
          <div class="info__description">{{ createdInfo.host }}</div>
        </div>
        <div class="info__item">
          <div class="info__title">{{ $t('editing.databaseType') }}</div>
          <div class="info__description">{{ createdInfo.type }}</div>
        </div>
        <div class="info__item">
          <div class="info__title">{{ $t('editing.createWay') }}</div>
          <div class="info__description">{{ createdInfo.sql ? $t('editing.useSqlScript') : $t('editing.copyTableFromDatabase') }}</div>
        </div>
        <div
          v-if="createdInfo.sql"
          class="info__item"
        >
          <div class="info__title">{{ $t('editing.SQLSyntax') }}</div>
          <div class="info__sql sql">
            <textarea 
              ref="SQL" 
              :value="createdInfo.sql"
              class="info__description info__sql--code"
              readonly/>
            <button
              class="btn btn-secondary info__sql--btn"
              @click="copySQL"
            >
              <span>{{ $t('button.copySQL') }}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { getDataFrameCreatedInfo } from '@/API/DataSource'
import { Message } from 'element-ui'

export default {
  name: 'ViewCreatedInfoDialog',
  props: {
    dataFrameInfo: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      isLoading: true,
      createdInfo: {}
    }
  },
  mounted () {
    this.getCreatedInfo()
  },
  methods: {
    getCreatedInfo () {
      const dataFrameId = this.dataFrameInfo.id
      getDataFrameCreatedInfo(dataFrameId)
        .then(response => { this.createdInfo = response })
        .finally(() => { this.isLoading = false })
    },
    copySQL () {
      let input = this.$refs.SQL
      input.select()
      /* For mobile devices */
      input.setSelectionRange(0, 99999)
      document.execCommand('copy')

      Message({
        message: this.$t('message.copiedToBoard'),
        type: 'success',
        duration: 3 * 1000,
        showClose: true
      })
    },
    closeDialog () {
      this.$emit('close')
    }
  }
}
</script>
<style lang="scss" scoped>
.created-info-dialog {
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
    margin-bottom: 22px;

    .data-frame-name {
      font-size: 14px;
      @include text-hidden
    }
  }
  .dialog-content-block {
    background-color: rgba(50, 58, 58, 0.95);
    padding: 24px;
    border-radius: 5px;
  }

  .info {
    &__item {
      display: flex;
      &:not(:last-of-type) {
        margin-bottom: 16px;
      }
    }

    &__title {
      font-weight: 600;
      font-size: 14px;
      min-width: 107px;
    }

    &__description {
      color: #DDDDDD;
      font-size: 14px;
    }

    &__sql {
      display: flex;
      flex-direction: column;
      width: 100%;

      &--code {
        margin-bottom: 8px;
        width: 100%;
        padding: 0;
        overflow: hidden;
      }

      &--btn {
        width: fit-content;
      }
    }
  }
}
</style>

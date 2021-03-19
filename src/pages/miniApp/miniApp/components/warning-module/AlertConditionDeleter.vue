<template>
  <div
    class="alert-condition-deleter"
    @click="onClickDeleteIcon"
  >
    <svg-icon 
      icon-class="delete" 
      class="alert-condition-deleter__delete-icon"/>
    <div
      v-show="isShowConfirmMsg"
      class="alert-condition-deleter__confirm-pop"
    >
      <div class="confirm__message">
        {{ $t('alert.alertConditionDeletionWillImpactOtherApplicationConfirmMsg') }}
      </div>
      <div class="confirm__buttons">
        <a
          href="javascript:void(0)"
          class="link confirm__link--cancel"
          @click.stop="cancelDeletion"
        >{{ $t('button.cancel') }}</a>
        <a
          href="javascript:void(0)"
          class="link"
          @click.stop="confirmDeletion"
        >{{ $t('button.confirm') }}</a>
      </div>
    </div>
  </div>
</template>

<script>
import { Message } from 'element-ui'
import { deleteAlertCondition } from '@/API/Alert'

export default {
  name: 'AlertConditionDeleter',
  props: {
    condition: {
      type: Object,
      default: () => {}
    }
  },
  data () {
    return {
      isShowConfirmMsg: false,
      isProcessing: false
    }
  },
  methods: {
    onClickDeleteIcon () {
      this.isShowConfirmMsg = true
    },
    cancelDeletion() {
      this.isShowConfirmMsg = false
    },
    confirmDeletion() {
      this.isProcessing = true
      deleteAlertCondition(this.condition.id)
        .then(() => {
          Message({
            message: '示警條件已刪除',
            type: 'success',
            duration: 3 * 1000,
            showClose: true
          })
        })
        .finally(() => {
          this.isProcessing = false
          this.isShowConfirmMsg = false
          this.$emit('deleted')
        })
    }
  }
}
</script>

<style lang="scss" scoped>
.alert-condition-deleter {
  position: relative;

  &__delete-icon {
    font-size: 16px;
    cursor: pointer;
  }
  &__confirm-pop {
    position: absolute;
    width: 200px;
    z-index: 1;
    padding: 10px 12px;
    background: #323A3A;
    border: 1px solid #2AD2E2;
    border-radius: 8px;
    box-shadow: 0px 2px 10px rgba(34, 117, 125, 0.5);
    right: -10px;
    top: calc(100% + 8px);
    
    &::before {
      content: '';
      position: absolute;
      bottom: 100%;
      right: 7px;
      border-bottom: 9px solid #2AD2E2;
      border-left: 9px solid transparent;
      border-right: 9px solid transparent;
      border-top: 9px solid transparent;
    }

    .confirm__message {
      font-size: 14px;
      font-weight: normal;
      margin-bottom: 5px;
    }

    .confirm__buttons {
      display: flex;
      justify-content: flex-end;
    }

    .confirm__link {
      &--cancel {
        color: #FFFFFF;
        margin-right: 12px;
      }
    }
  }
}
</style>
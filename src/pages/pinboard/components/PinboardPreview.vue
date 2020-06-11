<template>
  <div class="single-pinboard-preview">
    <div 
      v-if="isAskDelete"
      class="confirm-delete"
    >
      <div class="confirm-content">{{ $t('editing.confirmDeleteBoardOrNot') }}</div>
      <div class="button-block">
        <button 
          class="btn btn-outline"
          @click="cancelDelete"
        >{{ $t('button.cancel') }}</button>
        <button 
          class="btn btn-default"
          @click="deletePinboard"
        >{{ $t('button.confirm') }}</button>
      </div>
    </div>
    <div 
      v-else-if="isEdit"
      class="action-block edit"
    >
      <input 
        v-model="tempEditInfo.name" 
        type="text"
        class="input board-name-input"
      >
      <div class="button-block">
        <button 
          class="btn btn-outline"
          @click="cancelEdit"
        >{{ $t('button.cancel') }}</button>
        <button 
          :disabled="!tempEditInfo.name"
          class="btn btn-default"
          @click="confirmEdit"
        >{{ $t('button.confirm') }}</button>
      </div>
    </div>
    <div 
      v-else-if="isShare"
      class="action-block edit"
    >
      <input 
        ref="shareInput" 
        :value="shareUrl" 
        type="text"
        class="input"
        readOnly
        @click="inputSelect"
      >
      <div class="button-block">
        <button 
          class="btn btn-outline"
          @click="cancelShare"
        >{{ $t('button.cancel') }}</button>
        <button 
          class="btn btn-default"
          @click="copy"
        >{{ $t('button.copy') }}</button>
      </div>
    </div>
    <div 
      v-else
      class="action-block"
      @click="goToBoard"
    >
      {{ boardInfo.name }}
      <div class="action-row">
        <div 
          class="single-action"
          @click.stop="checkDelete"
        >
          <svg-icon icon-class="delete"/>
        </div>
        <div 
          class="single-action"
          @click.stop="editName"
        >
          <svg-icon icon-class="edit"/>
        </div>
        <div 
          class="single-action"
          @click.stop="share"
        >
          <svg-icon icon-class="share"/>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { Message } from 'element-ui'

export default {
  name: 'PinboardPreview',
  props: {
    boardInfo: {
      type: Object,
      default: ()=> {
        return { id: null, name: null }
      }
    }
  },
  data () {
    return {
      isEdit: false,
      isAskDelete: false,
      isShare: false,
      tempEditInfo: {
        name: null,
        id: null
      }
    }
  },
  computed: {
    shareUrl () {
      return `${window.location.origin}/pinboard/${this.boardInfo.id}`
    }
  },
  methods: {
    editName () {
      this.tempEditInfo = JSON.parse(JSON.stringify(this.boardInfo))
      this.isEdit = true
    },
    checkDelete () {
      this.isAskDelete = true
    },
    confirmEdit () {
      this.$store.dispatch('pinboard/updatePinboardName', this.tempEditInfo).then(() => {
        this.cancelEdit()
      })
    },
    cancelEdit () {
      this.isEdit = false
      this.tempEditInfo = false
    },
    cancelDelete () {
      this.isAskDelete = false
    },
    deletePinboard () {
      this.$store.dispatch('pinboard/deletePinboard', this.boardInfo.id).then(() => {
        this.cancelDelete()
      })
    },
    goToBoard () {
      this.$router.push({
        name: 'PagePinboard',
        params: {
          id: this.boardInfo.id
        }
      })
    },
    inputSelect () {
      this.$refs.shareInput.select()
    },
    share () {
      this.isShare = true
      this.$nextTick(() => {
        this.inputSelect()
      })
    },
    cancelShare () {
      this.isShare = false
    },
    copy () {
      let input = this.$refs.shareInput
      input.select()
      /* For mobile devices */
      input.setSelectionRange(0, 99999)
      document.execCommand('copy')

      Message({
        message: this.$t('message.copiedToBoard'),
        type: 'success',
        duration: 3 * 1000
      })
      this.$nextTick(() => {
        this.cancelShare()
      })
    }
  },
}
</script>

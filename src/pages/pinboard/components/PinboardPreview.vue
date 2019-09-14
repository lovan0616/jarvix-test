<template>
<div class="single-pinboard-preview">
  <div class="confirm-delete"
    v-if="isAskDelete"
  >
    <div class="confirm-content">确认删除此钉板？</div>
    <div class="button-block">
      <button class="btn btn-outline"
        @click="cancelDelete"
      >取消</button>
      <button class="btn btn-default"
        @click="deletePinboard"
      >确认</button>
    </div>
  </div>
  <div class="action-block edit"
    v-else-if="isEdit"
  >
    <input type="text" class="input board-name-input"
      v-model="tempEditInfo.name"
    >
    <div class="button-block">
      <button class="btn btn-outline"
        @click="cancelEdit"
      >取消</button>
      <button class="btn btn-default"
        @click="confirmEdit"
        :disabled="!tempEditInfo.name"
      >确认</button>
    </div>
  </div>
  <div class="action-block edit"
    v-else-if="isShare"
  >
    <input type="text" class="input" ref="shareInput"
      :value="shareUrl"
      @click="inputSelect"
      readOnly
    >
    <div class="button-block">
      <button class="btn btn-outline"
        @click="cancelShare"
      >取消</button>
      <button class="btn btn-default"
        @click="copy"
      >复制</button>
    </div>
  </div>
  <div class="action-block"
    v-else
    @click="goToBoard"
  >
    {{ boardInfo.name }}
    <div class="action-row">
      <div class="single-action"
        @click.stop="checkDelete"
      >
        <svg-icon icon-class="delete"></svg-icon>
      </div>
      <div class="single-action"
        @click.stop="editName"
      >
        <svg-icon icon-class="edit"></svg-icon>
      </div>
      <div class="single-action"
        @click.stop="share"
      >
        <svg-icon icon-class="share"></svg-icon>
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
      type: Object
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
        message: '已复制至剪贴簿',
        type: 'success',
        duration: 3 * 1000
      })
      this.$nextTick(() => {
        this.cancelShare()
      })
    }
  },
  computed: {
    shareUrl () {
      return `${window.location.origin}/pinboard/${this.boardInfo.id}`
    }
  }
}
</script>

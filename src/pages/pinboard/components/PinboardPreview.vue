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
    </div>
  </div>
</div>
</template>
<script>
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
    }
  }
}
</script>

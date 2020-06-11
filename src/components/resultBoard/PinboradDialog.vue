<template>
  <div class="pinboard-dialog">
    <div 
      v-if="!isEdit"
      class="pinboard-option-list"
    >
      <div 
        class="single-board default"
        @click="editBoard"
      ><span class="add-icon">+</span>{{ $t('editing.createBoard') }}</div>
      <div 
        v-for="pinboardInfo in pinboardList"
        :key="pinboardInfo.id"
        class="single-board"
        @click="pin(pinboardInfo.id)"
      >{{ pinboardInfo.name }}</div>
    </div>
    <div 
      v-else
      class="edit-block"
    >
      <input 
        v-model="newBoardName" 
        type="text"
        class="input board-name-input"
      >
      <div class="button-block">
        <button 
          class="btn btn-outline"
          @click="cancelCreate"
        >{{ $t('button.cancel') }}</button>
        <button 
          class="btn btn-default"
          @click="createPinboard"
        >{{ $t('button.confirm') }}</button>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'PinboardDialog',
  data () {
    return {
      isEdit: false,
      newBoardName: null
    }
  },
  computed: {
    pinboardList () {
      return this.$store.state.pinboard.pinboardList
    }
  },
  mounted () {
    document.addEventListener('click', this.autoHide, false)
  },
  destroyed () {
    document.removeEventListener('click', this.autoHide, false)
  },
  methods: {
    autoHide (evt) {
      if (!this.$el.contains(evt.target)) {
        this.$emit('close')
      }
    },
    pin (id) {
      this.$emit('pin', id)
    },
    cancelCreate () {
      this.isEdit = false
      this.newBoardName = null
    },
    createPinboard () {
      this.$store.dispatch('pinboard/createPinboard', this.newBoardName).then(response => {
        this.$emit('pin', response.id)
        this.cancelCreate()
      })
    },
    editBoard () {
      this.isEdit = true
    }
  },
}
</script>
<style lang="scss" scoped>
.pinboard-dialog {
  width: 200px;
  position: absolute;
  top: calc(100% + 10px);
  right: 0;
  background-color: rgba(60, 60, 60, 0.85);
  box-shadow: 0px 4px 24px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  padding: 16px;
  z-index: 999;

  &:before {
    position: absolute;
    top: -20px;
    right: 30px;
    display: block;
    border: solid transparent;
    content: " ";
    height: 0;
    width: 0;
    pointer-events: none;
    border-bottom-color: rgba(60, 60, 60, 0.85);
    border-width: 10px;
  }

  .pinboard-option-list {
    max-height: 300px;
    overflow: auto;
  }

  .single-board {
    background-color: $theme-bg-color;
    padding: 4px 12px;
    border-radius: 8px;
    font-size: 14px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    cursor: pointer;

    &:hover {
      background-color: rgba(0, 0, 0, 0.6);
    }

    &:not(:last-child) {
      margin-bottom: 8px;
    }

    &.default {
      background-color: rgba(255, 255, 255, 0.16);
    }

    .add-icon {
      margin-right: 4px;
    }
  }

  .edit-block {
    padding: 12px 0;
    .board-name-input {
      margin-bottom: 16px;
    }
    .button-block {
      display: flex;
      justify-content: center;

      .btn:first-child {
        margin-right: 16px;
      }
    }
  }
}
</style>

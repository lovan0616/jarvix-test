<template>
  <div class="pinboard-dialog">
    <div
      v-show="pinStep==1"
      class="pinboard-option-list">
      <div
        class="single-board"
        @click="onlyPersonal">
        {{ $t('editing.onlyPersonal') }}
      </div>
      <div
        class="single-board"
        @click="shareToProject">
        {{ $t('editing.shareToProject') }}
      </div>
    </div>
    <div v-show="pinStep==2">
      <div 
        class="pinboard-option-list"
      >
        <div class="return-block-container">
          <div class="block__arrow" />
          <a
            href="javascript:void(0);" 
            class="link action-link"
            @click.prevent="prevStep"
          >
            {{ $t('editing.prevStep') }}
          </a>
        </div>
        <div 
          class="single-board default"
          @click="nextStep"
        ><span class="add-icon">+</span>{{ $t('editing.newPinboard') }}</div>
        <div 
          v-for="pinboardInfo in pinboardList"
          :key="pinboardInfo.id"
          class="single-board"
          @click="pin(pinboardInfo.id)"
        >{{ pinboardInfo.name }}</div>
      </div>
    </div>
    <div 
      v-show="pinStep==3"
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
      newBoardName: null,
      pinStep: 0,
      isPersonal: true
    }
  },
  computed: {
    pinboardList () {
      return this.isPersonal ? this.personalPinboardList : this.groupPinboardList
    },
    personalPinboardList () {
      return this.$store.state.pinboard.pinboardList
    },
    groupPinboardList () {
      return this.$store.state.pinboard.groupPinboardList
    },
    groupId () {
      return this.$store.getters['userManagement/getCurrentGroupId']
    }
  },
  mounted () {
    document.addEventListener('click', this.autoHide, false)
    this.nextStep()
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
      this.newBoardName = null
      this.$emit('close')
    },
    createPinboard () {
      if(this.isPersonal) {
        this.$store.dispatch('pinboard/createPinboard', this.newBoardName).then(response => {
          this.$emit('pin', response.id)
          this.cancelCreate()
        })
      } else {
        this.$store.dispatch('pinboard/createGroupPinboard', {name: this.newBoardName, groupId: this.groupId}).then(response => {
          this.$emit('pin', response.id)
          this.cancelCreate()
        })
      }
    },
    prevStep () {
      this.pinStep -= 1
    },
    nextStep () {
      this.pinStep += 1
    },
    onlyPersonal () {
      this.isPersonal = true
      this.nextStep()
    },
    shareToProject () {
      this.isPersonal = false
      this.nextStep()
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
  background-color: rgba(60, 60, 60, 0.95);
  box-shadow: 0px 4px 10px rgba(58, 178, 189, 0.5);
  border-radius: 8px;
  padding: 20px;
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

 .return-block-container {
    display: flex;
    align-items: center;
    margin-bottom: 16px;

    .block__arrow {
      width: 8px;
      height: 8px;
      margin-right: 8px;
      border-radius: 1px;
      border-left: 2px solid $button-color;
      border-bottom: 2px solid $button-color;
      transform: rotate(45deg)
    }

    .block__label {
      font-weight: 600;
      font-size: 14px;
      color: $button-color;
      &:hover {
        border-bottom: 2px solid;
      }
    }
  }

  .pinboard-option-list {
    max-height: 300px;
    overflow: auto;
  }

  .single-board {
    padding: 4px 12px;
    border-radius: 4px;
    font-size: 14px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    cursor: pointer;
    border: 1px solid #FFF;

    &:hover {
      background-color: rgba(0, 0, 0, 0.6);
    }

    &:not(:last-child) {
      margin-bottom: 8px;
    }

    .add-icon {
      margin-right: 4px;
    }
  }

  .edit-block {
    .board-name-input {
      margin-bottom: 12px;
      line-height: 22px;
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

<template>
  <div class="pinboard-dialog">
    <div
      v-show="pinStep === 1"
      class="pinboard-option-list">
      <div
        class="single-board"
        @click="chooseTargetBoard('personalPinboard')">
        {{ $t('editing.onlyPersonal') }}
      </div>
      <div
        class="single-board"
        @click="chooseTargetBoard('projectPinboard')">
        {{ $t('editing.shareToProject') }}
      </div>
      <div
        v-if="isWarRoomAddable"
        class="single-board"
        @click="chooseTargetBoard('warRoom')">
        {{ $t('editing.addToWarRoom') }}
      </div>
    </div>
    <div 
      v-show="pinStep === 2"
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
      >
        <span class="add-icon">+</span>{{ choosedBoard === 'warRoom' ? $t('editing.newWarRoom') : $t('editing.newPinboard') }}
      </div>
      <div 
        v-for="boardInfo in boardList"
        :key="boardInfo.id"
        class="single-board"
        @click="pin(boardInfo.id)"
      >{{ boardInfo.name }}</div>
    </div>
    <div 
      v-show="pinStep === 3"
      class="edit-block"
    >
      <input 
        v-model="newBoardName" 
        :placeholder="choosedBoard === 'warRoom' ? $t('editing.warRoomName') : $t('editing.pinboardName')"
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
import { getWarRoomList, createWarRoom } from '@/API/WarRoom'
import { mapState } from 'vuex'

export default {
  name: 'PinboardDialog',
  props: {
    isWarRoomAddable: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      newBoardName: null,
      pinStep: 1,
      choosedBoard: '',
      warRoomList: []
    }
  },
  computed: {
    ...mapState('userManagement', ['userId']),
    boardList () {
      if(this.choosedBoard === 'personalPinboard') 
        return this.$store.state.pinboard.pinboardList
      else if(this.choosedBoard === 'projectPinboard')
        return this.$store.state.pinboard.groupPinboardList
      else if(this.choosedBoard === 'warRoom')
        return this.warRoomList
    },
    userId () {
      return this.$store.state.userManagement.userId
    },
    groupId () {
      return this.$store.getters['userManagement/getCurrentGroupId']
    }
  },
  mounted () {
    document.addEventListener('click', this.autoHide, false)
    this.getPinboardInfo()
    this.getWarRoomList()
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
    getPinboardInfo () {
      this.$store.dispatch('pinboard/getPinboardList')
      this.$store.dispatch('pinboard/getGroupPinboardList', this.groupId)
    },
    getWarRoomList () {
      getWarRoomList(this.groupId).then(res => {
        res = [
          {
            "isPublishing": true,
            "name": "AA",
            "urlIdentifier": "AA",
            "id": 1
          },
          {
            "isPublishing": true,
            "name": "BB",
            "urlIdentifier": "BB",
            "id": 2
          },
          {
            "isPublishing": true,
            "name": "CC",
            "urlIdentifier": "CC",
            "id": 3
          }
        ]
        this.warRoomList =  res
      })
    },
    pin (id) {
      this.$emit('pin', id)
    },
    pinToWarRoom (id) {
      this.$emit('pinToWarRoom', id)
    },
    cancelCreate () {
      this.newBoardName = null
      this.$emit('close')
    },
    createPinboard () {
      if(this.choosedBoard === 'warRoom') {
        createWarRoom({ name: this.newBoardName, groupId: this.groupId })
          .then(response => {
            this.$emit('pinToWarRoom', response)
            this.cancelCreate()
          })
        return 
      }
      else if(this.choosedBoard === 'personalPinboard') {
        this.$store.dispatch('pinboard/createPinboard', this.newBoardName)
          .then(response => {
            this.$emit('pin', response.id)
            this.cancelCreate()
          })
      } else if (this.choosedBoard === 'projectPinboard') {
        this.$store.dispatch('pinboard/createGroupPinboard', { name: this.newBoardName, groupId: this.groupId })
          .then(response => {
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
    chooseTargetBoard (choosedBoard) {
      console.log('choosedBoard', choosedBoard)
      this.choosedBoard = choosedBoard
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
      height: 39px;
      font-size: 16px;
      line-height: 22px;
      margin-bottom: 12px;
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

[lang="en"] {
  .pinboard-dialog {
    width: 240px;
  }
}
</style>

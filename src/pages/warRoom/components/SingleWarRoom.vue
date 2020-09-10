<template>
  <div
    class="single-war-room war-room"
    @click.stop="edit"
  >
    <div 
      :class="{ 'war-room__status--published': warRoomInfo.isPublishing}"
      class="war-room__status">
      {{ warRoomInfo.isPublishing ? $t('warRoom.hasPublished') : $t('warRoom.notPublished') }}
    </div>
    <div class="war-room__name">{{ warRoomInfo.name }}</div>
    <div class="war-room__link">
      <a
        v-if="warRoomInfo.isPublishing"
        href="javascript:void(0);" 
        class="link action-link"
        @click.stop="viewDetail"
      >{{ $t('warRoom.goToLivePage') }}</a>
      <a
        v-if="hasPermission('group_edit_data')"
        href="javascript:void(0);" 
        class="link action-link"
        @click.stop="edit"
      >{{ $t('warRoom.edit') }}</a>
    </div>
    <div 
      class="war-room__action-block"
      @click.stop
    >
      <div class="war-room__hover-box">
        <svg-icon 
          icon-class="more" 
          class="icon more-icon"/>

        <div 
          :class="{'war-room__popup--published': warRoomInfo.isPublishing}"
          class="war-room__popup">
          <div
            v-if="warRoomInfo.isPublishing && hasPermission('group_edit_data')"
            class="popup-box" 
            @click.stop="unpublish">
            <div class="popup-text">{{ $t('warRoom.unpublish') }}</div>
          </div>
          <div 
            v-else-if="!warRoomInfo.isPublishing && hasPermission('group_edit_data')"
            class="popup-box" 
            @click.stop="publish">
            <div class="popup-text">{{ $t('warRoom.publish') }}</div>
          </div>
          <div
            v-if="warRoomInfo.isPublishing"
            class="popup-box" 
            @click.stop="getPublishedUrl">
            <div class="popup-text">{{ $t('warRoom.getPublishedUrl') }}</div>
          </div>
          <div
            v-if="hasPermission('group_edit_data')"
            class="popup-box" 
            @click.stop="renameWarRoom">
            <div class="popup-text">{{ $t('warRoom.rename') }}</div>
          </div>
          <div
            v-if="hasPermission('group_delete_data')"
            class="popup-box" 
            @click.stop="deleteWarRoom">
            <div class="popup-text">{{ $t('warRoom.delete') }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: 'SingleWarRoom',
  props: {
    warRoomInfo: {
      type: Object,
      default: ()=> {
        return { 
          isPublishing: false,
          name: null,
          urlIdentifier: null,
          id: null
         }
      }
    }
  },
  computed: {
    ...mapGetters('userManagement', ['hasPermission'])
  },
  methods: {
    viewDetail () {
      const routeData = this.$router.resolve({
        name: 'WarRoomLivePage', 
        query: { 'id': this.warRoomInfo.urlIdentifier } })
      window.open(routeData.href, '_blank')
    },
    edit () {
      this.$router.push({
        name: 'WarRoom',
        params: { war_room_id: this.warRoomInfo.id }
      })
    },
    publish () {
      this.$emit('publish', this.warRoomInfo.id )
    },
    unpublish () {
      this.$emit('unpublish', this.warRoomInfo.id )
    },
    getPublishedUrl () {
      this.$emit('showShare')
    },
    renameWarRoom () {
      this.$emit('showEdit')
    },
    deleteWarRoom () {
      this.$emit('showDelete')
    }
  }
}
</script>

<style lang="scss" scoped>

.war-room {
  position: relative;
  height: 121px;
  width: calc((100% - 60px) / 4);
  background-color: var(--color-bg-5);
  border-radius: 8px;
  padding: 16px 24px 24px;
  cursor: pointer;
  background-color: rgba(0, 0, 0, .35);
  transition: all 0.3s;
  margin-bottom: 12px;
  border: 1px solid #202E31;

  &:not(:nth-child(4n)) {
    margin-right: 20px;
  }

  &:hover {
    background: #202E31;
    transform: translateY(-2px);

    .war-room__link,
    .war-room__action-block {
      opacity: 1;
      visibility: visible;
      transition: opacity .1s linear;
    }
  }

  &__status {
    position: relative;
    margin-bottom: 4px;
    padding-left: 12px;
    font-size: 12px;
    line-height: 130%;
    color: var(--color-text-light);

    &::before {
      content: '';
      position: absolute;
      top: 4px;
      left: 0;
      width: 6px;
      height: 6px;
      background: transparent;
      border-radius: 50%;
      border: 1px solid #999;
    }

    &--published {
      &::before {
        background: #2FECB3;
        border: 1px solid #2FECB3;
      }
    }
  }

  &__name {
    width: 100%;
    margin-bottom: 14px;
    font-size: 18px;
    @include text-hidden;
  }

  &__link {
    visibility: hidden;
    opacity: 0;
  }

  .link {
    margin-right: 8px;
    &:hover {
      opacity: .8;
    }
  }

  &__action-block {
    position: absolute;
    right: 24px;
    bottom: 24px;
    visibility: hidden;
    opacity: 0;
  }

  &__hover-box {
    position: relative;
    width: 30px;
    height: 30px;
    background: rgba(255, 255, 255, 0.16);
    border-radius: 5px;
    align-self: flex-end;
    display: flex;
    justify-content: center;
    align-items: center;

    &:hover {
      .war-room__popup {
        visibility: visible;
      }
    }
  }

  .more-icon {
    width: 22px;
    height: 22px;
    color: #1EB8C7;
    cursor: pointer;
  }

  &__popup {
    visibility: hidden;
    width: 160px;
    position: absolute;
    top: -128px;
    right: -20px;
    background: #233131;
    border-radius: 8px;
    cursor: pointer;
    box-shadow: 0px 4px 10px rgba(58, 178, 189, .5);

    &::after {
      content: '';
      position: absolute;
      right: 24px;
      bottom: -10px;
      width: 0px;
      height: 0px;
      border-top: 10px solid #233131;
      border-left: 10px solid transparent;
      border-right: 10px solid transparent; 
    }

    &--published {
      top: -168px;
    }

    .popup-box {
      display: flex;
      height: 40px;
      align-items: center;
      color: #a7a7a7;

      &:hover {
        color: #fff;
      }

      &:not(:last-child) {
        border-bottom: 1px solid #384545;
      }
    }

    .popup-text {
      padding: 0 12px;
      font-size: 14px;
    }
  }
}
</style>
<template>
  <div class="single-mini-app mini-app">
    <div class="mini-app__badge">
      <svg-icon 
        :icon-class="miniAppInfo.icon" 
        class="icon mini-app__icon"/>
    </div>
    <div class="mini-app__name">{{ miniAppInfo.name }}</div>
    <div class="mini-app__description">{{ miniAppInfo.description }}</div>
    <router-link
      :to="{
        name: 'MiniApp',
        params: { 'mini_app_id': miniAppInfo.id },
        query: { mode: 'edit' }
      }"
      class="link action-link"
    >{{ $t('miniApp.editContent') }}</router-link>
    <a 
      href="javascript:void(0);" 
      class="link action-link"
      @click="openMiniApp"
    >{{ $t('miniApp.goToApp') }}</a>
    <div class="mini-app__action-block">
      <div class="mini-app__hover-box">
        <svg-icon 
          icon-class="more" 
          class="icon more-icon"/>
        <div class="mini-app__popup">
          <div
            class="popup-box" 
            @click.stop="editAppInfo">
            <div class="popup-text">
              <svg-icon 
                icon-class="edit" 
                class="icon "/>
              {{ $t('miniApp.editInfo') }}
            </div>
          </div>
          <div
            class="popup-box" 
            @click.stop="getAppUrl">
            <div class="popup-text">
              <svg-icon 
                icon-class="share"
                class="icon "/>
              {{ $t('miniApp.getAppUrl') }}
            </div>
          </div>
          <div
            class="popup-box" 
            @click.stop="deleteApp">
            <div class="popup-text">
              <svg-icon 
                icon-class="delete" 
                class="icon "/>
              {{ $t('miniApp.deleteApp') }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SingleMiniAppCard',
  props: {
    miniAppInfo: {
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
  methods: {
    getAppUrl () {
      this.$emit('showShare')
    },
    editAppInfo () {
      this.$emit('showEdit')
    },
    deleteApp () {
      this.$emit('showDelete')
    },
    openMiniApp () {
      const { params } = this.$route
      const routeData = this.$router.resolve({
        name: 'MiniApp', 
        params: {
          ...params,
          'mini_app_id': this.miniAppInfo.id
        },
        query: { mode: 'view' } })
      window.open(routeData.href, '_blank')
    },
  }
}
</script>

<style lang="scss" scoped>
.mini-app {
  position: relative;
  height: 255px;
  width: 206px;
  background: rgba(0, 0, 0, 0.55);
  border-radius: 8px;
  padding: 24px;
  margin-bottom: 16px;
  text-align: center;
  margin-right: 20px;

  &__badge {
    position: relative;
    background: rgba(255, 255, 255, 0.16);
    border-radius: 50%;
    margin: 0 auto 16px auto;
    width: 80px;
    height: 80px;
  }

  &__icon {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    color: #2AD2E2;
    font-size: 40px;
  }

  &__name,
  &__description {
    text-overflow: ellipsis;
    overflow: hidden;  
    white-space: nowrap;
  }

  &__name {
    width: 100%;
    font-size: 16px;
    font-weight: 600;
    @include text-hidden;
  }

  &__description {
    font-size: 13px;
    color: #DDDDDD;
    margin-bottom: 15px;
  }

  &__action-block {
    position: absolute;
    right: 16px;
    top: 16px;
  }

  &__hover-box {
    position: relative;
    width: 30px;
    height: 30px;
    align-self: flex-end;
    display: flex;
    justify-content: center;
    align-items: center;

    &:hover {
      .mini-app__popup {
        visibility: visible;
      }
    }
  }

  .link {
    display: block;
    font-weight: 600;
    &:first-of-type {
      margin-bottom: 8px;
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
      font-weight: 600;
    }

    .icon {
      color: #00C9DC;
      margin-right: 6px;
    }
  }
}
</style>
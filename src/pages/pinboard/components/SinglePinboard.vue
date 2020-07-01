<template>
  <div 
    class="single-pinboard" 
    @click.stop="goToBoard">
    <div class="pinboad-pin-box">
      <svg-icon 
        icon-class="pin" 
        class="icon pin-icon"/>
    </div>
    <div class="pinboard-name">{{ boardInfo.name }}</div>
    <div 
      class="pinboard-action-block"
      @click.stop
    >
      <div class="pinboad-hover-box">
        <svg-icon 
          icon-class="more" 
          class="icon more-icon"/>

        <div class="pinboard-popup">
          <div 
            class="popup-box" 
            @click.stop="showEdit">
            <svg-icon 
              icon-class="edit" 
              class="icon popup-icon"/>
            <div class="popup-text">{{ $t('button.edit') }}</div>
          </div>

          <div 
            class="popup-box border-line" 
            @click.stop="showDelete">
            <svg-icon 
              icon-class="delete" 
              class="icon popup-icon"/>
            <div class="popup-text">{{ $t('button.delete') }}</div>
          </div>

          <div 
            class="popup-box" 
            @click.stop="showShare">
            <svg-icon 
              icon-class="share" 
              class="icon popup-icon"/>
            <div class="popup-text">{{ $t('button.share') }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>

export default {
  name: 'SinglePinboard',
  props: {
    isPersonalPinboard: { type:Boolean, default: true },
    boardInfo: {
      type: Object,
      default: ()=> {
        return { id: null, name: null }
      }
    }
  },
  methods: {
    goToBoard () {
      let routerName = this.isPersonalPinboard ? 'PersonalPagePinboard' : 'ProjectPagePinboard'
      this.$router.push({
        name: routerName,
        params: {
          id: this.boardInfo.id
        }
      })
    },
    showEdit () {
      this.$emit('showEdit')
    },
    showDelete () {
      this.$emit('showDelete')
    },
    showShare () {
      this.$emit('showShare')
    }
  }
}
</script>

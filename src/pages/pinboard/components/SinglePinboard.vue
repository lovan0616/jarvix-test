<template>
    <div @click.stop="goToBoard" class="single-pinboard">
        <div class="pinboad-pin-box">
            <svg-icon icon-class="pin" class="icon pin-icon"></svg-icon>
        </div>
        <div class="pinboard-flex">
            <div class="pinboard-name">{{ boardInfo.name }}</div>
            <div class="pinboard-count">{{ $t('editing.pinboardNum') }}：1</div>
        </div>
        <div class="pinboad-hover-box">
            <svg-icon icon-class="hover" class="icon hover-icon"></svg-icon>

            <div class="pinboard-popup">
                <div @click.stop="showEdit" class="popup-flex">
                    <svg-icon icon-class="edit" class="icon popup-icon"></svg-icon>
                    <div class="popup-text">{{ $t('button.edit') }}</div>
                </div>

                <div @click.stop="showDelete" class="popup-flex border-line">
                    <svg-icon icon-class="delete" class="icon popup-icon"></svg-icon>
                    <div class="popup-text">{{ $t('button.delete') }}</div>
                </div>

                <div  @click.stop="showShare" class="popup-flex">
                    <svg-icon icon-class="share" class="icon popup-icon"></svg-icon>
                    <div class="popup-text">{{ $t('button.share') }}</div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>

export default {
  name: 'SinglePinboard',
  props: {
    boardInfo: {
      type: Object
    }
  },
  methods: {
    goToBoard () {
      this.$router.push({
        name: 'PagePinboard',
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

<template>
  <div class="build-data">
    <div class="dialog-body">
      {{ $t('editing.dataBuildingReminding') }}
    </div>
    <div class="dialog-footer">
      <div class="dialog-button-block">
        <button 
          class="btn btn-default"
          @click="$emit('next')"
        >{{ $t('button.confirm') }}</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ConfirmPage',
  data () {
    return {
    }
  }
}
</script>

<style lang="scss" scoped>
.build-data {
  height: 50vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center
}
</style>

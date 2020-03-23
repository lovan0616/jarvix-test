<template>
  <div @click="closeDialog" class="full-create-dialog">
    <h2>{{ $t('editing.addUser') }}</h2>
    <div @click.stop class="full-create-dialog-box">
        <slot></slot>
    </div>
    <div @click.stop class="dialog-btn-row">
      <button @click="closeDialog" class="dialog-btn">{{ $t('button.cancel') }}</button>
      <button @click="confirmBtn" class="dialog-btn dialog-create">{{ $t('button.submit') }}</button>
    </div>
  </div>
</template>

<script>

export default {
  name: 'FillDialog',
  methods: {
    closeDialog () {
      this.$emit('closeDialog')
    },
    confirmBtn () {
      this.$emit('confirmBtn')
    }
  }
}
</script>

<template>
    <div @click="closeDialog" class="dialog-box">
        <div @click.stop class="dialog-inner-box">
            <div @click="closeDialog">
                <svg-icon icon-class="close" class="icon dialog-close"></svg-icon>
            </div>
            <div class="dialog-select-text">{{ title }}</div>
            <slot></slot>
            <div class="dialog-select-flex">
                <div v-if="showBoth" @click="closeDialog" class="btn dialog-select-cancel">{{ $t('button.cancel') }}</div>
                <div @click="confirmBtn" class="btn btn-default dialog-change">{{ button }}</div>
            </div>
        </div>
    </div>
</template>

<script>

export default {
  name: 'WritingDialog',
  props: {
    title: { type: String, default: '' },
    button: { type: String, default: '' },
    showBoth: { type: Boolean, default: true }
  },
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
<style lang="scss" scoped>
.dialog-close:hover{
    opacity: 0.8;
}

.dialog-select-text{
    font-size: 24px;
    letter-spacing: 3px;
}

.dialog-select-input-box {
    padding-top: 24px;
}

.dialog-input-box-check {
    position: relative;

    .dialog-error {
        position: absolute;
        bottom: 12px;
        text-align: left;
    }
}

.dialog-select-input {
    width: 100%;
    height: 40px;
    font-size: 16px;
    color: #aaa;
    margin-bottom: 36px;
    background-color: transparent;
    border: 0px;
    border-bottom: 1px solid #fff;

    &:focus {
      outline: none;
    }
}

.dialog-select{
    height: 36px;
    width: 100%;
    margin-bottom: 16px;
    border-bottom: 1px solid;
}

.dialog-select-flex{
    display: flex;
    justify-content: flex-end;

    .dialog-select-cancel{
        margin-right: 15px;
        border: 1px solid #FFFFFF;
        line-height: 36px;
        cursor: pointer;
    }

    .dialog-select-cancel:hover{
        opacity: 0.8;
    }

    .dialog-change{
        background: #2AD2E2;
        line-height: 36px;
        cursor: pointer;
    }
}
</style>

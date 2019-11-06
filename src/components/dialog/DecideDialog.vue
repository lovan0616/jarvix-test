<template>
    <div @click="closeDialog" class="dialog-box">
        <div @click.stop class="dialog-inner-box">
            <div @click="closeDialog">
                <svg-icon icon-class="close" class="icon dialog-close"></svg-icon>
            </div>
            <div class="dialog-decide-text">{{ title }}</div>
            <div class="dialog-decide-flex">
                <div @click="closeDialog" class="btn dialog-decide-cancel">{{ $t('button.cancel') }}</div>
                <div v-if="type==='confirm'" @click="confirmBtn" class="btn btn-default dialog-decide-change-logout">{{ btnText }}</div>
                <div v-else-if="type==='delete'" @click="confirmBtn" class="btn btn-default dialog-decide-change-delete">{{ btnText }}</div>
            </div>
        </div>
    </div>
</template>

<script>

export default {
  name: 'DecideSelect',
  props: {
    title: { type: String, default: '' },
    type: { type: String, default: '' },
    btnText: {
      type: String,
      default: function () {
        return this.$t('button.delete')
      }
    }
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
.dialog-decide-text{
    font-size: 18px;
    text-align: center;
    padding: 28px 0px;
    letter-spacing: 3px;
}

.dialog-decide-flex{
    display: flex;
    justify-content: center;

    .dialog-decide-cancel{
        margin-right: 15px;
        border: 1px solid #FFFFFF;
        line-height: 36px;
        cursor: pointer;
    }

    .dialog-decide-cancel:hover{
        opacity: 0.8;
    }

    .dialog-decide-change-logout{
        background-color: #2AD2E2;
        line-height: 36px;
        cursor: pointer;
    }

    .dialog-decide-change-delete{
        background-color: rgba(255, 255, 255, 0.16);
        color: #2AD2E2;
        line-height: 36px;
        cursor: pointer;
    }

}
</style>

<template>
    <div @click="closeDialog" class="dialog-box">
        <div @click.stop class="dialog-inner-box">
            <div @click="closeDialog">
                <svg-icon icon-class="close" class="icon dialog-close"></svg-icon>
            </div>
            <div class="dialog-setting-text">{{ title }}</div>
            <div class="dialog-setting-flex">
                <div @click="closeDialog" class="btn dialog-setting-cancel">{{ $t('button.cancel') }}</div>
                <div v-if="type==='logout'" @click="confirmBtn" class="btn btn-default dialog-setting-change-logout">{{ $t('button.logout') }}</div>
                <div v-else-if="type==='delete'" @click="confirmBtn" class="btn btn-default dialog-setting-change-delete">{{ $t('button.delete') }}</div>
            </div>
        </div>
    </div>
</template>

<script>

export default {
  name: 'SettingSelect',
  props: {
    title: { type: String, default: '' },
    type: { type: String, default: '' }
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
.dialog-setting-text{
    font-size: 18px;
    text-align: center;
    padding: 28px 0px;
    letter-spacing: 3px;
}

.dialog-setting-flex{
    display: flex;
    justify-content: center;

    .dialog-setting-cancel{
        margin-right: 15px;
        border: 1px solid #FFFFFF;
        line-height: 36px;
        cursor: pointer;
    }

    .dialog-setting-cancel:hover{
        opacity: 0.8;
    }

    .dialog-setting-change-logout{
        background-color: #2AD2E2;
        line-height: 36px;
        cursor: pointer;
    }

    .dialog-setting-change-delete{
        background-color: rgba(255, 255, 255, 0.16);
        color: #2AD2E2;
        line-height: 36px;
        cursor: pointer;
    }

}
</style>

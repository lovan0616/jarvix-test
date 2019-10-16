<template>
    <div class="popup-dialog">
        <div @click.stop class="popup-inner-box">
            <div @click="closeDialog">
                <svg-icon icon-class="close" class="icon popup-close"></svg-icon>
            </div>
            <slot></slot>
        </div>
    </div>
</template>

<script>

export default {
  name: 'SetSelect',
  methods: {
    closeDialog () {
        this.$emit('closeDialog')
    }
  }
}
</script>
<style lang="scss" scoped>
.popup-dialog{
    position: fixed;
    top: 0px;
    left: 0px;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.7);
    cursor: text;
    color: #fff;

    .popup-inner-box{
        position: relative;
        width: 520px;
        padding: 24px;
        margin: 10% auto 0px;
        background: rgba(50, 58, 58, 0.95);
        box-shadow: 0px 4px 24px rgba(51, 51, 51, 0.5);
        border-radius: 5px;
        text-align: center;

        .popup-close{
            width: 26px;
            position: absolute;
            right: 0px;
            top: 0px;
            height: 34px;
            padding-right: 16px;
            font-size: 20px;
            color: #fff;
            cursor: pointer;
        }

        .popup-close:hover{
            opacity: 0.8;
        }

        .popup-text{
            font-size: 18px;
            text-align: center;
            padding: 24px 0px;
            letter-spacing: 3px;
        }

        .popup-flex{
            display: flex;
            justify-content: center;
        }

        .popup-cancel{
            margin-right: 15px;
            border: 1px solid #FFFFFF;
            line-height: 36px;
            cursor: pointer;
        }

        .popup-cancel:hover{
            opacity: 0.8;
        }

        .popup-logout{
            background: #2AD2E2;
            line-height: 36px;
            cursor: pointer;
        }

        .popup-cancel:hover{
            opacity: 0.8;
        }

        .popup-lang-text{
            height: 36px;
            margin-top: 24px;
            font-size: 18px;
            letter-spacing: 3px;
        }

        .popup-lang-select{
            height: 36px;
            width: 91%;
            margin-bottom: 16px;
            border-bottom: 1px solid;
        }

        .popup-lang-flex{
            display: flex;
            justify-content: flex-end;
            padding-right: 24px;
        }
    }
}
</style>

<template>
    <div class="dropdwon-select">
         <div class="dropdwon-select-box">
            <div :class="['dropdwon-flex', { 'dropdwon-border-line': index !== barData.length - 1 }]"
            v-for="(bar, index) in barData"
            @click="dialogEvent(bar)"
            :key="index"
             >
                <svg-icon :icon-class="bar.icon" class="icon dropdwon-icon"></svg-icon>
                <div>{{ $t(bar.title) }}</div>
            </div>
        </div>
    </div>
</template>

<script>

export default {
  name: 'DropdownSelect',
  props: {
    barData: {
      type: Array,
      default () {
        return {}
      }
    }
  },
  methods: {
    dialogEvent (bar) {
      if (bar.event === 'switchDialog') {
        this.$emit('switchDialogName', bar.dialogName)
      } else {
        this.$router.push(bar.path)
      }
    }
  }
}
</script>
<style lang="scss" scoped>

.dropdwon-select-box{
    position: absolute;
    top: 50px;
    left: -100px;
    background: #233131;
    border-radius: 8px;
    font-size: 14px;

    .dropdwon-flex{
        height: 40px;
        width: 160px;
        align-items: center;
        display: flex;
        color: #a7a7a7;
    }

    .dropdwon-flex:hover{
        color: #fff;
    }

    .dropdwon-border-line{
        border-bottom: 1px solid #384545;
    }

    .dropdwon-icon{
        margin: 12px;
    }
}

.dropdwon-select-box::before{
    content: '';
    display: block;
    position: absolute;
    top: -8px;
    right: 32px;
    border-color: transparent transparent #233131 transparent;
    border-style: solid;
    border-width: 0px 10px 10px 10px;
    height: 0px;
    width: 0px;
}
</style>

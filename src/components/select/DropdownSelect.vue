<template>
    <div class="dropdown-select">
         <div class="dropdown-select-box">
            <div :class="['dropdown-flex', { 'dropdown-border-line': index !== barData.length - 1 }]"
              v-for="(bar, index) in barData"
              @click="dialogEvent(bar)"
              :key="index"
             >
                <svg-icon v-if="bar.icon" :icon-class="bar.icon" class="icon dropdown-icon"></svg-icon>
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
        return []
      }
    }
  },
  methods: {
    dialogEvent (bar) {
      if (bar.path) {
        this.$router.push(bar.path)
      } else {
        this.$emit('switchDialogName', bar.dialogName)
      }
    }
  }
}
</script>
<style lang="scss" scoped>

.dropdown-select-box{
    position: absolute;
    top: 50px;
    left: -100px;
    background: #233131;
    border-radius: 8px;
    font-size: 14px;

    .dropdown-flex{
        height: 40px;
        width: 160px;
        align-items: center;
        display: flex;
        color: #a7a7a7;
    }

    .dropdown-flex:hover{
        color: #fff;
    }

    .dropdown-border-line{
        border-bottom: 1px solid #384545;
    }

    .dropdown-icon{
        margin: 12px;
    }
}

.dropdown-select-box::before{
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

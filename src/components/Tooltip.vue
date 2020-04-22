<template>
    <div class="dropdown-select">
         {{content}}
    </div>
</template>

<script>

export default {
  name: 'Tooltip',
  props: {
    content: {
      type: String,
      default: ''
    }
  }
}
</script>
<style lang="scss" scoped>

.dropdown-select {
    position: absolute;
    top: 50px;
    right: -15px;
    background: #233131;
    border-radius: 8px;
    font-size: 14px;
    // width: 200px;
    padding: 3px 10px;
}

.dropdown-select::before{
    content: '';
    display: block;
    position: absolute;
    bottom: 100%;
    left: 88%;
    transform: translateX(-50%);
    border-color: transparent transparent #233131 transparent;
    border-style: solid;
    border-width: 0px 10px 10px 10px;
    height: 0px;
    width: 0px;
}
</style>

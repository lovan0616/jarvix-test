<template>
  <div class="set-select">
      <div>設定</div>
      <div class="set-popup">
          <div class="set-flex">
              <div>icon</div>
              <div>語言設定:簡中</div>
          </div>
          <div class="set-flex">
              <div>icon</div>
              <div>登出</div>
          </div>
      </div>
  </div>
</template>

<script>

export default {
  name: 'SetSelect',
  props: {
  }
}
</script>
<style lang="scss" scoped>
.set-select{
    position: relative;
}

.set-flex{
    display: flex;
}

.set-popup{
    height: 160px;
    width: 60px;
    position: absolute;
    top: 50px;
    left: -100px;
    background: #233131;
    border-radius: 8px;
}
</style>
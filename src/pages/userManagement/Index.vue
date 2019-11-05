<template>
  <div class="user-management">
    <div @click="isShowCreateUser = true" class="user-add">
      <svg-icon icon-class="triangle" class="icon"></svg-icon>
      建立使用者
    </div>
    <!-- <div class="user-default">尚未建立使用者</div> -->
    <div class="user-row">
      <SingleUser></SingleUser>
    </div>
    <div @click="isShowCreateUser = false" class="full-create-dialog" v-if="isShowCreateUser">
      <h2>建立使用者</h2>
      <div @click.stop class="full-create-dialog-box">
        <input class="dialog-input" type="text" placeholder="使用者名稱">
        <input class="dialog-input" type="text" placeholder="使用者帳號">
        <input class="dialog-input" type="text" placeholder="登入密碼">
        <input class="dialog-input" type="text" placeholder="確認密碼">
      </div>
      <div class="dialog-btn-row">
        <button class="dialog-btn">取消</button>
        <button class="dialog-btn dialog-create">建立</button>
      </div>
    </div>
  </div>
</template>
<script>

import SingleUser from './components/SingleUser'
export default {
  name: 'UserManagement',
  components: {
    SingleUser
  },
  data () {
    return {
      isShowCreateUser: false
    }
  },
  mounted () {

  },
  methods: {

  },
  computed: {

  }
}
</script>
<style lang="scss" scoped>
.user-management {
  padding: 24px;
  background: rgba(0, 0, 0, 0.55);
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.12);
  border-radius: 8px;

  .user-add {
    width: 105px;
    height: 30px;
    font-size: 14px;
    line-height: 30px;
    text-align: center;
    color: #fff;
    background: #1EB8C7;
    border-radius: 5px;
    margin-bottom: 16px;
    cursor: pointer;
  }

  .user-default {
    padding: 19px 0px;
    text-align: center;
    color: #ccc;
    background: rgba(35, 61, 64, 0.6);
    border: 1px solid #05282C;
    box-sizing: border-box;
    border-radius: 8px;
  }

}
</style>

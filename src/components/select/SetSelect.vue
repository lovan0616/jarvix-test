<template>
    <div class="set-select">
         <div class="set-select-box">
            <div @click="showLang" class="set-flex">
                <svg-icon icon-class="language" class="icon set-icon"></svg-icon>
                <div>{{ $t('editing.languageSetting') }}: {{ $t('lang') }}</div>
            </div>
            <div @click="showLogout" class="set-flex">
                <svg-icon icon-class="logout" class="icon set-icon"></svg-icon>
                <div>{{ $t('button.logout') }}</div>
            </div>
        </div>
    </div>
</template>

<script>
import { mapGetters } from 'vuex'
import SySelect from '@/components/select/SySelect'

export default {
  name: 'SetSelect',
  components: {
    SySelect
  },
  methods: {
    showLang () {
      this.$emit('showLang')
    },
    showLogout () {
      this.$emit('showLogout')
    }
  },
  computed: {
    ...mapGetters('profile', ['language', 'languages']),
    selectItems () {
      return Object.keys(this.languages).map(key => {
        return {
          id: key,
          name: this.languages[key]
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>

.set-select-box{
    height: 80px;
    width: 160px;
    position: absolute;
    top: 50px;
    left: -100px;
    background: #233131;
    border-radius: 8px;
    font-size: 14px;

    .set-flex{
        height: 50%;
        align-items: center;
        display: flex;
        border-bottom: 1px solid #384545;
        color: #a7a7a7;
    }

    .set-flex:hover{
        color: #fff;
    }

    .set-icon{
        margin: 0px 6px;
    }
}

.set-select-box::before{
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

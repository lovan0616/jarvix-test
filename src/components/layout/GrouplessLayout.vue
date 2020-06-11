<template>
  <div class="groupless-layout">
    <p class="guiding">{{ $t('guiding.notBelongToGroups') }}</p>
    <p 
      v-if="hasPermission('account_create_group')" 
      class="guiding">{{ $t('guiding.pleaseCreateOrJoinGroup') }}</p>
    <p 
      v-else 
      class="guiding">{{ $t('guiding.pleaseInformManager') }}</p>
    <router-link
      v-if="hasPermission('account_create_group')"
      :to="{ name: 'AccountGroupManagement' }" 
      class="link">{{ this.$t('message.goToGroupManagement') }}</router-link>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import store from '@/store'

export default {
  name: 'GrouplessLayout',
  data () {
    return {
      accountRole: null
    }
  },
  beforeRouteEnter (to, from, next) {
    const currentAccount = store.getters['userManagement/getCurrentAccountId']
    const currentGroup = store.getters['userManagement/getCurrentGroupId']
    currentAccount && !currentGroup ? next() : next({ name: 'PageIndex' })
  },
  computed: {
    ...mapGetters('userManagement', ['hasPermission']),
  }
}
</script>

<style lang="scss" scoped>
.groupless-layout {
  width: 100%;
  height: calc(100vh - #{$header-height});
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  .guiding {
    margin: 0;
    font-size: 24px;
    line-height: 40px;
    text-align: center;
  }

  .link {
    margin-top: 28px;
  }
}
</style>
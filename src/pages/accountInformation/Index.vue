<template>
  <div class="account-info">
    <div class="page-title-row">
      <h1 class="title">{{ $t('sideNav.accountInformation') }}</h1>
    </div>
    <section class="info-wrapper">
      <spinner
        v-if="isLoading"
        class="spinner"
      />
      <template v-else>
        <div class="info-block">
          <h3 class="info-title">
            {{ $t('accountInfo.userAmount') }}
          </h3>
          <div class="sub-info-block">
            <h6 class="sub-info-title">
              {{ $t('accountInfo.currentUserAmount') }}
            </h6>
            <p class="sub-info-desciption">
              {{ license.currentUser || '-' }}
              {{ $tc('accountInfo.person', license.currentUser) }}
            </p>
          </div>
          <div class="sub-info-block">
            <h6 class="sub-info-title">
              {{ $t('accountInfo.userAmountLimit') }}
            </h6>
            <p class="sub-info-desciption">
              {{ license.maxUser || '-' }}
              {{ $tc('accountInfo.person', license.maxUser) }}
            </p>
          </div>
        </div>
        <div class="info-block">
          <h3 class="info-title">
            {{ $t('accountInfo.dataAllowance') }}
          </h3>
          <div class="sub-info-block">
            <h6 class="sub-info-title">
              {{ $t('accountInfo.currentDataUsage') }}
            </h6>
            <p class="sub-info-desciption">
              {{ shortenDataCapacityNumber(license.currentDataStorageSize) || '-' }}
            </p>
          </div>
          <div class="sub-info-block">
            <h6 class="sub-info-title">
              {{ $t('accountInfo.dataUsageProvided') }}
            </h6>
            <p class="sub-info-desciption">
              {{ shortenDataCapacityNumber(license.showMaxDataStorageSize) || '-' }}
            </p>
          </div>
        </div>
        <div class="info-block">
          <h3 class="info-title">
            {{ $t('accountInfo.expireDate') }}
          </h3>
          <div class="sub-info-block">
            <p class="sub-info-desciption">
              {{ license.expiredTime | convertTimeStamp }}
            </p>
          </div>
        </div>
      </template>
    </section>
  </div>
</template>
<script>
import { getAccountInfo } from '@/API/Account'

export default {
  name: 'AccountInfo',
  data () {
    return {
      isLoading: true,
      license: {
        maxUser: null,
        currentUser: null,
        maxDataStorageSize: null,
        currentDataStorageSize: null,
        expiredTime: null
      }
    }
  },
  mounted () {
    this.fetchData()
  },
  methods: {
    fetchData () {
      this.isLoading = true
      getAccountInfo()
        .then(accountInfo => {
          this.license = accountInfo.license
          this.$store.commit('userManagement/setLicenseInfo', accountInfo.license)
        })
        .finally(() => { this.isLoading = false })
    }
  }
}
</script>

<style lang="scss" scoped>
.account-info {
  .page-title-row {
    margin-bottom: 14px;

    .title {
      margin: 0;
      font-size: 24px;
      line-height: 32px;
    }
  }
}

.info-wrapper {
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: repeat(2, 76px) 50px;
  grid-gap: 12px;
  background: var(--color-bg-5);
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.12);
  border-radius: 8px;
  padding: 24px 20px;

  .spinner {
    grid-row: 2 / 3;
  };

  .info-block {
    display: grid;
    grid-template-columns: 180px 260px auto;
    background: rgba(35, 61, 64, 0.6);
    padding: 12px 16px;
  }

  .info-title {
    margin: 0;
    font-size: 16px;
  }

  .sub-info-block {
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: space-between;

    &:not(:last-of-type)::after {
      position: absolute;
      right: 12%;
      content: '';
      width: 1px;
      height: 50px;
      background: #52696A;
      transform: rotate(25deg);
    }
  }

  .sub-info-title {
    margin: 0;
    font-size: 13px;
    color: #CCCCCC;
  }

  .sub-info-desciption {
    margin: 0;
    font-size: 18px;
    color: #FFFFFF;
  }
}
</style>

<template>
  <div class="account-info">
    <div class="page-title-row">
      <h1 class="title">{{ $t('sideNav.accountInformation') }}</h1>
    </div>
    <section class="account-info-block">
      <h2 class="account-info-block__title">
        {{ $t('accountInfo.accountLimitation') }}
      </h2>
      <spinner
        v-if="isLoading"
        class="spinner"
      />
      <template v-else>
        <div class="info-wrapper">
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
                {{ license.maxUser === -1 ? '&#8734;' : (`${license.maxUser} ${$tc('accountInfo.person', license.maxUser)}` || '-') }}
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
                {{ license.showMaxDataStorageSize === -1 ? '&#8734;' : (shortenDataCapacityNumber(license.showMaxDataStorageSize) || '-') }}
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
        </div>
      </template>
    </section>
    
    <section class="account-info-block usage-status">
      <h2 class="account-info-block__title">
        {{ $t('accountInfo.accountUsageStatus') }}
      </h2>
      <h3 class="account-info-block__description">
        {{ $t('accountInfo.projectAmount', { amount: groupStatus.groupCount }) }}
      </h3>
      <spinner
        v-if="isLoading"
        class="spinner"
      />
      <template v-else>
        <empty-info-block
          v-if="groupStatus.groupUsageList.length === 0"
        />
        <div 
          v-for="(groupUsage, index) in groupStatus.groupUsageList"
          :key="index"
          class="usage-status__item item">
          <h3 class="item__title">
            {{ groupUsage.groupName }}
          </h3>
          <div class="item__info">
            <h3 class="item__info--title"> {{ $t('accountInfo.dataFrameAmount') }} </h3>
            <div class="item__info--amount"> {{ groupUsage.dataSourceCount }} </div>
          </div>
          <div class="item__info">
            <h3 class="item__info--title"> {{ $t('accountInfo.pinBoardAmount') }} </h3>
            <div class="item__info--amount"> {{ groupUsage.pinBoardCount }} </div>
          </div>
          <div class="item__info">
            <h3 class="item__info--title"> {{ $t('accountInfo.warRoomAmount') }} </h3>
            <div class="item__info--amount"> {{ groupUsage.warRoomCount }} </div>
          </div>
        </div>
      </template>
    </section>
  </div>
</template>
<script>
import { getAccountInfo } from '@/API/Account'
import EmptyInfoBlock from '@/components/EmptyInfoBlock'

export default {
  name: 'AccountInfo',
    components: {
      EmptyInfoBlock
  },
  data () {
    return {
      isLoading: true,
      license: {
        maxUser: null,
        currentUser: null,
        maxDataStorageSize: null,
        currentDataStorageSize: null,
        expiredTime: null
      },
      groupStatus: {
        groupCount: null,
        groupUsageList: []
      },
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
          this.groupStatus = accountInfo.groupStatus
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

.account-info-block {
  margin-bottom: 16px;
  background: var(--color-bg-5);
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.12);
  border-radius: 8px;
  padding: 24px 20px;

  &__title {
    position: relative;
    margin: 0 0 8px 15px;
    font-size: 20px;
    line-height: 32px;

    &::before {
      position: absolute;
      top: 13px;
      left: -13px;
      content: "";
      width: 6px;
      height: 6px;
      background: #4DE2F0;
    }
  }

  &__description {
    margin: 0 0 8px 0;
    color: #CCCCCC;
    font-size: 16px;
    line-height: 26px;
  }
}

.info-wrapper { 
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: repeat(2, 76px) 50px;
  grid-gap: 12px;

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
    font-weight: normal;
    font-size: 13px;
    color: #CCCCCC;
  }

  .sub-info-desciption {
    margin: 0;
    font-size: 18px;
    color: #FFFFFF;
  }
}

.usage-status {

  .item {
    display: flex;
    align-items: center;
    height: 80px;
    padding: 20px 64px 20px 16px;
    background: rgba(35, 61, 64, 0.6);

    &:not(:last-child) {
      margin-bottom: 8px;
    }

    &__title {
      flex: 1;
      margin: 0;
      font-size: 16px;
      line-height: 26px;
    }

    &__info {
      display: flex;
      flex-direction: row;
      align-items: center;

      &:not(:last-child) {
        margin-right: 40px;
      }

      &--title {
        margin-right: 8px;
        color: #CCCCCC;
        font-weight: normal;
        font-size: 16px;
        line-height: 22px;
      }

      &--amount {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 40px;
        height: 40px;
        border-radius: 50%;
        border: 1px solid var(--color-theme);
        font-size: 14px;
        line-height: 20px;
      }
    }
  }
}
</style>

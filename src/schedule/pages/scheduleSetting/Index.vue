<template>
  <div class="page">
    <aside class="page__navigator">
      <side-nav :nav-items="nav" />
    </aside>
    <main class="page__main">
      <transition
        name="fade"
        mode="out-in"
      >
        <router-view />
      </transition>
    </main>
  </div>
</template>

<script>
import SideNav from '@/components/layout/SideNav'

export default {
  name: 'ScheduleSetting',
  components: {
    SideNav
  },
  computed: {
    nav () {
      return [
        {
          title: this.$t('schedule.header.setting'),
          icon: 'filter-setting',
          subNav:
            [
              { title: this.$t('schedule.setting.title'), routeName: 'ScheduleBaseSetting' },
              { title: this.$t('schedule.setting.commonDataSetting'), routeName: 'ScheduleCommonDataSetting' },
              { title: this.$t('schedule.setting.extraConstraintSetting'), routeName: 'ScheduleConstraintSetting' },
              { title: this.$t('schedule.setting.versionManagement'), routeName: 'ScheduleVersionManagement' }
            ]
        }
      ]
    }
  }
}
</script>

<style lang="scss" scoped>
.page {
  height: 100%;
  display: flex;
  &__navigator {
    flex: 0 0 $side-nav-width;
  }
  &__main {
    flex: 1;
    overflow: auto;
    overflow: overlay;
  }
  .save-btn {
    height: 40px;
    margin-top: 16px;
    border-radius: 6px;
  }
  ::v-deep .setting {
    padding: 24px;
    .header__title {
      margin-top: 0;
    }
  }
  ::v-deep .file {
    background: rgba(0, 0, 0, 0.55);
    box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.12);
    border-radius: 8px;
    &:not(:last-child) {
      margin-bottom: 16px;
    }
    &__item {
      width: 100%;
      padding: 24px;
      border-radius: 8px;
      display: flex;
      justify-content: space-between;
      background: rgba(35, 61, 64, 0.6);
    }

    &__item-info {
      flex: 1;
    }

    &__item-title {
      font-size: 18px;
      margin-bottom: 13px;
      font-weight: 600;
    }

    &__item-description {
      display: flex;
      font-size: 14px;
    }

    &__item-name {
      flex: 3;
      width: 245px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      &.is-empty {
        color: #AAA;
      }
    }
    &__item-date {
      flex: 2;
      &.is-empty {
        color: #AAA;
      }
    }

    &__item-button-block {
      display: flex;
      justify-content: flex-end;
    }

    &__item-button {
      margin-left: 12px;
      display: flex;
      align-items: center;
    }
  }
  .empty-block {
    flex-basis: 100%;
    height: 60px;
    line-height: 60px;
    font-size: 14px;
    color: #CCC;
    text-align: center;
    background-color: rgba(100, 100, 100, .2);
    border-radius: 4px;
  }
}
</style>

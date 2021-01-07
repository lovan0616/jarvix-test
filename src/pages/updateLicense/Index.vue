<template>
  <div class="update-license">
    <div class="page-title-row">
      <h1 class="title">{{ $t('sideNav.updateLicense') }}</h1>
    </div>
    <section class="license-info">
      <form 
        class="license-info__form"
        @submit.prevent="confirmUpdate"
      >
        <div class="license-info__input-block">
          <h2 class="license-info__title">{{ $t('updateLicense.licenseKey') }}</h2>
          <textarea
            v-validate="`required`"
            v-model.trim="licenseInfo.newLicense"
            :placeholder="$t('updateLicense.placeholder') + $t('updateLicense.licenseKey')"
            :disabled="isLoading"
            class="license-info__input"
            rows="5"
            name="newLicense"
          />
          <div
            v-show="errors.has('newLicense')"
            class="error-text"
          >{{ errors.first('newLicense') }}</div>
        </div>
        <div class="license-info__input-block">
          <h2 class="license-info__title">{{ $t('updateLicense.publicKey') }}</h2>
          <textarea
            v-validate="`required`"
            v-model.trim="licenseInfo.newPublicKey"
            :placeholder="$t('updateLicense.placeholder') + $t('updateLicense.publicKey')"
            :disabled="isLoading"
            class="license-info__input"
            rows="5"
            name="newPublicKey"
          />
          <div
            v-show="errors.has('newPublicKey')"
            class="error-text"
          >{{ errors.first('newPublicKey') }}</div>
        </div>
        <div class="license-info__button-block">
          <button 
            :class="isLoading ? 'btn-has-icon' : ''"
            type="submit"
            class="btn btn-default btn-update"
          >
            <svg-icon 
              v-if="isLoading"
              icon-class="spinner"
            />
            {{ isLoading ? $t('button.processing') : $t('button.update') }}
          </button>
        </div>
      </form>
    </section>
  </div>
</template>

<script>
import { updateLicense } from '@/API/Account'
import { mapGetters } from 'vuex'
import { Message } from 'element-ui'

export default {
  inject: ['$validator'],
  name: 'UpdateLicensePage',
  data () {
    return {
      licenseInfo: {
        newLicense: null,
        newPublicKey: null
      },
      newLicense: null,
      isLoading: false
    }
  },
  computed: {
    ...mapGetters('userManagement', ['getCurrentAccountId']),
  },
  methods: {
    confirmUpdate () {
      this.$validator.validateAll().then(result => {
        if (!result) return
        this.isLoading = true
        updateLicense(this.getCurrentAccountId, this.licenseInfo).then(() => {
          Message({
            message: this.$t('message.updateLicenseSuccess'),
            type: 'success',
            duration: 3 * 1000,
            showClose: true
          })

          window.setTimeout(() => {
            window.location.reload()
          }, 1000)
        }).finally(() => {
          this.isLoading = false
        })
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.update-license {
  .page-title-row {
    margin-bottom: 14px;

    .title {
      margin: 0;
      font-size: 24px;
      line-height: 32px;
    }
  }


  .license-info {
    margin-bottom: 16px;
    background: var(--color-bg-5);
    box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.12);
    border-radius: 8px;
    padding: 24px 20px;

    .error-text {
      position: absolute;
      bottom: 0;
      left: 0;
    }

    &__title {
      margin-top: 0;
      margin-bottom: 8px;
      font-size: 20px;
      line-height: 32px;
    }

    &__input-block {
      position: relative;
    }

    &__input {
      width: 100%;
      height: 40vh;
      background-color: rgba(35, 61, 64, .6);
      border-radius: 8px;
      padding: 16px;
      margin-bottom: 16px;
    }

    &__button-block {
      display: flex;
      justify-content: flex-end;
    }
  }
}
</style>
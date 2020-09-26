<template>
  <div class="form new-invitee">
    <a
      v-if="isShowDelete"
      href="javascript:void(0)"
      class="form__delete"
      @click="removeInvitee">
      <svg-icon 
        icon-class="delete" 
        class="icon"/>
    </a>
    <div class="form__block">
      <span class="form__label">{{ $t('userManagement.userAccount') }}</span>
      <input-verify
        v-validate="'required|email'"
        v-model="invitee.email"
        :class="{'has-error': errors.has('email' + '-' + invitee.id)}"
        :placeholder="$t('userManagement.emailPlaceholder')"
        :name="'email' + '-' + invitee.id"
        type="email"
      />
    </div>
    <div class="form__block">
      <span class="form__label">
        {{ $t('userManagement.userRoleAuthority') }}
        <span class="tooltip-container">
          <svg-icon 
            icon-class="information-circle" 
            class="icon" />
          <div class="tooltip">
            <role-desc-pop />
          </div>
        </span>
      </span>
      <default-select 
        v-model="invitee.accountRoleId"
        :option-list="roleOptions"
        class="input"
      />
    </div>
    <div class="form__block">
      <span class="form__label"> {{ $t('userManagement.userName') }} </span>
      <input-verify
        v-validate="'required'"
        v-model="invitee.username"
        :placeholder="$t('userManagement.userNamePlaceholder')"
        :name="'name' + '-' + invitee.id"
      />
    </div>
    <div class="form__block">
      <span class="form__label"> {{ $t('userManagement.userPassword') }} </span>
      <input-verify
        v-validate="'required|min:8|requireOneNumeric'"
        ref="confirmPassword"
        v-model="invitee.password"
        :placeholder="$t('editing.newPassword')"
        :name="'password' + '-' + invitee.id"
        :type="passwordType"
      />
      <a
        href="javascript:void(0)"
        class="form__see-password"
        @click="changePasswordType">
        <svg-icon
          icon-class="view-data" 
          class="icon" />
      </a>
    </div>
  </div>
</template>
<script>
import RoleDescPop from './RoleDescPop'
import InputVerify from '@/components/InputVerify'
import DefaultSelect from '@/components/select/DefaultSelect'

export default {
  inject: ['$validator'],
  name: 'CreateUserForm',
  components: {
    RoleDescPop,
    InputVerify,
    DefaultSelect
  },
  props: {
    isShowDelete: {
      type: Boolean,
      default: false
    },
    roleOptions: {
      type: Array,
      default: () => []
    },
    invitee: {
      type: Object,
      default: () => {}
    }
  },
  data (){
    return {
      passwordType: 'password',
    }
  },
  methods: {
    changePasswordType () {
      this.passwordType = this.passwordType === 'password' ? 'text' : 'password'
    },
    removeInvitee () {
      this.$emit('removeInvitee')
    }
  }
}
</script>
<style lang="scss" scoped>
.form {
  position: relative;
  width: 652px;
  padding: 16px;
  background: rgba(72, 84, 84, 0.9);
  border-radius: 12px;
  margin-bottom: 16px;

  .tooltip-container {
    margin: 0 3px;
    .tooltip {
      width: 212px;
      white-space: normal;
      padding: 12px;
      line-height: 14px;
      z-index: 2010;
    }

    .icon {
      color: $theme-color-warning;
    }
  }

  &__delete {
    position: absolute;
    top: 18px;
    right: 18px;
    color: var(--color-white);

    &:hover {
      color: #4DE2F0;
    }
  }

  &__see-password {
    position: absolute;
    top: 33px;
    right: 0;
    color: var(--color-white);
    
    &:hover {
      color: #4DE2F0;
    }
  }

  &__block {
    position: relative;
    display: inline-block;
    width: 48%;
    margin-right: 1%;

    /deep/ .input-verify {
      margin-bottom: 16px;

      .error-text {
        bottom: -20px;
      }
      
      .input-verify-text {
        margin-bottom: 0;
      }
    }
  }

  &__label {
    margin-bottom: 3px;
  }

  .has-error {
    margin-bottom: 32px;
  }
}
</style>
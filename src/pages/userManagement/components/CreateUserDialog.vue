<template>
  <div class="create-user-dialog full-create-dialog">
    <h2>{{ $t('userManagement.createUser') }}</h2>
    <div 
      class="full-create-dialog-box" 
      @click.stop>
      <div
        v-for="(invitee, index) in inviteeList"
        :key="invitee.id"
        class="form new-invitee">
        <div
          v-if="inviteeList.length > 1"
          class="form__delete"
          @click="removeInvitee(index)">
          <svg-icon 
            icon-class="delete" 
            class="icon"/>
        </div>
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
            :type="invitee.inputType"
          />
          <div 
            class="form__see-password"
            @click="seePassword(index)">
            <svg-icon
              icon-class="view-data" 
              class="icon" />
          </div>
        </div>
      </div>
      <button
        class="btn btn-m btn-outline"
        @click="addNewInvitee()"
      >
        <svg-icon 
          icon-class="plus" 
          class="icon" />{{ $t('button.add') }}
      </button>
    </div>
    <div 
      class="dialog-btn-row" 
      @click.stop>
      <button
        :disabled="isProcessing"
        class="btn btn-outline dialog-btn"
        @click="closeDialog">
        {{ $t('button.cancel') }}
      </button>
      <button
        :disabled="isProcessing"
        class="btn btn-default dialog-btn dialog-create"
        @click="confirmBtn">
        <svg-icon 
          v-if="isProcessing" 
          icon-class="spinner"/>
        {{ $t('button.submit') }}
      </button>
    </div>
  </div>
</template>

<script>
import RoleDescPop from './RoleDescPop'
import InputVerify from '@/components/InputVerify'
import DefaultSelect from '@/components/select/DefaultSelect'
let inviteeId = 0

export default {
  inject: ['$validator'],
  name: 'CreateUserDialog',
  components: {
    RoleDescPop,
    InputVerify,
    DefaultSelect
  },
  props: {
    isProcessing: {
      type: Boolean,
      default: false
    },
    roleOptions: {
      type: Array,
      default: () => []
    },
    accountViewerRoleId: {
      type: Number,
      default: null
    }
  },
  data (){
    return {
      inviteeList: []
    }
  },
  computed: {
    currentAccountId () {
      return this.$store.getters['userManagement/getCurrentAccountId']
    }
  },
  mounted (){
    this.addNewInvitee()
  },
  destroyed () {
    this.inviteeList = []
  },
  methods: {
    addNewInvitee () {
      this.inviteeList.push({
        id: inviteeId++,
        accountId: this.currentAccountId,
        accountRoleId: this.accountViewerRoleId,
        email: '',
        password: '00000000',
        username: '',
        inputType: 'password'
      })
    },
    removeInvitee (index) {
      this.inviteeList.splice(index, 1)
    },
    seePassword (index){
      this.inviteeList[index].inputType = this.inviteeList[index].inputType === 'password' ? 'text' : 'password'
    },
    closeDialog () {
      this.$emit('closeDialog')
    },
    confirmBtn () {
      this.$validator.validateAll().then(result => {
        if (!result) return
        this.$emit('confirmBtn', this.inviteeList, 'createUser')
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.full-create-dialog {

  &-box {
    padding: 19px 16px;
  }
  
  .form {
    position: relative;
    padding: 16px;
    background: rgba(72, 84, 84, 0.9);
    border-radius: 12px;
    margin-bottom: 16px;

    &__delete {
      position: absolute;
      top: 18px;
      right: 18px;

      &:hover {
        color: #4DE2F0;
      }
    }

    &__see-password {
      position: absolute;
      top: 33px;
      right: 0;
      
      &:hover {
        color: #4DE2F0;
      }
    }

    &__block {
      position: relative;
      display: inline-block;
      width: 48%;
      margin-right: 1%;
    }

    &__label {
      margin-bottom: 3px;
    }

    /deep/ .input-verify {
      margin-bottom: 16px;

      .error-text {
        bottom: -20px;
      }
      
      &-text {
        margin-bottom: 0;
      }
    }

    .has-error {
      margin-bottom: 32px;
    }
  }

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

  /deep/ .dialog-box {
    .dialog-inner-box {
      .label {
        font-size: 13px;
        text-align: left;
        margin-bottom: 8px;
      }
      .dialog-select-input-box {
        margin-bottom: 16px;
        .el-input__inner {
          padding-left: 0;
        }
      }
      .dialog-button-block {
        .btn.dialog-decide-cancel {
          background-color: #2AD2E2;
          border: none;
        }
      }
    }
  }

}
</style>

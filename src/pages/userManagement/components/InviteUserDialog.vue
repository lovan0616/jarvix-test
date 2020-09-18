<template>
  <div class="invite-user-dialog full-create-dialog">
    <h2>{{ $t('userManagement.inviteUser') }}</h2>
    <div 
      class="full-create-dialog-box" 
      @click.stop>
      <div class="form new-invitee">
        <div class="form__labels">
          <span class="label-invitee-email">{{ $t('editing.inviteeEmail') }}</span>
          <span class="label-user-role-authority">
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
        </div>
        <div 
          v-for="(invitee, index) in inviteeList"
          :key="invitee.id"
          class="form__item">
          <input-verify
            v-validate="'required|email'"
            v-model="invitee.email"
            :placeholder="$t('userManagement.inviteeEmailPlaceholder')"
            :name="'invitee' + '-' + invitee.id"
            type="email"
          />
          <default-select 
            v-model="invitee.roleId"
            :option-list="roleOptions"
            class="input"
          />
          <div
            v-if="inviteeList.length > 1"
            class="form__delete"
            @click="removeInvitee(index)">
            <svg-icon 
              icon-class="delete" 
              class="icon"/>
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
        {{ $t('button.sendInvitation') }}
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
  name: 'InviteUserDialog',
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
        email: '',
        roleId: this.accountViewerRoleId
      })
    },
    removeInvitee (index) {
      this.inviteeList.splice(index, 1)
    },
    closeDialog () {
      this.$emit('closeDialog')
    },
    confirmBtn () {
      this.$validator.validateAll().then(result => {
        if (!result) return
        this.$emit('confirmBtn', this.inviteeList, 'inviteUser')
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.invite-user-dialog {

  .form {
    width: 652px;
    padding: 36px 76px;

    &__delete {
      display: inline-block;
      &:hover {
        color: #4DE2F0;
      }
    }

    &__labels {
      display: flex;
      margin-bottom: 20px;
      font-size: 14px;
      height: 21px;
      overflow: visible;
      .label-invitee-email {
        flex: 0 0 262px;
      }
      .label-user-role-authority {
        flex: 0 0 168px;
        margin-left: 13px;
        display: flex;
        align-items: center;
      }
    }

    &__item {
      .input-verify {
        display: inline-block;
        width: 260px;
        [lang="en"] & {
          width: 244px;
        }
      }
      .el-select {
        display: inline-block;
        width: 168px;
        height: 40px;
        border-bottom-color: #fff;
        margin: 0 13px;
        /deep/ .el-input__inner {
          padding-left: 0;
        }
      }
      .remove {
        position: absolute;
        top: 0;
        right: 0;
        line-height: 40px;
      }
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


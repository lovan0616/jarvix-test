<template>
  <div class="group-creation">
    <div class="page-title-row">
      <h1 class="title">{{ $t('sideNav.groupCreateUser') }}</h1>
      <div class="bread-crumb">
        <router-link
          :to="{name: 'GroupUserList', params: {group_id: $route.params.group_id}}"
          class="title-link"
        >{{ $t('sideNav.groupUserList') }}</router-link>
        <span class="divider">/</span>{{ $t('sideNav.groupCreateUser') }}
      </div>
    </div>
    <form
      class="group-creation-form"
      @submit.stop.prevent="submitForm"
    >
      <div class="input-wrapper">
        <div class="input-group">
          <div class="input-label">{{ $t('editing.inviteeEmail') }}：</div>
          <div
            :class="{'has-error': errors.has('invitee')}"
            class="input-block"
          >
            <default-select
              v-validate="'required'"
              :value="selectedInvitee"
              :option-list="userList"
              :placeholder="$t('editing.pleaseSelectInviteeEmail')"
              class="input"
              name="invitee"
              @input="updateSelectedInvitee"
            />
            <div
              v-if="errors.has('invitee')"
              class="error-text"
            >{{ errors.first('invitee') }}</div>
          </div>
        </div>
        <!-- <div class="input-group">
          <div class="input-label">{{ $t('editing.groupRolePermission') }}：</div>
          <div
            class="input-block"
            :class="{'has-error': errors.has('role')}"
          >
            <default-select
              class="input"
              v-model="selectedRole"
              :option-list="roleList"
              name="role"
              v-validate="'required'"
            ></default-select>
            <div
              class="error-text"
              v-if="errors.has('role')"
            >{{errors.first('role')}}</div>
          </div>
        </div> -->
      </div>
      <div class="button-block">
        <button
          type="button"
          class="btn btn-outline"
          @click.stop="backToUserList"
        >{{ $t('button.cancel') }}</button>
        <button
          :disabled="isLoading"
          class="btn btn-default"
          type="submit"
        >{{ $t('button.confirm') }}</button>
      </div>
    </form>
  </div>
</template>

<script>
import DefaultSelect from '@/components/select/DefaultSelect'
import { getAccountUsers } from '@/API/User'
import InputBlock from '@/components/InputBlock'
import { createGroupUser, getGroupUserList } from '@/API/Group'
import { Message } from 'element-ui'

export default {
  name: 'GroupCreateUser',
  inject: ['$validator'],
  components: {
    DefaultSelect,
    InputBlock
  },
  data () {
    return {
      selectedInvitee: '',
      selectedRole: '',
      roleList: [],
      userList: [],
      isLoading: false,
      currentGroupId: ''
    }
  },
  mounted () {
    this.currentGroupId = this.$route.params.group_id
    this.fetchUser(this.currentGroupId)
  },
  beforeRouteUpdate (to, from, next) {
    this.currentGroupId = to.params.group_id
    this.fetchUser(this.currentGroupId)
    next()
  },
  methods: {
    fetchUser (currentGroupId) {
      Promise.all([getAccountUsers(), getGroupUserList(currentGroupId)])
        .then(([accountUsers, groupUsers]) => {
          // exclude existing members
          this.userList = accountUsers.reduce((acc, cur) => {
            const userExist = groupUsers.find(user => user.id === cur.id)
            if (userExist) return acc
            acc.push({value: cur.email, id: cur.id})
            return acc
          }, [])
        })
        .catch(() => this.backToUserList())
    },
    submitForm () {
      this.$validator.validateAll().then(result => {
        if (!result) return
        // TODO: 下拉式選單選擇角色，這邊先預設 null，後端收到會先給使用者 group_viewer 的角色權限
        const dummyGroupRole = null
        createGroupUser({
          groupRole: dummyGroupRole,
          userId: this.userList.find(user => user.value === this.selectedInvitee).id
        }, this.currentGroupId)
          .then(() => this.$store.dispatch('userManagement/updateUserGroupList'))
          .then(() => {
            this.backToUserList()
            return Message({
              message: this.$t('message.memberCreateSuccess'),
              type: 'success',
              duration: 3 * 1000
            })
          })
          .catch(() => { this.isLoading = false })
      })
    },
    backToUserList () {
      this.$router.push({name: 'GroupUserList', params: {group_id: this.$route.params.group_id}})
    },
    updateSelectedInvitee (invitee) {
      this.selectedInvitee = this.userList.find(user => user.value === invitee).value
    }
  }
}
</script>

<style lang="scss" scoped>
.group-creation {
  .page-title-row {
    margin-bottom: 16px;

    .title {
      margin-top: 0;
      font-size: 24px;
      line-height: 32px;
    }

    .bread-crumb {
      display: flex;
      align-items: center;
      font-size: 16px;
      line-height: 20px;
      letter-spacing: 1px;
    }

    .title-link {
      color: $theme-color-primary;
      text-decoration: underline;
    }

    .divider {
      margin: 0 .5rem;
    }
  }
}

.group-creation-form {
  .input-wrapper {
    background: $theme-bg-color;
    box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.12);
    border-radius: 8px;
    padding: 24px;
    margin-bottom: 1rem;
  }

  .input-group {
    display: flex;
    align-items: center;
    margin-bottom: 1.5rem;
  }

  .input-label {
    margin-right: .5rem;
  }

  .input-block {
    width: 350px;

    & >>> .input {
      padding-bottom: 0px;
    }
  }

  .button-block {
    display: flex;
    justify-content: flex-start;

    .btn:not(:last-of-type) {
      margin-right: 20px;
    }
  }

  .has-error .input {
    border-bottom: 1px solid #EB5959;
  }

  >>> .el-input__inner {
    padding-left: 0;
    padding-bottom: 8px;

    &::placeholder {
      color: #AAAAAA;
    }
  }
}
</style>

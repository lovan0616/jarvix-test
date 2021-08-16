<template>
  <div class="full-page-dialog contact-dialog">
    <div class="dialog-container">
      <div class="dialog-title">
        {{ $t('schedule.setting.groupManagement') }}
        <a
          href="javascript:void(0)"
          class="close-btn"
          @click="$emit('close', shouldRefetchBackStageSetting)"
        ><svg-icon icon-class="close" /></a>
      </div>
      <spinner v-if="isLoading" />
      <div
        v-else
        class="contact-dialog__content"
      >
        <!-- 預設群組 -->
        <section class="contact-dialog__content-section">
          <div class="section-header">
            <div class="section-title">
              {{ $t('schedule.groupSetting.systemDefault') }} ({{ defaultGroupContacts.length }})
            </div>
            <default-button
              type="text"
              class="create-btn"
              @click="createContact(defaultGroupId)"
            >
              <svg-icon icon-class="plus" />
              {{ $t('schedule.groupSetting.createContact') }}
            </default-button>
          </div>
          <contact-list
            :contacts="defaultGroupContacts"
            :is-default-contact="true"
            @edit="editContact"
            @delete="deleteContact"
          />
        </section>
        <!-- 其餘群組 -->
        <section
          v-if="hasOtherGroup"
          class="contact-dialog__content-section"
        >
          <div class="section-header">
            <div class="section-title">
              <default-select
                :options="otherGroupOptions"
                v-model="selectedGroupId"
                class="group-selector"
                @input="onSelectGroup"
              />
              <el-tooltip :content="$t('schedule.groupSetting.renameGroup')">
                <div
                  class="icon-box"
                  @click="editGroup(selectedGroupId)"
                >
                  <svg-icon icon-class="edit" />
                </div>
              </el-tooltip>
              <el-tooltip :content="$t('schedule.groupSetting.deleteGroup')">
                <div
                  class="icon-box"
                  @click="deleteGroup(selectedGroupId)"
                >
                  <svg-icon icon-class="delete" />
                </div>
              </el-tooltip>
            </div>
            <default-button
              type="text"
              class="create-btn"
              @click="createContact(selectedGroupId)"
            >
              <svg-icon icon-class="plus" />
              {{ $t('schedule.groupSetting.createContact') }}
            </default-button>
          </div>
          <contact-list
            :contacts="currentViewingGroupContacts"
            @edit="editContact"
            @delete="deleteContact"
          />
          <default-button
            type="outline"
            class="create-group"
            @click="createGroup"
          >
            <svg-icon icon-class="plus" />
            {{ $t('schedule.rolling.createGroup') }}
          </default-button>
        </section>
      </div>
      <default-button
        v-if="!hasOtherGroup && !isLoading"
        type="outline"
        class="create-group is-outside"
        @click="createGroup"
      >
        <svg-icon icon-class="plus" />
        {{ $t('schedule.rolling.createGroup') }}
      </default-button>
    </div>
    <!-- dialog -->
    <component
      v-if="isShowActionDialog"
      :is="actionName"
      :group-options="groupOptions"
      :contact-info="currentEditContact"
      :group-info="currentEditGroup"
      :is-last-default-contact="isLastDefaultContact"
      :email-options="emailOptions"
      :default-email-group-name="defaultEmailGroupName"
      :notification-setting="notificationSetting"
      @updateShouldRefetchBackStageSetting="updateShouldRefetchBackStageSetting"
      @createGroup="newlyCreatedGroupId = $event"
      @changeGroup="onSelectGroup"
      @close="closeDialog($event)"
    />
  </div>
</template>

<script>
import WritingDialog from '@/components/dialog/WritingDialog'
import CreateContact from './CreateContact'
import CreateGroup from './CreateGroup'
import EditContact from './EditContact'
import EditGroup from './EditGroup'
import DeleteContact from './DeleteContact'
import DeleteGroup from './DeleteGroup'
import DropdownSelect from '@/components/select/DropdownSelect'
import ContactList from './ContactList'
import { getContactGroups, getRecommendedEmailList } from '@/schedule/API/Email'
import { mapState } from 'vuex'

export default {
  name: 'ContactManagementDialog',
  components: {
    WritingDialog,
    CreateContact,
    CreateGroup,
    EditContact,
    EditGroup,
    DeleteContact,
    DeleteGroup,
    DropdownSelect,
    ContactList
  },
  props: {
    notificationSetting: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
      isLoading: true,
      actionName: null,
      groupList: [],
      selectedGroupId: null,
      currentEditGroup: null,
      currentEditContact: null,
      emailOptions: [],
      newlyCreatedGroupId: null,
      shouldRefetchBackStageSetting: false
    }
  },
  computed: {
    ...mapState('scheduleSetting', ['scheduleProjectId']),
    groupOptions () {
      return this.groupList.map(group => ({
        value: group.emailGroupId,
        label: group.emailGroupName
      }))
    },
    otherGroupOptions () {
      return this.groupList
        .filter(group => group.emailGroupName !== this.defaultEmailGroupName)
        .map(group => ({
          value: group.emailGroupId,
          label: `${group.emailGroupName} (${group.emails ? group.emails.length : 0})`
        }))
    },
    isShowActionDialog () {
      return Boolean(this.actionName)
    },
    availableActionTypes () {
      return ['CreateGroup', 'EditGroup', 'DeleteGroup', 'CreateContact', 'EditContact', 'DeleteContact']
    },
    defaultGroupContacts () {
      const group = this.groupList.find(group => group.emailGroupName === this.defaultEmailGroupName)
      return group.emails
    },
    defaultGroupId () {
      const defaultGroup = this.groupList.find(group => group.emailGroupName === this.defaultEmailGroupName)
      return defaultGroup.emailGroupId
    },
    currentViewingGroupContacts () {
      if (!this.selectedGroupId) return []
      const group = this.groupList.find(group => group.emailGroupId === this.selectedGroupId)
      return group ? group.emails : []
    },
    hasOtherGroup () {
      return this.groupList.length > 1
    },
    defaultEmailGroupName () {
      return 'Default'
    },
    isLastDefaultContact () {
      // 當預設群組只剩一人時，不能將其刪除或者轉移到別的群組
      return this.defaultGroupContacts.length === 1
    }
  },
  mounted () {
    this.getGroupList()
    this.getRecommendations()
  },
  methods: {
    getGroupList () {
      this.isLoading = true
      getContactGroups(this.scheduleProjectId)
        .then(groupList => {
          this.groupList = groupList.map(group => ({
            ...group,
            emails: group.emails ? group.emails.map(contact => ({
              ...contact,
              emailId: contact.id,
              emailGroupId: group.emailGroupId
            })) : []
          }))
          // 處理預先選到前次編輯的群組
          if (this.newlyCreatedGroupId) {
            this.selectedGroupId = this.newlyCreatedGroupId
            this.newlyCreatedGroupId = null
          } else if (this.currentEditGroup && (this.currentEditGroup.emailGroupName !== this.defaultEmailGroupName)) {
            this.selectedGroupId = this.currentEditGroup.emailGroupId
          } else if (this.hasOtherGroup) {
            const firstOtherGroup = groupList.find(group => group.emailGroupName !== this.defaultEmailGroupName)
            this.selectedGroupId = firstOtherGroup.emailGroupId
          }
        })
        .catch(() => {})
        .finally(() => this.isLoading = false)
    },
    getRecommendations () {
      getRecommendedEmailList(this.scheduleProjectId)
        .then(emails => {
          this.emailOptions = emails.map(item => ({
            value: item.contactEmail,
            label: item.contactEmail,
            contactName: item.contactName
          }))
        })
        .catch(() => {})
    },
    createGroup () {
      this.openDialog('CreateGroup')
    },
    editGroup (groupId) {
      this.currentEditGroup = this.groupList.find(item => item.emailGroupId === groupId)
      if (this.currentEditGroup) this.openDialog('EditGroup')
    },
    deleteGroup (groupId) {
      this.currentEditGroup = this.groupList.find(item => item.emailGroupId === groupId)
      if (this.currentEditGroup) this.openDialog('DeleteGroup')
    },
    createContact (groupId) {
      this.currentEditGroup = this.groupList.find(item => item.emailGroupId === groupId)
      if (this.currentEditGroup) this.openDialog('CreateContact')
    },
    editContact (contactInfo) {
      this.currentEditContact = contactInfo
      this.openDialog('EditContact')
    },
    deleteContact (contactInfo) {
      this.currentEditContact = contactInfo
      this.openDialog('DeleteContact')
    },
    onSelectGroup (groupId) {
      this.currentEditGroup = this.groupList.find(item => item.emailGroupId === groupId)
    },
    openDialog (actionName) {
      if (!this.availableActionTypes.includes(actionName)) return
      this.actionName = actionName
    },
    closeDialog (shouldRefetchEmails = false) {
      if (shouldRefetchEmails) this.getGroupList()
      if (this.actionName === 'DeleteGroup') this.currentEditGroup = null
      this.actionName = null
    },
    updateShouldRefetchBackStageSetting (value) {
      this.shouldRefetchBackStageSetting = value
    }
  }
}
</script>

<style lang="scss" scoped>
.dialog-container {
  min-width: 704px;
}
.contact-dialog {
  &__content {
    &-section {
      padding: 24px;
      background: rgba(50, 58, 58, 0.95);
      border-radius: 5px;
      & + & {
        margin-top: 16px;
      }
      .section-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 4px;
      }
      .section-title {
        display: flex;
        align-items: center;
        font-size: 18px;
        .icon-box {
          font-size: 14px;
          cursor: pointer;
          color: #AAA;
          margin-left: 14px;
          &:hover {
            color: $theme-color-primary;
          }
        }
      }
    }
  }
}

.create-group {
  display: block;
  margin-top: 16px;
  margin-left: auto;
  &.is-outside {
    margin-top: 16px;
  }
}

::v-deep .data-list {
  &__title {
    text-align: left;
  }
  &__detail {
    margin: 0;
    text-align: left;
    padding-left: 12px;
    color: #AAA;
    .input-verify {
      .input-verify-text {
        color: #FFF;
      }
    }
  }
}

::v-deep .group-selector {
  width: 140px;
  padding-bottom: 0;
  margin-right: 4px;
  .el-input__inner {
    font-size: 18px;
    border-bottom: none;
  }
}
</style>

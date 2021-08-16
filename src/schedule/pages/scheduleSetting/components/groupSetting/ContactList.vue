<template>
  <ul class="contact-list">
    <div v-if="contacts.length > 0">
      <li class="contact-list__header">
        <div class="contact-list__item name">
          {{ $t('schedule.rolling.name') }}
        </div>
        <div class="contact-list__item email">
          {{ $t('schedule.rolling.email') }}
        </div>
        <div class="contact-list__item action nowrap">
          {{ $t('schedule.base.action') }}
        </div>
      </li>
      <li
        v-for="contact in contacts"
        :key="contact.emailId"
        class="contact-list__body"
      >
        <div class="contact-list__item name">
          {{ contact.contactName }}
        </div>
        <div class="contact-list__item email">
          {{ contact.contactEmail }}
        </div>
        <div class="contact-list__item action">
          <a
            class="link"
            @click="onClickEditContact(contact)"
          >
            {{ $t('schedule.base.edit') }}
          </a>
          <a
            :disabled="!isContactDeletable"
            class="link"
            @click="onClickDeleteContact(contact)"
          >{{ $t('schedule.base.remove') }}</a>
        </div>
      </li>
    </div>
    <empty-info-block v-else />
  </ul>
</template>

<script>
import EmptyInfoBlock from '@/components/EmptyInfoBlock'

export default {
  name: 'ContactList',
  components: {
    EmptyInfoBlock
  },
  props: {
    contacts: {
      type: Array,
      default: () => []
    },
    isDefaultContact: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    isContactDeletable () {
      return !this.isDefaultContact || this.contacts.length > 1
    }
  },
  methods: {
    onClickEditContact (contact) {
      this.$emit('edit', contact)
    },
    onClickDeleteContact (contact) {
      if (!this.isContactDeletable) return
      this.$emit('delete', contact)
    }
  }
}
</script>

<style lang="scss" scoped>
.contact {
  &-list {
    width: 100%;
    font-size: 14px;
    list-style: none;
    padding-left: 0;
    margin: 0;
    max-height: 50vh;
    padding: 12px;
    background: rgba(67, 76, 76, 0.95);
    border-radius: 8px;
    overflow: auto;
    &__header {
      margin-bottom: 18px;
    }
    &__body {
      &:not(:last-child) {
        margin-bottom: 18px;
      }
    }
    &__header, &__body {
      display: flex;
      gap: 12px;
    }
    &__item {
      display: flex;
      align-items: center;
      &.name {
        flex: 0 0 160px;
        @include text-hidden;
      }
      &.email {
        flex: 1;
        @include text-hidden;
      }
      &.action {
        flex: 0 0 85px;
      }
      .link {
        position: relative;
        & + .link {
          padding-left: 12px;
          margin-left: 6px;
          &::before {
            content: '|';
            position: absolute;
            left: 0;
            top: -1px;
          }
        }
      }
    }
    .empty-info-block {
      background-color: transparent;
    }
  }
}
</style>

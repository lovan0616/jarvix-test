<template>
  <div
    v-if="messageList && messageList.length > 0"
    class="insight-description-block description"
  >
    <div
      :class="{[`description__title--${messageType}`]: messageType}"
      class="description__title"
    >
      <svg-icon
        v-if="iconName"
        :icon-class="iconName"
      />
      {{ title }}
    </div>
    <span
      v-for="(description, index) in messageList"
      :key="index"
      :class="{[`description__item--${messageType}`]: messageType}"
      class="description__item"
    >
      {{ messageList.length > 1 ? (index + 1) + '. ' + description : description }}</span>
  </div>
</template>
<script>
export default {
  name: 'InsightDescriptionBlock',
  props: {
    title: {
      type: String,
      default: null
    },
    iconName: {
      type: String,
      default: null
    },
    messageType: {
      type: String,
      default: null
    },
    messageList: {
      type: Array,
      default: () => []
    }
  }
}
</script>
<style lang="scss" scoped>
.description {
  width: 100%;
  margin-top: 16px;
  background-color: #141c1d;
  padding: 10px 20px;

  &--warning {
    background: rgba(255, 223, 111, 0.08);
  }

  &__title {
    font-size: 18px;
    font-weight: 600;
    line-height: 24px;
    color: #eee;

    &--warning {
      color: #eedf6f;
    }
  }

  &__item {
    font-size: 14px;
    letter-spacing: 0.1em;
    display: block;
    line-height: 24px;
    color: #ccc;

    &--warning {
      color: #eedf6f;
    }
  }
}

</style>

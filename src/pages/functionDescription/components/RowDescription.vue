<template>
  <div
    :class="['row-description', {'description-reverse': !positionLeft}]"
  >
    <div
      v-html="text"
      :class="[{'description-space description-text-right': positionLeft, 'description-text': twoRow}]"
    >
    </div>
    <div
      :class="['description-round-empty', {'description-space': !positionLeft}]"
    >
    </div>
    <div :class="`description-line ${lineClassName}`"></div>
    <div class="description-round-full"></div>
  </div>
</template>
<script>
export default {
  name: 'rowDescription',
  props: {
    positionLeft: {
      type: Boolean,
      default: true
    },
    lineClassName: {
      type: String
    },
    text: {
      type: String
    },
    twoRow: {
      type: Boolean
    }
  }
}
</script>

<style lang="scss" scoped>

.row-description {
    position: absolute;
    display: flex;
    align-items: center;
    color: #FFDF6F;
}

.description-space {
    margin-right: 4px;
}

.description-round-empty {
  width: 8px;
  height: 8px;
  border: 1px solid #FFDF6F;
  border-radius: 99px;
}

.description-line {
  height: 1px;
  background: #FFDF6F;
}

.description-round-full {
  width: 8px;
  height: 8px;
  background: #FFDF6F;
  border-radius: 99px;
}

.description-text {
    width: 100px;
}

.description-text-right {
  text-align: right;
}

.first-interface-line {
  width: 15px;
}

.second-interface-line {
  width: 185px;
}

.third-interface-line {
  width: 15px;
}

.fouth-interface-line {
  width: 29px;
}

// menu

.first-menu-line {
  width: 126px;
}

.second-menu-line {
  width: 42px;
}

// index page

.first-index-line {
  width: 28px;
}

.second-index-line {
  width: 28px;
}

// data

.first-data-line {
  width: 134px;
}

.second-data-line {
  width: 40px;
}

.first-sheet-line {
  width: 48px;
}

.second-sheet-line {
  width: 40px;
}

.first-data-edit-line {
  width: 131px;
}

.second-data-edit-line {
  width: 217px;
}

.third-data-edit-line {
  width: 283px;
}

.forth-data-edit-line {
  width: 222px;
}

.fifth-data-edit-line {
  width: 191px;
}

// connect

.first-data-connect-line {
  width: 112px;
}

.second-data-connect-line {
  width: 191px;
}

.third-data-connect-line {
  width: 211px;
}

.fourth-data-connect-line {
  width: 190px;
}

.description-reverse {
  flex-direction: row-reverse;
}
</style>

<template>
  <div
    :class="['row-description', {'description-reverse': !positionLeft}]"
  >
    <div
      v-html="text"
      :class="[{'description-space description-text-right': positionLeft}]"
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

// question

.first-ask-line {
  width: 43px;
}

.second-ask-line {
  width: 71px;
}

// assist

.first-assist-line {
  width: 162px;
}

.second-assist-line {
  width: 48px;
}

.third-assist-line {
  width: 83px;
}

.fourth-assist-line {
  width: 48px;
}

// result

.first-result-line {
  width: 20px;
}

.second-result-line {
  width: 26px;
}

// deep

.first-deep-line {
  width: 22px;
}

.second-deep-line {
  width: 26px;
}

.third-deep-line {
  width: 26px;
}

// pinboard

.first-pinboard-line {
  width: 48px;
}

.second-pinboard-line {
  width: 39px;
}

.third-pinboard-line {
  width: 39px;
}

// class manage

.first-class-line {
  width: 140px;
}

.second-class-line {
  width: 30px;
}

.third-class-line {
  width: 261px;
}

// share pinboard

.first-share-line {
  width: 265px;
}

.second-share-line {
  width: 221px;
}

.third-share-line {
  width: 30px;
}

.fourth-share-line {
  width: 77px;
}

.fifth-share-line {
  width: 221px;
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

.fourth-data-edit-line {
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

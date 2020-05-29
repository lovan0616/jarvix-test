<template>
  <div ref="test">
    <ul>
      <li class="list-item" v-for="item in items" :key="item.id">{{item.name}}</li>
    </ul>
    <Observer :options="options" @intersect="intersected"/>
  </div>
</template>

<script>
import Observer from './Observer'

const dummyData = [
  {
    id: 1,
    name: '1'
  },
  {
    id: 2,
    name: '2'
  },
  {
    id: 3,
    name: '3'
  },
  {
    id: 4,
    name: '4'
  },
  {
    id: 5,
    name: '5'
  },
  {
    id: 6,
    name: '6'
  }
]

export default {
  data () {
    return {
      items: [],
      options: {
        root: this.$refs.test,
        rootMargin: '0px',
        threshold: 1.0
      }
    }
  },
  components: {
    Observer
  },
  mounted () {
    this.items = dummyData.slice(0, 4)
  },
  methods: {
    intersected () {
      console.log('outside')
      this.items = [...this.items, ...dummyData.slice(4, 6)]
    }
  }
}
</script>

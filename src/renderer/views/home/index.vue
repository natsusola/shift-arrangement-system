<template>
  <div class="wrap">
    <div @click="doClick($event, 'hi')">Home {{name}}</div>
    <router-link :to="{ name: 'detail', params: {id: 1} }">
      goto
    </router-link>
    <b-table hover :items="items"></b-table>
  </div>
</template>

<script>
  import Vue from 'vue';
  
  export default {
    name: 'home',
    data() {
      return {
        name: 'Jack',
        items: [
          {name: 'a'},
          {name: 'b'},
        ]
      }
    },
    methods: {
      doClick(e, params) { console.log(e, params); }
    }
  };
</script>

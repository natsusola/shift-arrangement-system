<template>
  <div class="wrap">
    <div @click="doClick($event, 'hi')">Home {{name}}</div>
    <router-link :to="{ name: 'detail', params: {id: 1} }">
      goto
    </router-link>
  </div>
</template>

<script>
  import Vue from 'vue';

  export default {
    name: 'home',
    data() {
      return {
        name: 'Jack'
      }
    },
    methods: {
      doClick(e, params) { console.log(e, params); }
    }
  };
</script>

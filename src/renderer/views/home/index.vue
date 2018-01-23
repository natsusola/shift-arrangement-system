<template>
  <div class="home-wrap">
    <div @click="doClick($event, 'hi')">Home</div>
    <router-link :to="{ name: 'detail', params: {id: 1} }">
      goto
    </router-link>
    <b-table hover :items="items"></b-table>
  </div>
</template>

<script>
  import { apiRequest, dbAPI } from '@/utils';
  import MyDB from '@/db';

  export default {
    name: 'home',
    data() {
      return {
        items: []
      }
    },
    mounted() {
      apiRequest(dbAPI.project.list)
        .then(res => {
          console.log(res);
        });
    },
    methods: {
      doClick(e, params) { console.log(e, params); }
    }
  };
</script>

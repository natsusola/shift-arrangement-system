<template>
  <div class="__layout">
    <router-view class="content"></router-view>
    <toast></toast>
  </div>
</template>

<script>
  import { Toast } from '@/views/utils';
  export default {
    components: {
      'toast': Toast
    }
  }
</script>

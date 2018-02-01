<template>
  <vue-toast ref='toast'></vue-toast>
</template>

<script>
  import Vue from 'vue';
  import Component from 'vue-class-component';
  import VueToast from 'vue-toast';

  let self = undefined;

  @Component({
    components: { VueToast }
  })
  export default class Toast extends Vue {
    toastElem = undefined
    mounted() {
      this.toastElem = this.$refs.toast;
      this.toastElem.setOptions({
        position: 'top right',
        maxToasts: 6
      });
      self = this;
    }
    static showToast(msg, options = {}) {
      self.toastElem.showToast(msg, {
        timeLife: 4000,
        theme: 'danger',
        ...options
      });
    }
  }
</script>

<template>
  <b-modal id="alert-modal"
    ref="alertModal"
    body-class="alert-modal-body"
    :hide-header="true"
    :hide-footer="true">
    <i class="fa fa-exclamation-triangle" aria-hidden="true"></i>
    {{text}}
    <i class="fa fa-times icon-btn"
      style="float:right; margin-top:3px;"
      aria-hidden="true"
      @click="doClose">
    </i>
  </b-modal>
</template>

<script>
  export default {
    props: ['text'],
    methods: {
      doClose() {
        this.$refs.alertModal.hide();
      }
    },
  };
</script>

<template>
  <div class="loader-mask">
    <div class="loader-wrapper">
      <pulse-loader></pulse-loader>
    </div>
  </div>
</template>

<script>
import PulseLoader from "vue-spinner/src/PulseLoader.vue";

export default {
  name: "Loader",
  components: {
    PulseLoader,
  },
};
</script>

<style scoped>
.loader-mask {
  position: fixed;
  z-index: 9998;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: table;
  transition: opacity 0.3s ease;
  vertical-align: middle;
}
.loader-wrapper {
  display: table-cell;
  vertical-align: middle;
}
</style>

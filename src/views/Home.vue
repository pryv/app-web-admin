<template>
  <div class="home">
    <img alt="Logo" src="../assets/logo.png" />
    <Config />
  </div>
</template>

<script>
// @ is an alias to /src
import Config from "@/components/Config.vue";

export default {
  name: "Home",
  components: {
    Config
  }
};
</script>

<style scoped>
img {
  display: block;
  margin-left: auto;
  margin-right: auto;
  width: 10%;
}
</style>

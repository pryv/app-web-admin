<template>
  <div class="home">
    <img alt="Vue logo" src="../assets/logo.png" />
    <Config msg="PryV Configuration Panel" />
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

<template>
  <div id="app">
    <router-view />
  </div>
</template>

<style>
@import "https://api.pryv.com/style/pryv.min.css";

#app {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
}
.tab-title {
  color: rgb(76, 136, 136);
  bottom: 0;
}
.tab-title:hover {
  color: rgb(76, 136, 136);
}
</style>

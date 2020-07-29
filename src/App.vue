<template>
  <div id="app">
    <NavBar :loggedIn="loggedIn" @loggedOut="loggedIn = false" />
    <router-view @loggedIn="loggedIn = true" @loggedOut="loggedIn = false" />
  </div>
</template>

<script>
import NavBar from '@/components/NavBar.vue';
const axios = require('axios');

export default {
  name: 'App',
  components: {
    NavBar,
  },
  data: () => ({
    loggedIn: false,
  }),
  beforeMount() {
    this.loggedIn = !!localStorage.getItem('token');

    if (this.loggedIn) {
      axios.defaults.baseURL = localStorage.getItem('serverUrl');
      axios.defaults.headers.common['authorization'] = localStorage.getItem(
        'token'
      );
    }
  },
};
</script>

<style>
@import 'https://api.pryv.com/style/pryv.min.css';

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
.users-management-user-row {
  width: 20%;
  border-right: 2px solid #c8c8c8;
  vertical-align: middle !important;
}
</style>

<template>
  <div id="app">
    <NavBar :loggedIn="loggedIn" @loggedOut="loggedIn = false" />
    <b-container fluid>
      <b-row align-h="center">
        <b-col>
          <router-view
            @loggedIn="loggedIn = true"
            @loggedOut="loggedIn = false"
          />
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>
import NavBar from '@/components/NavBar.vue';
import axios from 'axios';

export default {
  name: 'App',
  components: {
    NavBar
  },
  data: () => ({
    loggedIn: false
  }),
  beforeMount () {
    this.loggedIn = !!localStorage.getItem('token');

    if (this.loggedIn) {
      axios.defaults.baseURL = localStorage.getItem('serverUrl');
      axios.defaults.headers.common.authorization = localStorage.getItem(
        'token'
      );
    }
  }
};
</script>

<style>
@import 'https://api.pryv.com/style/pryv2.min.css';

#app {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  min-width: 600px;
}
.tab-title {
  color: rgb(76, 136, 136);
  bottom: 0;
}
.tab-title:hover {
  color: rgb(76, 136, 136);
}
.tab-cell {
  white-space: normal;
  overflow-wrap: break-word;
  text-align: center;
  min-width: 100px;
}
.admin-users-user-row {
  width: 20%;
  border-right: 2px solid #c8c8c8;
  vertical-align: middle !important;
}
.jsoneditor-container {
  min-width: auto !important;
}
.jsoneditor {
  border: thin solid #c8c8c8 !important;
}
.jsoneditor-menu {
  background-color: #c1d4f2 !important;
  border-bottom: 1px solid #c1d4f2 !important;
}
.table-responsive {
  overflow-y: auto !important;
}
.container-fluid {
  margin-top: 80px;
}
</style>

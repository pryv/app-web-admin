<template>
  <b-row align-h="center">
    <b-col cols="9" md="5" sm="9" lg="5">
      <div class="login">
        <h1>Administration Panel</h1>
        <h3>Please log in</h3>
        <b-card>
          <b-form v-on:submit.prevent="login">
            <b-form-group label-for="username" label="Username">
              <b-form-input
                required
                type="text"
                name="username"
                id="username"
                placeholder="Username"
                v-model="username"
                @input="
                  loginFailed = false;
                  loginRequestFailed = false;
                "
              />
            </b-form-group>
            <b-form-group label-for="password" label="Password">
              <b-form-input
                required
                type="password"
                name="password"
                id="password"
                placeholder="Password"
                v-model="password"
                @input="
                  loginFailed = false;
                  loginRequestFailed = false;
                "
              />
            </b-form-group>
            <b-button variant="primary" type="submit">Login</b-button>
          </b-form>
        </b-card>
        <b-card v-if="loginFailed">
          <div class="failure-msg">
            <p v-if="!loginRequestFailed">
              Incorrect credentials. Please verify your input
            </p>
            <p v-if="loginRequestFailed">
              Unable to connect to the server. Please try again later
            </p>
          </div>
        </b-card>
        <loader v-if="loginInProgress" :loading="loginInProgress"></loader>
      </div>
    </b-col>
  </b-row>
</template>

<script>
import jwtDecode from 'jwt-decode';
import axios from 'axios';
import Loader from '@/widgets/Loader.vue';
import store from '@/store/store.js';

export default {
  name: 'Login',
  components: {
    Loader,
  },
  data: () => ({
    username: '',
    password: '',
    loginFailed: false,
    loginRequestFailed: false,
    loginInProgress: false,
    serverUrl: '',
  }),
  created() {
    const serverUrlFromQueryParams = this.getDomainFromQueryParams();
    if (serverUrlFromQueryParams != null) {
      this.serverUrl = serverUrlFromQueryParams;
    } else {
      this.serverUrl = `https://lead.${this.getDomainFromUrl()}`;
    }
  },
  methods: {
    getDomainFromQueryParams() {
      const url = new URL(window.location.href);
      return url.searchParams.get('pryvLeaderUrl');
    },
    getDomainFromUrl() {
      const url = new URL(window.location.href);
      // assert that URL is in the form: https://adm.DOMAIN
      const hostname = url.hostname;
      return hostname.substring(hostname.indexOf('.') + 1);
    },
    login: function() {
      this.loginInProgress = true;
      axios
        .post(`${this.serverUrl}/auth/login`, {
          username: this.username,
          password: this.password,
        })
        .then(response => {
          if (
            !response.data ||
            Object.keys(response.data).length === 0 ||
            !response.data.token
          ) {
            throw new Error();
          }
          localStorage.setItem('serverUrl', this.serverUrl);
          localStorage.setItem('token', response.data.token);
          const user = jwtDecode(response.data.token);
          localStorage.setItem('permissions', JSON.stringify(user.permissions));
          localStorage.setItem('username', user.username);

          store.state.currentUser = {
            username: user.username,
            permissions: user.permissions,
          };
          axios.defaults.baseURL = this.serverUrl;
          axios.defaults.headers.common['authorization'] = response.data.token;

          this.$emit('loggedIn');
          this.$router.push('/');
        })
        .catch(error => {
          if (
            (error &&
              error.response &&
              error.response.status &&
              error.response.status >= 500) ||
            error.message === 'Network Error'
          ) {
            this.loginRequestFailed = true;
          }

          this.loginFailed = true;
        })
        .finally(() => {
          this.loginInProgress = false;
        });
    },
  },
};
</script>

<style scoped>
button {
  border-radius: 4px;
  margin: 8px;
  position: relative;
  left: 40%;
}
button:hover {
  box-shadow: 0 4px 4px 0 rgba(0, 0, 0, 0.24), 0 6px 8px 0 rgba(0, 0, 0, 0.19);
  outline: none !important;
}
button:active {
  border: 0;
}
form {
  padding: 20px;
}
.failure-msg {
  color: rgb(189, 16, 38);
}
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
img {
  display: block;
  margin-top: 20px;
  margin-left: auto;
  margin-right: auto;
  width: 10%;
}
</style>

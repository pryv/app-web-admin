<template>
  <div>
    <b-navbar type="light" variant="info" fixed="top">
      <b-navbar-brand href="https://api.pryv.com">
        <img alt="Logo" src="@/assets/logo.png" />
      </b-navbar-brand>

      <b-navbar-toggle v-if="loggedIn" target="nav-collapse"></b-navbar-toggle>

      <b-collapse v-if="loggedIn" id="nav-collapse" is-nav>
        <b-navbar-nav class="ml-auto" tag="div">
          <b-nav-item
            class="nav-view"
            v-if="canViewPlatformConfig"
            to="/platform-config"
            >Platform Configuration</b-nav-item
          >
          <b-nav-item
            class="nav-view"
            v-if="canViewUsersManagement"
            to="/users-management"
            >Users Management</b-nav-item
          >
          <b-nav-item
            v-if="canReadPlatformUsers"
            class="nav-view"
            to="/platform-users-management"
            >Platform Users Management</b-nav-item
          >
        </b-navbar-nav>

        <b-navbar-nav align="right" tag="div">
          <b-nav-item-dropdown right>
            <template v-slot:button-content>
              <em>Profile</em>
            </template>
            <b-dropdown-item @click="displayChangePasswordModal = true"
              >Change Password</b-dropdown-item
            >
            <b-dropdown-item @click="logout()">Sign Out</b-dropdown-item>
          </b-nav-item-dropdown>
        </b-navbar-nav>
      </b-collapse>
    </b-navbar>
    <transition name="modal">
      <PasswordChangeModal
        v-if="displayChangePasswordModal"
        @close="displayChangePasswordModal = false"
      />
    </transition>
  </div>
</template>

<script>
import axios from 'axios';
import PasswordChangeModal from '@/components/PasswordChangeModal.vue';
import { PermissionsService } from '@/services/permissions.service.js';

export default {
  name: 'NavBar',
  components: {
    PasswordChangeModal,
  },
  props: {
    loggedIn: Boolean,
  },
  data: () => ({
    displayChangePasswordModal: false,
  }),
  computed: {
    canViewPlatformConfig: () => PermissionsService.canReadSettings(),
    canViewUsersManagement: () => PermissionsService.canReadUsers(),
    canReadPlatformUsers: () => PermissionsService.canReadPlatformUsers(),
  },
  methods: {
    logout: function() {
      axios.post('/auth/logout', {}).finally(() => {
        localStorage.removeItem('token');
        localStorage.removeItem('permissions');
        localStorage.removeItem('username');
        localStorage.removeItem('serverUrl');

        this.$emit('loggedOut');
        this.$router.push('/login');
      });
    },
  },
};
</script>

<style scoped>
img {
  text-align: top;
  height: 120%;
}
.navbar-brand {
  width: 10%;
  text-align: center;
}
.nav-view {
  border-right: 2px solid #45778f;
}
.modal-enter-active {
  transition: all 0.3s ease;
}
.modal-enter .modal-container,
.modal-leave-active .modal-container {
  -moz-transform: scale(1.1);
  -webkit-transform: scale(1.1);
  transform: scale(1.1);
  opacity: 100;
}
</style>

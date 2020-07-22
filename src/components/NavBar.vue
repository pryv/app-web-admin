<template>
  <div>
    <b-navbar toggleable="lg" type="light" variant="info" fixed="top">
      <b-navbar-brand href="https://api.pryv.com">
        <img alt="Logo" src="@/assets/logo.png" />
      </b-navbar-brand>

      <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

      <b-collapse v-if="loggedIn" id="nav-collapse" is-nav>
        <b-navbar-nav align="left" tag="div">
          <b-nav-item v-if="canViewPlatformConfig" to="/platform-config"
            >Platform Configuration</b-nav-item
          >
          <b-nav-item v-if="canViewUsersManagement" to="/users-management"
            >Users Management</b-nav-item
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
    <PasswordChangeModal
      v-if="displayChangePasswordModal"
      @close="displayChangePasswordModal = false"
    />
  </div>
</template>

<script>
const axios = require("axios");
import PasswordChangeModal from "@/components/PasswordChangeModal.vue";
import { PermissionsService } from "@/services/permissions.service.js";

export default {
  name: "NavBar",
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
  },
  methods: {
    logout: function() {
      axios
        .post(
          `${localStorage.getItem("serverUrl")}/auth/logout`,
          {},
          {
            headers: {
              authorization: localStorage.getItem("token"),
            },
          }
        )
        .finally(() => {
          localStorage.removeItem("token");
          this.$emit("loggedOut");
          this.$router.push("/login");
        });
    },
  },
};
</script>

<style scoped>
img {
  display: block;
  margin-top: -8px;
  margin-left: auto;
  margin-right: auto;
  width: 20%;
}
.navbar-brand {
  width: 30%;
}
</style>

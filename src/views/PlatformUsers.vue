<template>
  <b-row align-h="center">
    <b-col cols="9" md="5" sm="9" lg="5">
      <div class="platform-users">
        <h2>Platform Users</h2>
        <b-card>
          <b-form v-on:submit.prevent="getPlatformUser">
            <b-form-input
              required
              type="text"
              name="username"
              id="username"
              placeholder="Username"
              v-model="username"
              @input="userNotFound = false"
            />
            <b-button variant="primary" type="submit">
              Find
            </b-button>
          </b-form>
        </b-card>
        <b-card v-if="hasUser">
          <b-form
            v-on:submit.prevent="showDeleteConfirmationModal = true"
            v-on:reset.prevent="showModifyConfirmationModal = true"
          >
            <b-form-group
              v-for="prop in Object.keys(user)"
              :key="prop"
              :label-for="`${prop}`"
              :label="`${prop}:`"
              label-cols="4"
              label-cols-lg="2"
              label-size="md"
              label-class="font-weight-normal"
              label-align="right"
            >
              <b-form-input
                type="text"
                :name="`${prop}`"
                :id="`${prop}`"
                v-model="user[prop]"
                disabled
              />
            </b-form-group>
            <b-button
              v-if="canModifyPlatformUsers"
              variant="primary"
              type="reset"
            >
              Deactivate MFA
            </b-button>
            <b-button
              v-if="canDeletePlatformUsers"
              variant="primary"
              type="submit"
            >
              Delete
            </b-button>
          </b-form>
        </b-card>
        <b-card v-if="userNotFound">
          <div class="failure-msg">
            User not found
          </div>
        </b-card>
        <loader v-if="showLoader" :loading="showLoader"></loader>
        <transition name="modal">
          <ConfirmationWithInputModal
            v-if="showDeleteConfirmationModal"
            :validConfirmationInput="user.username"
            @close="showDeleteConfirmationModal = false"
            @confirm="deletePlatformUser()"
          />
        </transition>
        <transition name="modal">
          <ConfirmationWithInputModal
            v-if="showModifyConfirmationModal"
            :validConfirmationInput="user.username"
            @close="showModifyConfirmationModal = false"
            @confirm="deleteMfaPlatformUser()"
          />
        </transition>
        <transition name="modal">
          <OperationSuccessfulModal
            v-if="showUserDeletedModal"
            :text="userDeletedText"
            @close="showUserDeletedModal = false"
          />
        </transition>
        <transition name="modal">
          <OperationSuccessfulModal
            v-if="showMfaDeletedModal"
            :text="mfaDeletedText"
            @close="showMfaDeletedModal = false"
          />
        </transition>
        <transition name="modal">
          <OperationFailedModal
            v-if="showFailureModal"
            @close="showFailureModal = false"
          />
        </transition>
      </div>
    </b-col>
  </b-row>
</template>

<script>
import axios from 'axios';
import Loader from '@/widgets/Loader.vue';
import OperationSuccessfulModal from '@/widgets/OperationSuccessfulModal.vue';
import OperationFailedModal from '@/widgets/OperationFailedModal.vue';
import ConfirmationWithInputModal from '@/widgets/ConfirmationWithInputModal.vue';
import { handleInvalidTokenError } from '@/utils/errorHandling.js';
import { PermissionsService } from '@/services/permissions.service.js';

export default {
  name: 'PlatformUsers',
  components: {
    Loader,
    OperationSuccessfulModal,
    OperationFailedModal,
    ConfirmationWithInputModal,
  },
  data: () => ({
    username: '',
    user: {},
    showDeleteConfirmationModal: false,
    showModifyConfirmationModal: false,
    deleteConfirmationMsg: 'Enter username to confirm',
    showUserDeletedModal: false,
    showMfaDeletedModal: false,
    userDeletedText: 'User deleted successfully',
    mfaDeletedText: 'User MFA deactivated successfully',
    showFailureModal: false,
    showLoader: false,
    userNotFound: false,
  }),
  computed: {
    canModifyPlatformUsers: () => PermissionsService.canModifyPlatformUsers(),
    canDeletePlatformUsers: () => PermissionsService.canDeletePlatformUsers(),
    hasUser: function() {
      return Object.keys(this.user).length > 0;
    },
  },
  methods: {
    getPlatformUser: function() {
      this.showLoader = true;
      axios
        .get(`/platform-users/${this.username}`)
        .then(response => {
          if (!response.data || Object.keys(response.data).length === 0) {
            throw new Error();
          }
          this.user = response.data.user;
        })
        .catch(error => {
          if (!handleInvalidTokenError(error, this)) {
            this.userNotFound = true;
          }
        })
        .finally(() => {
          this.showLoader = false;
        });
    },
    deletePlatformUser() {
      this.showDeleteConfirmationModal = false;
      this.showLoader = true;
      axios
        .delete(`/platform-users/${this.username}`)
        .then(() => {
          this.user = {};
          this.showUserDeletedModal = true;
        })
        .catch(error => {
          if (!handleInvalidTokenError(error, this)) {
            this.showFailureModal = true;
          }
        })
        .finally(() => (this.showLoader = false));
    },
    deleteMfaPlatformUser() {
      this.showModifyConfirmationModal = false;
      this.showLoader = true;
      axios
        .delete(`/platform-users/${this.username}/mfa`)
        .then(() => {
          this.showMfaDeletedModal = true;
        })
        .catch(error => {
          if (!handleInvalidTokenError(error, this)) {
            this.showFailureModal = true;
          }
        })
        .finally(() => (this.showLoader = false));
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
.modal-enter-active {
  transition: all 0.3s ease;
}
.modal-enter {
  opacity: 100;
}
.modal-leave-active {
  opacity: 100;
}
.modal-enter .modal-container,
.modal-leave-active .modal-container {
  -moz-transform: scale(1.1);
  -webkit-transform: scale(1.1);
  transform: scale(1.1);
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
.failure-msg {
  color: rgb(189, 16, 38);
}
</style>

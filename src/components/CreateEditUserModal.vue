<template>
  <div class="create-edit-user-modal">
    <Modal @close="$emit('close')">
      <h3 slot="header">{{ headerStart }} user</h3>
      <div slot="body">
        <b-form v-on:submit.prevent="saveChanges">
          <b-form-group label="Username">
            <b-form-input
              required
              :disabled="edit"
              type="text"
              name="username"
              id="username"
              placeholder="Username"
              v-model="username"
            />
          </b-form-group>
          <b-form-group v-if="create" label="Password">
            <b-form-input
              required
              type="text"
              name="password"
              id="password"
              placeholder="Password"
              v-model="password"
            />
          </b-form-group>
          <b-form-group label="Permissions">
            <br />
            <b-alert
              v-if="!atLeastOnePermissionSelected"
              show
              variant="warning"
            >
              Please select at least one permission
            </b-alert>
            <PermissionsTable
              :permissions="permissions"
              :disableCheckBoxes="edit && !canChangePermissions"
            />
          </b-form-group>
          <div class="modal-footer">
            <b-button variant="primary" type="submit">
              Save
            </b-button>
            <b-button variant="outline-primary" @click="$emit('close')">
              Cancel
            </b-button>
          </div>
        </b-form>
        <div v-if="edit">
          <hr />
          <b-button
            v-if="canResetPassword"
            variant="outline-secondary"
            class="btn-sm"
            @click="showResetPasswordConfirmationModal = true"
          >
            Reset password
          </b-button>
          <b-button
            v-if="canDelete"
            variant="outline-primary"
            class="btn-sm"
            @click="showDeleteConfirmationModal = true"
          >
            Delete
          </b-button>
        </div>
      </div>
      <div slot="footer"></div>
    </Modal>
    <loader v-if="showLoader" :loading="showLoader"></loader>
    <transition name="modal">
      <ConfirmationModal
        v-if="showResetPasswordConfirmationModal"
        :text="resetPasswordConfirmationMsg"
        @close="showResetPasswordConfirmationModal = false"
        @confirm="resetPassword()"
      />
    </transition>
    <transition name="modal">
      <ConfirmationModal
        v-if="showDeleteConfirmationModal"
        :text="deleteConfirmationMsg"
        @close="showDeleteConfirmationModal = false"
        @confirm="deleteUser()"
      />
    </transition>
    <transition name="modal">
      <OperationFailedModal
        v-if="showFailureModal"
        @close="showFailureModal = false"
      />
    </transition>
  </div>
</template>

<script>
import cryptoRandomString from 'crypto-random-string';
import axios from 'axios';
import Modal from '@/widgets/Modal.vue';
import OperationFailedModal from '@/widgets/OperationFailedModal.vue';
import PermissionsTable from '@/components/PermissionsTable.vue';
import ConfirmationModal from '@/widgets/ConfirmationModal.vue';
import Loader from '@/widgets/Loader.vue';
import { handleInvalidTokenError } from '@/utils/errorHandling.js';
import { PermissionsService } from '@/services/permissions.service.js';

export default {
  name: 'CreateEditUserModal',
  props: {
    edit: Boolean,
    create: Boolean,
    username: String,
    permissions: {}
  },
  components: {
    Modal,
    PermissionsTable,
    ConfirmationModal,
    Loader,
    OperationFailedModal
  },
  data: function () {
    return {
      password: '',
      showResetPasswordConfirmationModal: false,
      showDeleteConfirmationModal: false,
      resetPasswordConfirmationMsg:
        'Are you sure you want to reset the password of this user?',
      deleteConfirmationMsg: 'Are you sure you want to delete this user?',
      showLoader: false,
      showFailureModal: false,
      atLeastOnePermissionSelected: true
    };
  },
  computed: {
    headerStart: function () {
      return this.edit ? 'Edit' : 'Create';
    },
    canChangePermissions: () => PermissionsService.canChangePermissions(),
    canResetPassword: () => PermissionsService.canResetPassword(),
    canDelete: () => PermissionsService.canDeleteAdminUsers()
  },
  methods: {
    saveChanges: function () {
      if (this.create) {
        this.createUser();
      } else if (this.edit) {
        this.changePermissions();
      }
    },
    isSelectedPermissionsValid () {
      // throw an error if user has no permissions selected
      if (
        this.permissions.users.length === 0 &&
        this.permissions.settings.length === 0 &&
        this.permissions.platformUsers.length === 0
      ) {
        this.showFailureModal = false;
        this.atLeastOnePermissionSelected = false;
        return false;
      }
      this.atLeastOnePermissionSelected = true;
      return true;
    },
    createUser () {
      if (!this.isSelectedPermissionsValid()) {
        return;
      }
      this.showLoader = true;
      axios
        .post('/users', {
          username: this.username,
          password: this.password,
          permissions: this.permissions
        })
        .then(() => {
          this.$emit('userCreated', {
            username: this.username,
            password: this.password
          });
        })
        .catch(error => {
          if (!handleInvalidTokenError(error, this)) {
            this.showFailureModal = true;
          }
        })
        .finally(() => (this.showLoader = false));
    },
    changePermissions () {
      this.showLoader = true;
      axios
        .put(`/users/${this.username}/permissions`, {
          permissions: this.permissions
        })
        .then(() => {
          this.$emit('permissionsChanged', this.permissions);
        })
        .catch(error => {
          if (!handleInvalidTokenError(error, this)) {
            this.showFailureModal = true;
          }
        })
        .finally(() => (this.showLoader = false));
    },
    resetPassword () {
      this.showResetPasswordConfirmationModal = false;
      this.showLoader = true;
      axios
        .post(`/users/${this.username}/reset-password`, {})
        .then(response => {
          this.$emit('passwordResetDone', response.data);
        })
        .catch(error => {
          if (!handleInvalidTokenError(error, this)) {
            this.showFailureModal = true;
          }
        })
        .finally(() => (this.showLoader = false));
    },
    deleteUser () {
      this.showDeleteConfirmationModal = false;
      this.showLoader = true;

      axios
        .delete(`/users/${this.username}`)
        .catch(error => {
          if (!handleInvalidTokenError(error, this)) {
            this.showFailureModal = true;
          }
        })
        .then(() => {
          this.$emit('userDeleted');
        })
        .finally(() => (this.showLoader = false));
    }
  },
  beforeMount () {
    this.password = cryptoRandomString({ length: 10, type: 'url-safe' });
  }
};
</script>

<style scoped>
hr {
  margin: 10px;
}
.black-button:hover {
  color: #c8c8c8;
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
  -webkit-transform: scale(1.1);
  transform: scale(1.1);
}
</style>

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
            <PermissionsTable
              :permissions="permissions"
              :disableCheckBoxes="edit && !canChangePermissions"
            />
          </b-form-group>
          <div class="modal-footer">
            <b-button variant="success" type="submit">
              Save
            </b-button>
            <b-button variant="secondary" @click="$emit('close')">
              Cancel
            </b-button>
          </div>
        </b-form>
        <div v-if="edit">
          <hr />
          <b-button
            v-if="canResetPassword"
            variant="dark"
            class="btn-sm black-button"
            @click="showResetPasswordConfirmationModal = true"
          >
            Reset password
          </b-button>
          <b-button
            v-if="canDelete"
            variant="dark"
            class="btn-sm black-button"
            @click="showDeleteConfirmationModal = true"
          >
            Delete
          </b-button>
        </div>
      </div>
      <div slot="footer"></div>
    </Modal>
    <loader v-if="showLoader" :loading="showLoader"></loader>
    <ConfirmationModal
      v-if="showResetPasswordConfirmationModal"
      :text="resetPasswordConfirmationMsg"
      @close="showResetPasswordConfirmationModal = false"
      @confirm="resetPassword()"
    />
    <ConfirmationModal
      v-if="showDeleteConfirmationModal"
      :text="deleteConfirmationMsg"
      @close="showDeleteConfirmationModal = false"
      @confirm="deleteUser()"
    />
    <OperationFailedModal
      v-if="showFailureModal"
      @close="showFailureModal = false"
    />
  </div>
</template>

<script>
const axios = require("axios");
import Modal from "@/widgets/Modal.vue";
import OperationFailedModal from "@/widgets/OperationFailedModal.vue";
import PermissionsTable from "@/components/PermissionsTable.vue";
import ConfirmationModal from "@/widgets/ConfirmationModal.vue";
import Loader from "@/widgets/Loader.vue";
const { handleHttpErrors } = require("@/utils/errorHandling.js");
import { PermissionsService } from "@/services/permissions.service.js";

export default {
  name: "CreateEditUserModal",
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
  data: function() {
    return {
      password: "",
      showResetPasswordConfirmationModal: false,
      showDeleteConfirmationModal: false,
      resetPasswordConfirmationMsg:
        "Are you sure you want to reset the password of this user?",
      deleteConfirmationMsg: "Are you sure you want to delete this user?",
      showLoader: false,
      showFailureModal: false
    };
  },
  computed: {
    headerStart: function() {
      return this.edit ? "Edit" : "Create";
    },
    canChangePermissions: () => PermissionsService.canChangePermissions(),
    canResetPassword: () => PermissionsService.canResetPassword(),
    canDelete: () => PermissionsService.canDeleteUsers()
  },
  methods: {
    saveChanges: function() {
      if (this.create) {
        this.createUser();
      } else if (this.edit) {
        this.changePermissions();
      }
    },
    createUser() {
      this.showLoader = true;
      axios
        .post(
          `${localStorage.getItem("serverUrl")}/users`,
          {
            username: this.username,
            password: this.password,
            permissions: this.permissions
          },
          {
            headers: {
              authorization: localStorage.getItem("token")
            }
          }
        )
        .then(() => {
          this.$emit("userCreated");
        })
        .catch(error => {
          if (!handleHttpErrors(error, this)) {
            this.showFailureModal = true;
          }
        })
        .finally(() => (this.showLoader = false));
    },
    changePermissions() {
      this.showLoader = true;
      axios
        .put(
          `${localStorage.getItem("serverUrl")}/users/${
            this.username
          }/permissions`,
          {
            permissions: this.permissions
          },
          {
            headers: {
              authorization: localStorage.getItem("token")
            }
          }
        )
        .then(() => {
          this.$emit("permissionsChanged", this.permissions);
        })
        .catch(error => {
          if (!handleHttpErrors(error, this)) {
            this.showFailureModal = true;
          }
        })
        .finally(() => (this.showLoader = false));
    },
    resetPassword() {
      this.showResetPasswordConfirmationModal = false;
      this.showLoader = true;
      axios
        .post(
          `${localStorage.getItem("serverUrl")}/users/${
            this.username
          }/reset-password`,
          {},
          {
            headers: {
              authorization: localStorage.getItem("token")
            }
          }
        )
        .then(() => {
          this.$emit("passwordResetDone");
        })
        .catch(error => {
          if (!handleHttpErrors(error, this)) {
            this.showFailureModal = true;
          }
        })
        .finally(() => (this.showLoader = false));
    },
    deleteUser() {
      this.showDeleteConfirmationModal = false;
      this.showLoader = true;

      axios
        .delete(`${localStorage.getItem("serverUrl")}/users/${this.username}`, {
          headers: {
            authorization: localStorage.getItem("token")
          }
        })
        .catch(error => {
          if (!handleHttpErrors(error, this)) {
            this.showFailureModal = true;
          }
        })
        .then(() => {
          this.$emit("userDeleted");
        })
        .finally(() => (this.showLoader = false));
    }
  },
  beforeMount() {}
};
</script>

<style scoped>
hr {
  margin: 10px;
}
.black-button:hover {
  color: #c8c8c8;
}
</style>

<template>
  <div>
    <Modal @close="$emit('close')">
      <h3 slot="header">Enter new password</h3>
      <div slot="body">
        <b-form v-on:submit.prevent="requestPasswordChange">
          <b-form-group label-for="password">
            <b-form-input
              required
              type="text"
              name="password"
              id="password"
              placeholder="New Password"
              v-model="password"
              @input="passwordChangeFailed = false"
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
        <b-card v-if="passwordChangeFailed">
          <div class="failure-msg">
            <p>Password change failed</p>
            <p>Please try again later</p>
          </div>
        </b-card>
        <b-card v-if="passwordChangeSuccessful">
          <div class="success-msg">
            <p>Password successfully changed</p>
          </div>
        </b-card>
      </div>
      <div slot="footer"></div>
    </Modal>
    <transition name="modal">
      <OperationFailedModal
        v-if="showFailureModal"
        @close="showFailureModal = false"
      />
    </transition>
    <transition name="modal">
      <OperationSuccessfulModal
        v-if="showPasswordChangedModal"
        :text="passwordChangedText"
        @close="$emit('close')"
      />
    </transition>
    <loader v-if="showLoader" :loading="showLoader"></loader>
  </div>
</template>

<script>
const axios = require("axios");
const jwtDecode = require("jwt-decode");
import Modal from "@/widgets/Modal.vue";
import OperationSuccessfulModal from "@/widgets/OperationSuccessfulModal.vue";
import OperationFailedModal from "@/widgets/OperationFailedModal.vue";
import Loader from "@/widgets/Loader.vue";

export default {
  name: "PasswordChangeModal",
  components: {
    Modal,
    OperationSuccessfulModal,
    OperationFailedModal,
    Loader,
  },
  data: () => ({
    password: "",
    passwordChangeFailed: false,
    passwordChangeSuccessful: false,
    passwordProvided: true,
    passwordChangedText: "Password changed successfully",
    showPasswordChangedModal: false,
    showFailureModal: false,
    showLoader: false,
  }),
  methods: {
    requestPasswordChange: function() {
      this.showLoader = true;
      const token = localStorage.getItem("token");
      const username = jwtDecode(token).username;
      axios
        .post(`/users/${username}/change-password`, { password: this.password })
        .then(() => {
          this.showPasswordChangedModal = true;
        })
        .catch(() => {
          this.showFailureModal = true;
        })
        .finally(() => (this.showLoader = false));
    },
  },
};
</script>

<style scoped>
.modal-enter-active {
  transition: all 0.3s ease;
}
.modal-enter {
  opacity: 0;
}
.modal-leave-active {
  opacity: 0;
}
.modal-enter .modal-container,
.modal-leave-active .modal-container {
  -webkit-transform: scale(1.1);
  transform: scale(1.1);
}
</style>

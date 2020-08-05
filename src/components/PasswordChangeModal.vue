<template>
  <div>
    <Modal @close="$emit('close')">
      <h3 slot="header">Enter new password</h3>
      <div slot="body">
        <b-form v-on:submit.prevent="requestPasswordChange">
          <b-form-group label-for="oldPassword">
            <b-form-input
              required
              type="password"
              name="oldPassword"
              id="oldPassword"
              placeholder="Old Password"
              v-model="oldPassword"
              @input="passwordChangeFailed = false"
            />
          </b-form-group>
          <b-form-group label-for="newPassword">
            <b-form-input
              required
              type="password"
              name="newPassword"
              id="newPassword"
              placeholder="New Password"
              v-model="newPassword"
              @input="passwordChangeFailed = false"
            />
          </b-form-group>
          <b-form-group label-for="newPasswordCheck">
            <b-form-input
              required
              type="password"
              name="newPasswordCheck"
              id="newPasswordCheck"
              placeholder="Confirm Password"
              v-model="newPasswordCheck"
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
const axios = require('axios');
const jwtDecode = require('jwt-decode');
import Modal from '@/widgets/Modal.vue';
import OperationSuccessfulModal from '@/widgets/OperationSuccessfulModal.vue';
import OperationFailedModal from '@/widgets/OperationFailedModal.vue';
import Loader from '@/widgets/Loader.vue';

export default {
  name: 'PasswordChangeModal',
  components: {
    Modal,
    OperationSuccessfulModal,
    OperationFailedModal,
    Loader,
  },
  data: () => ({
    oldPassword: '',
    newPassword: '',
    newPasswordCheck: '',
    passwordChangeFailed: false,
    passwordChangeSuccessful: false,
    passwordProvided: true,
    passwordChangedText: 'Password changed successfully',
    showPasswordChangedModal: false,
    showFailureModal: false,
    showLoader: false,
  }),
  methods: {
    requestPasswordChange: function() {
      this.showLoader = true;
      const token = localStorage.getItem('token');
      const username = jwtDecode(token).username;
      axios
        .post(`/users/${username}/change-password`, {
          oldPassword: this.oldPassword,
          newPassword: this.newPassword,
          newPasswordCheck: this.newPasswordCheck,
        })
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

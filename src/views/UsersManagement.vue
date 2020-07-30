<template>
  <div class="users-management">
    <h2>Users Management</h2>
    <b-card v-if="loadFailed">
      <div class="failure-msg">
        <p>Unable to retrieve users list from the server.</p>
        <p>Please try again later.</p>
      </div>
    </b-card>
    <b-table
      striped
      hover
      sticky-header="49em"
      responsive
      fixed
      selectable
      select-mode="single"
      @row-selected="onRowSelected"
      head-variant="light"
      :items="usersList"
      :fields="tableHeaders"
      primary-key="username"
    >
      <template v-slot:cell(users)="row">
        {{ row.item.username }}
      </template>
      <template v-slot:cell(permissions)="row">
        <PermissionsTable
          :permissions="row.item.permissions"
          :disableCheckBoxes="true"
        />
      </template>
    </b-table>
    <b-card>
      <b-button
        v-if="canChangePermissions && Object.keys(selectedUser).length > 0"
        variant="info"
        @click="showEditUserModal = true"
      >
        Edit
      </b-button>
      <b-button
        v-if="canCreate"
        variant="success"
        @click="showCreateUserModal = true"
      >
        Create
      </b-button>
    </b-card>
    <transition name="modal">
      <CreateEditUserModal
        v-if="showEditUserModal"
        :edit="true"
        :username="selectedUser.username"
        :permissions="Object.assign({}, selectedUser.permissions)"
        @close="showEditUserModal = false"
        @permissionsChanged="
          onPermissionsChanged($event, selectedUser.username)
        "
        @passwordResetDone="onPasswordResetDone($event)"
        @userDeleted="onUserDeleted()"
      />
    </transition>
    <loader v-if="loadInProgress" :loading="loadInProgress"></loader>
    <transition name="modal">
      <CreateEditUserModal
        v-if="showCreateUserModal"
        :create="true"
        @close="showCreateUserModal = false"
        :permissions="{ users: [], settings: [] }"
        @userCreated="onUserCreated($event)"
      />
    </transition>
    <transition name="modal">
      <OperationSuccessfulModal
        v-if="showUsersPermissionsChangedModal"
        :text="usersPermissionsChangedText"
        @close="onUsersPermissionsChangedModalClose()"
      />
    </transition>
    <transition name="modal">
      <OperationSuccessfulModal
        v-if="showUsersPasswordResetedModal"
        :text="usersPasswordResetedText"
        @close="onUsersPasswordResetedModalClose()"
      />
    </transition>
    <transition name="modal">
      <OperationSuccessfulModal
        v-if="showUserDeletedModal"
        :text="userDeletedText"
        @close="onUserDeletedModalClose()"
      />
    </transition>
    <transition name="modal">
      <OperationSuccessfulModal
        v-if="showUserCreatedModal"
        :text="userCreatedText"
        @close="onUserCreatedModalClose()"
      />
    </transition>
  </div>
</template>

<script>
const axios = require('axios');
import Loader from '@/widgets/Loader.vue';
import OperationSuccessfulModal from '@/widgets/OperationSuccessfulModal.vue';
import CreateEditUserModal from '@/components/CreateEditUserModal.vue';
import PermissionsTable from '@/components/PermissionsTable.vue';
import { PermissionsService } from '@/services/permissions.service.js';
const { handleHttpErrors } = require('@/utils/errorHandling.js');

export default {
  name: 'UsersManagement',
  components: {
    Loader,
    CreateEditUserModal,
    PermissionsTable,
    OperationSuccessfulModal,
  },
  data: () => ({
    usersList: [],
    loadFailed: false,
    loadInProgress: false,
    selectedUser: {},
    tableHeaders: [
      {
        key: 'users',
        label: 'Username',
        thStyle: { 'padding-left': '60px' },
        class: 'users-management-user-row',
      },
      {
        key: 'permissions',
        label: 'Permissions',
        thStyle: { 'padding-left': '60px' },
      },
    ],
    settingsPermissions: ['read', 'update'],
    usersPermissions: [
      'read',
      'create',
      'delete',
      'resetPassword',
      'changePermissions',
    ],
    showCreateUserModal: false,
    showEditUserModal: false,
    showUserDeletedModal: false,
    userDeletedText: 'User deleted successfully',
    showUserCreatedModal: false,
    userCreatedInitialText: 'User created successfully.',
    userCreatedText: '',
    showUsersPasswordResetedModal: false,
    // eslint-disable-next-line quotes
    usersPasswordResetedInitialText: "User's password reset successful.",
    usersPasswordResetedText: '',
    showUsersPermissionsChangedModal: false,
    // eslint-disable-next-line quotes
    usersPermissionsChangedText: "User's permissions updated successfully",
  }),
  computed: {
    canChangePermissions: () => PermissionsService.canChangePermissions(),
    canCreate: () => PermissionsService.canCreateUsers(),
  },
  methods: {
    onUsersPermissionsChangedModalClose: function() {
      this.showUsersPermissionsChangedModal = false;
      this.showEditUserModal = false;
    },
    onUsersPasswordResetedModalClose: function() {
      this.showUsersPasswordResetedModal = false;
      this.showEditUserModal = false;
    },
    onUserDeletedModalClose: function() {
      this.showUserDeletedModal = false;
      this.showEditUserModal = false;
    },
    onUserCreatedModalClose: function() {
      this.showUserCreatedModal = false;
      this.showCreateUserModal = false;
    },
    onPasswordResetDone: function($event) {
      this.usersPasswordResetedText = `${this.usersPasswordResetedInitialText} New password: ${$event.password}`;
      this.showUsersPasswordResetedModal = true;
    },
    onRowSelected: function(items) {
      if (items && items.length > 0) {
        this.selectedUser = items[0];
      } else {
        this.selectedUser = '';
      }
    },
    onUserCreated: function($event) {
      this.userCreatedText = `${this.userCreatedInitialText} username: ${$event.username} \n password: ${$event.password}`;
      this.showUserCreatedModal = true;
      this.getUsersList();
    },
    onUserDeleted: function() {
      this.showUserDeletedModal = true;
      this.getUsersList();
    },
    onPermissionsChanged: function(permissions, username) {
      this.showUsersPermissionsChangedModal = true;
      this.usersList.find(
        e => e.username === username
      ).permissions = permissions;
    },
    getUsersList: function() {
      this.loadInProgress = true;
      axios
        .get('/users')
        .then(response => {
          if (!response.data || Object.keys(response.data).length === 0) {
            throw new Error();
          }
          this.usersList = response.data;
        })
        .catch(error => {
          if (!handleHttpErrors(error, this)) {
            this.loadFailed = true;
          }
        })
        .finally(() => {
          this.loadInProgress = false;
        });
    },
  },
  beforeMount() {
    this.getUsersList();
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
  background-color: #ecf5f3;
  padding: 20px;
}
.failure-msg {
  color: rgb(189, 16, 38);
}
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
.b-table {
  width: 80%;
}
</style>

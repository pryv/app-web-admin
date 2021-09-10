<template>
  <div class="migration-platform-modal">
    <Modal @close="$emit('migrationModalClosed')">
      <h3 slot="header">Migrate platform</h3>
      <div slot="body">
        <div v-if="hasMigrations()">
          <h4>Available migrations</h4>
          <b-table
            hover
            fixed
            head-variant="light"
            :items="migrations"
          ></b-table>
        </div>
        <div v-if="!hasMigrations() && error == null">
          <h4>No available migration</h4>
          There are no available migrations.<br>
          If you have just performed a migration, close this window and click on "Update", at the bottom right of the "Platform configuration" tab to apply the migration to Pryv.io services.
        </div>
        <div v-if="error != null">
          <h4>Error while fetching migrations</h4>
          {{ error.message }}
        </div>
        <div class="modal-footer">
          <b-button variant="primary" @click="$emit('migrationModalClosed')">
            Close
          </b-button>
          <div v-if="hasMigrations()">
            <b-button
              variant="secondary"
              @click="showApplyMigrationConfirmationModal = true"
            >
              Apply migrations
            </b-button>
          </div>
        </div>
      </div>
      <div slot="footer"></div>
    </Modal>
    <loader v-if="showLoader" :loading="showLoader"></loader>
    <transition name="modal">
      <ConfirmationModal
        v-if="showApplyMigrationConfirmationModal"
        :text="migrationConfirmationMsg()"
        @close="showApplyMigrationConfirmationModal = false"
        @confirm="applyMigrations()"
      />
    </transition>
  </div>
</template>

<script>
import axios from 'axios';
import Modal from '@/widgets/Modal.vue';
import Loader from '@/widgets/Loader.vue';
import ConfirmationModal from '@/widgets/ConfirmationModal.vue';

export default {
  name: 'MigrationModal',
  components: {
    Modal,
    Loader,
    ConfirmationModal,
  },
  props: {
    user: {},
  },
  data: function() {
    return {
      migrations: [],
      error: null,
      showLoader: false,
      showApplyMigrationConfirmationModal: false,
      num: 12,
    };
  },
  async created() {
    await this.getAvailableMigrations();
  },
  methods: {
    hasMigrations: function() {
      console.log(
        'running hasMig',
        this.migrations != null && this.migrations.length > 0
      );
      return this.migrations != null && this.migrations.length > 0;
    },
    lastMigration: function() {
      console.log('runnin lastMig');
      if (this.hasMigrations()) {
        console.log('lookin for last mig', this.migrations);
        return this.migrations[this.migrations.length - 1].versionTo;
      } else {
        console.log('last mig not found');
        return '<issue fetching migrations>';
      }
    },
    migrationConfirmationMsg: function() {
      return `Are you sure you want to migration the platform configuration file to version: ${this.lastMigration()}?`;
    },
    getAvailableMigrations: async function() {
      this.showLoader = true;
      try {
        const res = await axios.get('/admin/migrations');
        this.migrations = res.data.migrations;
        console.log('got migrations', this.migrations);
        this.error = null;
      } catch (error) {
        if (
          error &&
          error.response &&
          error.response.data &&
          error.response.data.error &&
          error.response.data.error.message
        ) {
          this.error = error.response.data.error;
        } else {
          this.error = error;
        }
      } finally {
        this.showLoader = false;
      }
    },
    applyMigrations: async function() {
      this.showLoader = true;
      try {
        const res = await axios.post('/admin/migrations/apply');
        this.migrations = res.data.migrations;
        this.error = null;
        this.showApplyMigrationConfirmationModal = false;
        await this.getAvailableMigrations();
      } catch (error) {
        if (
          error &&
          error.response &&
          error.response.data &&
          error.response.data.error &&
          error.response.data.error.message
        ) {
          this.error = error.response.data.error;
        } else {
          this.error = error;
        }
      } finally {
        this.showLoader = false;
      }
    },
  },
};
</script>

<style scoped>
.main-header {
  text-align: center;
}
</style>

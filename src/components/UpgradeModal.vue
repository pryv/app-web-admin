<template>
  <div class="upgrade-platform-modal">
    <Modal @close="$emit('upgradeModalClosed')">
      <h3 slot="header">Upgrade platform</h3>
      <div slot="body">
        <div v-if="hasMigrations()">
          <h4>Available upgrades</h4>
          <b-table
            hover
            fixed
            head-variant="light"
            :items="migrations"
          ></b-table>
        </div>
        <div v-if="!hasMigrations()">
          <h4>No available upgrade</h4>
          There are no available upgrade from your version to the template one
        </div>
        <div v-if="error != null">
          <h4>Error while fetching upgrades</h4>
          {{ error.message }}
        </div>
        <div class="modal-footer">
          <b-button variant="primary" @click="$emit('upgradeModalClosed')">
            Close
          </b-button>
          <div v-if="hasMigrations">
            <b-button
              variant="secondary"
              @click="showApplyUpgradeConfirmationModal = true"
            >
              Apply upgrades
            </b-button>
          </div>
        </div>
      </div>
      <div slot="footer"></div>
    </Modal>
    <loader v-if="showLoader" :loading="showLoader"></loader>
    <transition name="modal">
      <ConfirmationModal
        v-if="showApplyUpgradeConfirmationModal"
        :text="upgradeConfirmationMsg()"
        @close="showApplyUpgradeConfirmationModal = false"
        @confirm="applyUpgrades()"
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
  name: 'UpgradeModal',
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
      showApplyUpgradeConfirmationModal: false,
      num: 12,
    };
  },
  async created() {
    await this.getAvailableUpgrades();
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
    upgradeConfirmationMsg: function() {
      return `Are you sure you want to upgrade the platform configuration to ${this.lastMigration()}`;
    },
    getAvailableUpgrades: async function() {
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
    applyUpgrades: async function() {
      this.showLoader = true;
      try {
        const res = await axios.post('/admin/migrations/apply');
        this.migrations = res.data.migrations;
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
  },
};
</script>

<style scoped>
.main-header {
  text-align: center;
}
</style>

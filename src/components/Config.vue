<template>
  <div class="config">
    <h1>Configuration Panel</h1>
    <b-card>
      <b-form v-on:submit.prevent="getConfig">
        <b-form-group label-for="address" label="Config leader address">
          <b-form-input
            required
            pattern="https?://\S+"
            type="text"
            name="address"
            id="address"
            placeholder="https://lead.platform.com"
            v-model="address"
            @input="resetFailureIndicators"
          />
        </b-form-group>
        <b-form-group label-for="adminKey" label="Admin key">
          <b-form-input
            required
            type="text"
            name="adminKey"
            id="adminKey"
            placeholder="admin key"
            v-model="adminKey"
            @input="resetFailureIndicators"
          />
        </b-form-group>
        <b-button variant="success" type="submit">Load</b-button>
      </b-form>
    </b-card>
    <b-card v-if="loadFailed">
      <div class="failure-msg">
        <p>Unable to retrieve configuration from the server.</p>
        <p>Verify provided information or try again later.</p>
      </div>
    </b-card>
    <loader
      v-if="updateInProgress || loadInProgress"
      :loading="updateInProgress"
    ></loader>
    <b-card v-if="updateFailed">
      <div class="failure-msg">
        <p>Unable to update configuration.</p>
        <p>Verify provided information or try again later.</p>
      </div>
    </b-card>
    <br />
    <b-card no-body>
      <b-tabs pills justified card v-if="Object.keys(config).length !== 0">
        <b-tab
          title-link-class="tab-title"
          v-for="(val, prop) in config"
          :key="prop"
          :title="val.name"
        >
          <ConfigTable :initialConfigSection="prop" />
        </b-tab>
      </b-tabs>
    </b-card>
    <b-card v-if="Object.keys(config).length !== 0">
      <b-button variant="success" v-on:click="updateConfig">Update </b-button>
    </b-card>

    <transition name="modal">
      <UpdateReportModal
        :updateReport="updateConfigReport"
        v-if="showModal"
        @updateReportModalClosed="showModal = false"
      />
    </transition>
  </div>
</template>

<script>
const axios = require("axios");
import ConfigTable from "@/components/ConfigTable.vue";
import UpdateReportModal from "@/components/UpdateReportModal.vue";
import Loader from "@/widgets/Loader.vue";
import store from "@/store/store.js";

export default {
  name: "Config",
  components: {
    ConfigTable,
    UpdateReportModal,
    Loader
  },
  data: () => ({
    address: "",
    adminKey: "",
    loadFailed: false,
    updateFailed: false,
    showModal: false,
    updateConfigReport: {},
    updateInProgress: false,
    loadInProgress: false
  }),
  computed: {
    config: () => store.state.config
  },
  methods: {
    isFormNotEmpty: function() {
      return !!this.address && !!this.adminKey;
    },
    getConfig: function() {
      if (this.isFormNotEmpty()) {
        store.state.config = {};
        this.loadInProgress = true;
        axios
          .get(`${this.address}/admin/settings?auth=${this.adminKey}`)
          .then(response => {
            if (!response.data || Object.keys(response.data).length === 0) {
              throw new Error();
            }
            store.state.config = response.data;
          })
          .catch(() => {
            this.loadFailed = true;
          })
          .finally(() => {
            this.loadInProgress = false;
          });
      }
    },
    updateConfig: function() {
      this.updateInProgress = true;
      this.updateFailed = false;
      axios
        .put(
          `${this.address}/admin/settings?auth=${this.adminKey}`,
          store.state.config
        )
        .then(() =>
          axios.post(`${this.address}/admin/notify?auth=${this.adminKey}`)
        )
        .then(response => {
          if (
            !response.data ||
            !(
              Object.hasOwnProperty.call(response.data, "successes") &&
              Object.hasOwnProperty.call(response.data, "failures")
            )
          ) {
            throw new Error();
          }
          this.updateConfigReport = response.data;
          this.showModal = true;
        })
        .catch(() => {
          this.updateFailed = true;
        })
        .finally(() => {
          this.updateInProgress = false;
        });
    },
    resetFailureIndicators: function() {
      this.loadFailed = false;
      this.updateFailed = false;
    }
  }
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
</style>

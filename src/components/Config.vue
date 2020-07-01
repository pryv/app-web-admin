<template>
  <div class="config">
    <h1>Configuration Panel</h1>
    <form v-on:submit.prevent="getConfig">
      <label for="address">Config leader address</label><br>
      <transition name="input-address">
        <input required pattern="https?://\S+" 
          type="text" name="address" id="address" v-model="address" @input="resetFailureIndicators">
      </transition>
      <br><br>
      <label for="adminKey">Admin key</label><br>
      <input required type="text" name="adminKey" id="adminKey" 
        v-model="adminKey" @input="resetFailureIndicators">
      <br><br>
      <b-button variant="success" type="submit">Load</b-button>
    </form>
    <div class="failure-msg" v-if="loadFailed">
      <p>Unable to retrieve configuration from server.</p>
      <p>Verify provided information or try again later.</p>
    </div>
    <b-button variant="success" v-if="Object.keys(pryvConfig).length !== 0" v-on:click="updateConfig">Update</b-button>
    <loader v-if="updateInProgress" :loading="updateInProgress"></loader>
    <div class="failure-msg" v-if="updateFailed">
      <p>Unable to update configuration.</p>
      <p>Verify provided information or try again later.</p>
    </div>
    <br>
    <ConfigTable :config='pryvConfig' @tableAltered="pryvConfig = $event"/>
    <transition name="modal">
      <UpdateReportModal :updateReport='updateConfigReport' v-if="showModal" @updateReportModalClosed="showModal = false"/>
    </transition>
  </div>
</template>

<script>
const axios = require('axios');
import ConfigTable from "@/components/ConfigTable.vue";
import UpdateReportModal from "@/components/UpdateReportModal.vue";
import Loader from "@/widgets/Loader.vue";

export default {
  name: "Config",
  components: {
    ConfigTable,
    UpdateReportModal,
    Loader
  },
  data: () => ({
    pryvConfig: {},
    address: '',
    adminKey: '',
    loadFailed: false,
    updateFailed: false,
    showModal: false,
    updateConfigReport: {},
    updateInProgress: false
  }),
  methods: {
    isFormNotEmpty: function() {
      return !!this.address && !!this.adminKey;
    },
    getConfig: function() {
      if(this.isFormNotEmpty()) {
        this.pryvConfig = {};
        axios
          .get(`${this.address}/admin/settings?auth=${this.adminKey}`)
          .then(response => {
            this.pryvConfig = response.data;
          })
          .catch(e => {
            console.error(e.message);
            this.loadFailed = true;
          });
        }
    },
    updateConfig: function() {
      this.updateInProgress = true;
      this.updateFailed = false;
      axios
        .put(`${this.address}/admin/settings?auth=${this.adminKey}`, this.pryvConfig)
        .then(() => axios.post(`${this.address}/admin/notify?auth=${this.adminKey}`))
        .then(response => {
          this.updateConfigReport = response.data;
          this.showModal = true;
        })
        .catch(e => {
          console.error(e.message);
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
}
button:hover {
  box-shadow: 0 4px 4px 0 rgba(0,0,0,0.24), 0 6px 8px 0 rgba(0,0,0,0.19);
  outline: none !important;
}
button:active {
  border: 0;
}
input[type=text] {
  padding: 12px 20px;
  box-sizing: border-box;
  border: 2px solid #999999;
  border-radius: 4px;
}
input:focus {
    outline: none !important;
    width: 40%;
    background-color: rgb(242, 252, 255);
    border-color: rgb(120, 190, 202);
}
form {
    background-color: #ecf5f3;
    padding: 20px;
}
.failure-msg {
  color: rgb(189, 16, 38)
}
.modal-enter-active {
  transition: all .3s ease;
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
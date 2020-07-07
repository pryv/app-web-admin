<template>
  <Modal @close="$emit('updateReportModalClosed')">
    <h3 slot="header">Update report</h3>
    <div slot="body">
      <div v-if="Object.keys(updateReport.successes).length > 0">
        <h4>Successes</h4>
        <b-table hover fixed head-variant="light" :items="successes"></b-table>
      </div>
      <div v-if="Object.keys(updateReport.failures).length > 0">
        <h4>Failures</h4>
        <b-table hover fixed head-variant="light" :items="failures"></b-table>
      </div>
    </div>
  </Modal>
</template>

<script>
import Modal from "@/widgets/Modal.vue";

export default {
  name: "UpdateReportModal",
  components: {
    Modal
  },
  props: {
    updateReport: {}
  },
  computed: {
    successes: function() {
      return Object.keys(this.updateReport.successes).map(function(key) {
        return {
          url: this.updateReport.successes[key].url,
          role: this.updateReport.successes[key].role
        };
      }.bind(this))
    },
    failures: function() {
      return Object.keys(this.updateReport.failures).map(function(key) {
        return {
          url: this.updateReport.failures[key].url,
          role: this.updateReport.failures[key].role
        };
      }.bind(this))
    }
  }
};
</script>

<style scoped>
.main-header {
  text-align: center;
}
</style>

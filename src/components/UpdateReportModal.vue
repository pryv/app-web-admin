<template>
  <Modal @close="$emit('updateReportModalClosed')">
    <h3 slot="header">Configuration update report</h3>
    <table slot="body">
      <hr />
      <div v-if="updateReport.successes">
        <tr>
          <th class="main-header" colspan="2">Successes</th>
        </tr>
        <tr>
          <th>url</th>
          <th>role</th>
        </tr>
        <tr v-for="(url_role, hash) in updateReport.successes" :key="hash">
          <td>{{ url_role.url }}</td>
          <td>{{ url_role.role }}</td>
        </tr>
      </div>

      <br />
      <div v-if="updateReport.failures">
        <tr>
          <th class="main-header" colspan="2">Failures</th>
        </tr>
        <tr>
          <th>url</th>
          <th>role</th>
        </tr>
        <tr v-for="(url_role, hash) in updateReport.failures" :key="hash">
          <td>{{ url_role.url }}</td>
          <td>{{ url_role.role }}</td>
        </tr>
      </div>
    </table>
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
  }
};
</script>

<style scoped>
table {
  width: 100%;
}
th {
  border-bottom: 1px solid #ddd;
  padding-left: 10px;
}
td {
  padding: 5px;
}
.main-header {
  text-align: center;
}
hr {
  border: 0;
  margin: 5px;
}
</style>

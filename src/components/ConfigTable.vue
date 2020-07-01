<template>
  <div class="config-table">
    <table v-if="Object.keys(config).length !== 0">
      <tr>
        <th>Property</th>
        <th>Value</th>
      </tr>
      <tr v-for="(val, prop) in config" :key="prop">
        <td>{{ prop }}</td>
        <td>
          <div @input="onValueInput($event, prop)" contenteditable>
            {{ val }}
          </div>
        </td>
      </tr>
    </table>
  </div>
</template>

<script>
export default {
  name: "ConfigTable",
  props: {
    config: {}
  },
  methods: {
    onValueInput: function(e, prop) {
      this.config[prop] = JSON.stringify(
        JSON.parse(e.target.innerText),
        null,
        2
      );
      this.$emit("tableAltered", this.config);
    }
  }
};
</script>

<style scoped>
table {
  margin-left: auto;
  margin-right: auto;
  max-width: 40%;
  table-layout: fixed;
}
th {
  text-align: center;
}
table,
th,
td {
  border: 1px solid black;
  border-collapse: collapse;
}
th,
td {
  padding: 15px;
}
td {
  width: 20%;
}
</style>

<template>
  <div class="config-table">
    <b-table
      striped
      hover
      sticky-header="19em"
      responsive
      fixed
      head-variant="light"
      :items="displayConfig"
    >
      <template primary-key v-slot:cell(property)="row">
        <div class="tab-cell">{{ row.item.property }}</div>
      </template>
      <template v-slot:cell(value)="row">
        <b-form-input
          v-model="row.item.value"
          v-on:blur="onValueChanged($event, row.item.property)"
        />
      </template>
      <template v-slot:cell(description)="row">
        <div class="tab-cell">{{ row.item.description }}</div>
      </template>
    </b-table>
  </div>
</template>

<script>
import store from "@/store/store.js";

export default {
  name: "ConfigTable",
  props: {
    initialConfigSection: String
  },
  data: function() {
    return {
      configSection: this.initialConfigSection
    };
  },
  computed: {
    config: function() {
      return store.state.config[this.configSection].settings;
    },
    displayConfig: function() {
      return Object.keys(this.config).map(
        function(key) {
          const configDesc = this.config[key].description
            ? this.config[key].description
            : null;

          let configValue = this.config[key];
          if (Object.prototype.hasOwnProperty.call(configValue, "value")) {
            configValue = configValue.value;
          }

          if (!configValue && typeof configValue !== "boolean") {
            configValue = "";
          } else if (typeof configValue === "object") {
            configValue = JSON.stringify(configValue);
          } else if (typeof configValue !== "string") {
            configValue = String(configValue);
          }

          return { property: key, value: configValue, description: configDesc };
        }.bind(this)
      );
    }
  },
  methods: {
    onValueChanged: function(e, prop) {
      let changedText = this.displayConfig.find(e => e.property === prop).value;
      if (this.isJSON(changedText)) {
        changedText = JSON.parse(changedText);
      }
      this.config[prop].value = changedText;
    },
    isJSON: function(text) {
      try {
        JSON.parse(text);
      } catch (e) {
        return false;
      }
      return true;
    }
  }
};
</script>

<style scoped>
.config-table {
  height: 30rem;
}
.tab-cell {
  white-space: normal;
  overflow-wrap: break-word;
}
</style>

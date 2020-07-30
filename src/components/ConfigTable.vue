<template>
  <div class="config-table">
    <b-table
      striped
      hover
      sticky-header="42em"
      responsive
      fixed
      head-variant="light"
      :items="displayConfig"
      :fields="tableHeaders"
    >
      <template primary-key v-slot:cell(property)="row">
        <div class="tab-cell">{{ row.item.property }}</div>
      </template>
      <template v-slot:cell(value)="row">
        <VJsoneditor
          class="editor"
          v-model="row.item.value"
          :plus="false"
          :options="{
            onChangeText: function(json) {
              onValueChanged(json, row.item.property);
            },
            search: false,
            navigationBar: false,
            mode: 'tree',
            onEditable: forbidCertainEditions,
          }"
        >
        </VJsoneditor>
      </template>
      <template v-slot:cell(description)="row">
        <div class="tab-cell" v-html="row.item.description" v-linkified></div>
      </template>
    </b-table>
  </div>
</template>

<script>
import store from '@/store/store.js';
import { PermissionsService } from '@/services/permissions.service.js';
import VJsoneditor from 'v-jsoneditor/src/index';

export default {
  name: 'ConfigTable',
  props: {
    initialConfigSection: String,
  },
  components: {
    VJsoneditor,
  },
  data: function() {
    return {
      configSection: this.initialConfigSection,
      tableHeaders: [
        {
          key: 'property',
          label: 'Property',
          thStyle: { 'text-align': 'center' },
        },
        {
          key: 'value',
          label: 'Value',
          thStyle: { 'text-align': 'center' },
        },
        {
          key: 'description',
          label: 'Description',
          thStyle: { 'text-align': 'center' },
        },
      ],
    };
  },
  computed: {
    canUpdateSettings: () => PermissionsService.canUpdateSettings(),
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
          if (Object.prototype.hasOwnProperty.call(configValue, 'value')) {
            configValue = configValue.value;
          }

          if (!configValue && typeof configValue !== 'boolean') {
            configValue = '';
          } else if (typeof configValue === 'object') {
            configValue = JSON.stringify(configValue);
          } else if (typeof configValue !== 'string') {
            configValue = String(configValue);
          }

          return {
            property: key,
            value: this.isJSON(configValue)
              ? JSON.parse(configValue)
              : configValue,
            description: configDesc,
          };
        }.bind(this)
      );
    },
  },
  methods: {
    forbidCertainEditions: function(node) {
      if (!this.canUpdateSettings) {
        return false;
      }
      if (node.field === 'description') {
        return false;
      }
      if (node.field) {
        return { field: false, value: true };
      }
      return true;
    },
    onValueChanged: function(changedText, prop) {
      this.config[prop].value = changedText;
    },
    isJSON: function(text) {
      try {
        JSON.parse(text);
      } catch (e) {
        return false;
      }
      return true;
    },
  },
};
</script>

<style scoped>
.config-table {
  height: 66rem;
}
.tab-cell {
  white-space: normal;
  overflow-wrap: break-word;
  text-align: center;
}
</style>

<template>
  <div class="config-table">
    <b-table
      striped
      hover
      sticky-header="36em"
      responsive
      fixed
      head-variant="light"
      :items="displayConfig"
      :fields="tableHeaders"
    >
      <template v-slot:cell(property)="row">
        <div class="tab-cell">{{ row.item.property }}</div>
      </template>
      <template v-slot:cell(value)="row">
        <div
          v-if="typeof row.item.value !== 'object' || row.item.value === null"
        >
          <b-form-textarea
            v-if="('' + row.item.value).length > 70"
            size="sm"
            max-rows="6"
            no-resize
            v-model="row.item.value"
            v-on:blur="onValueChanged($event.target.value, row.item.property)"
            :disabled="
              !canUpdateSettings || isPropertyReadOnly(row.item.property)
            "
          ></b-form-textarea>
          <b-form-input
            v-else
            v-model="row.item.value"
            v-on:blur="onValueChanged($event.target.value, row.item.property)"
            :disabled="
              !canUpdateSettings || isPropertyReadOnly(row.item.property)
            "
          >
          </b-form-input>
        </div>
        <VJsoneditor
          v-if="typeof row.item.value === 'object' && row.item.value"
          class="editor"
          v-model="row.item.value"
          :plus="false"
          :options="{
            onValidationError: function(errors) {
              onValidationError(errors);
            },
            onChangeText: function(jsonText) {
              onChangedJsonText(jsonText, row.item.property);
            },
            enableTransform: false,
            enableSort: false,
            statusBar: false,
            mainMenuBar: true,
            search: false,
            navigationBar: false,
            mode: 'code',
            onEditable: forbidCertainEditions,
          }"
        />
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
import VJsoneditor from 'v-jsoneditor';

export default {
  name: 'ConfigTable',
  props: {
    initialConfigSection: String
  },
  components: {
    VJsoneditor
  },
  data: function () {
    return {
      configSection: this.initialConfigSection,
      tableHeaders: [
        {
          key: 'property',
          label: 'Property',
          thStyle: { 'text-align': 'center', 'min-width': '100px' },
          class: 'tab-cell'
        },
        {
          key: 'value',
          label: 'Value',
          thStyle: { 'text-align': 'center', 'min-width': '100px' },
          class: 'tab-cell'
        },
        {
          key: 'description',
          label: 'Description',
          thStyle: { 'text-align': 'center', 'min-width': '100px' },
          class: 'tab-cell'
        }
      ]
    };
  },
  computed: {
    canUpdateSettings: () => PermissionsService.canUpdateSettings(),
    config: function () {
      return store.state.config[this.configSection].settings;
    },
    displayConfig: function () {
      return Object.keys(this.config).map(
        function (key) {
          const configDesc = this.config[key].description
            ? this.config[key].description
            : null;

          let configValue = this.config[key];
          if (Object.prototype.hasOwnProperty.call(configValue, 'value')) {
            configValue = configValue.value;
          }

          if (typeof configValue === 'boolean' || configValue === null) {
            configValue = String(configValue);
          } else if (this.isJSON(configValue)) {
            configValue = JSON.parse(configValue);
          }

          return {
            property: key,
            value: configValue,
            description: configDesc
          };
        }.bind(this)
      );
    }
  },
  methods: {
    isPropertyReadOnly: function (property) {
      return ['TEMPLATE_VERSION', 'REGISTER_ADMIN_KEY'].includes(property);
    },
    forbidCertainEditions: function (node) {
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
    onValueChanged: function (changedText, prop) {
      if (this.isJSON(changedText)) {
        changedText = JSON.parse(changedText);
      }
      if (changedText === 'null') {
        changedText = null;
      }
      this.config[prop].value = changedText;
    },
    onChangedJsonText: function (json, prop) {
      if (this.isJSON(json) || typeof json === 'object') {
        this.config[prop].value = JSON.parse(json);
        this.$emit('validJson');
      }
    },
    onValidationError: function (errors) {
      if (errors && errors.length > 0) {
        this.$emit('invalidJson');
      }
    },
    isJSON: function (text) {
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
  height: 36em;
}
</style>

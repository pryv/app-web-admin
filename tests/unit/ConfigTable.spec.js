import { expect } from 'chai';
import { mount } from '@vue/test-utils';
import store from '@/store/store.js';
import ConfigTable from '@/components/ConfigTable.vue';
import { createLocalVue } from '@vue/test-utils';
import { BootstrapVue } from 'bootstrap-vue';
import linkify from 'vue-linkify';
import LocalStorageMock from './helpers/localStorage.mock';

let config;
let wrapper;
let rows;
let headerCells;
let firstRowCells;
let secondRowCells;
let configSectionSettingsKeys;

describe('ConfigTable', () => {
  before(function() {
    global.localStorage = new LocalStorageMock();

    const localVue = createLocalVue();
    localVue.use(BootstrapVue);
    localVue.directive('linkified', linkify);

    config = {
      some_section_name: {
        name: 'some_section_name',
        settings: {
          set1: {
            value: 'val1',
            description: 'desc1',
          },
          set2: {
            value: 'val2',
            description: 'desc2',
          },
        },
      },
    };
    store.state.config = config;

    wrapper = mount(ConfigTable, {
      localVue,
      propsData: { initialConfigSection: config.some_section_name.name },
    });
  });

  describe('should render table with configuration', () => {
    it('should render all settings from local storage', function() {
      rows = wrapper.findAll('tr');
      expect(rows.length).equal(
        Object.keys(config.some_section_name.settings).length + 1
      );
    });

    it('should render header row', function() {
      headerCells = rows.at(0).findAll('th');

      expect(
        headerCells
          .at(0)
          .find('div')
          .text()
      ).equal('Property');
      expect(
        headerCells
          .at(1)
          .find('div')
          .text()
      ).equal('Value');
      expect(
        headerCells
          .at(2)
          .find('div')
          .text()
      ).equal('Description');
    });

    it('should render property column', function() {
      firstRowCells = rows.at(1).findAll('td');
      secondRowCells = rows.at(2).findAll('td');
      configSectionSettingsKeys = Object.keys(
        config.some_section_name.settings
      );

      expect(
        firstRowCells
          .at(0)
          .find('div')
          .text()
      ).equal(configSectionSettingsKeys[0]);
      expect(
        secondRowCells
          .at(0)
          .find('div')
          .text()
      ).equal(configSectionSettingsKeys[1]);
    });

    it('should render description column', function() {
      expect(
        firstRowCells
          .at(2)
          .find('div')
          .text()
      ).equal(
        config.some_section_name.settings[configSectionSettingsKeys[0]]
          .description
      );
      expect(
        secondRowCells
          .at(2)
          .find('div')
          .text()
      ).equal(
        config.some_section_name.settings[configSectionSettingsKeys[1]]
          .description
      );
    });
  });
});

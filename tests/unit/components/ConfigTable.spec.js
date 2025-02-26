/**
 * @license
 * Copyright (C) Pryv https://pryv.com
 * This file is part of Pryv.io and released under BSD-Clause-3 License
 * Refer to LICENSE file
 */
import { expect } from 'chai';
import { mount, createLocalVue } from '@vue/test-utils';
import store from '@/store/store.js';
import ConfigTable from '@/components/ConfigTable.vue';
import { BootstrapVue } from 'bootstrap-vue';
import linkify from 'vue-linkify';
import Chance from 'chance';

describe('ConfigTable', () => {
  let chance;
  let config;
  let wrapper;
  let rows;
  let headerCells;
  let firstRowCells;
  let secondRowCells;
  let configSectionSettingsKeys;
  let sectionName;

  before(function () {
    chance = new Chance();

    const localVue = createLocalVue();
    localVue.use(BootstrapVue);
    localVue.directive('linkified', linkify);

    sectionName = chance.word();

    config = {};
    config[sectionName] = {
      name: sectionName,
      settings: {
        set1: {
          value: chance.word(),
          description: chance.paragraph()
        },
        set2: {
          value: chance.word(),
          description: chance.paragraph()
        }
      }
    };
    store.state.config = config;

    wrapper = mount(ConfigTable, {
      localVue,
      propsData: { initialConfigSection: config[sectionName].name }
    });
  });

  describe('should render table with configuration', () => {
    it('should render all settings from local storage', function () {
      rows = wrapper.findAll('tr');
      expect(rows.length).equal(
        Object.keys(config[sectionName].settings).length + 1
      );
    });

    it('should render header row', function () {
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

    it('should render property column', function () {
      firstRowCells = rows.at(1).findAll('td');
      secondRowCells = rows.at(2).findAll('td');
      configSectionSettingsKeys = Object.keys(config[sectionName].settings);

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

    it('should render description column', function () {
      expect(
        firstRowCells
          .at(2)
          .find('div')
          .text()
      ).equal(
        config[sectionName].settings[configSectionSettingsKeys[0]].description
      );
      expect(
        secondRowCells
          .at(2)
          .find('div')
          .text()
      ).equal(
        config[sectionName].settings[configSectionSettingsKeys[1]].description
      );
    });
  });
});

import { expect } from 'chai';
import { mount } from '@vue/test-utils';
import { createLocalVue } from '@vue/test-utils';
import PermissionsTable from '@/components/PermissionsTable.vue';
import Chance from 'chance';

describe('PermissionsTable', () => {
  let localVue;

  const username = new Chance().name();
  let permissions;

  before(function() {
    localVue = createLocalVue();

    permissions = {
      users: ['read', 'create'],
      settings: ['read'],
    };
  });

  it('should check checkboxes depending on permissions states', function() {
    const wrapper = mount(PermissionsTable, {
      localVue,
      propsData: {
        username: username,
        permissions: permissions,
        disableCheckBoxes: false,
      },
    });

    const checkBoxes = wrapper.findAll('[type="checkbox"]');
    expect(checkBoxes).length(9);

    const readUsersCheckbox = wrapper.findAll('[value="read"]').at(0);
    expect(readUsersCheckbox).not.to.be.undefined;
    expect(readUsersCheckbox.element.checked).to.be.true;

    const createUsersCheckbox = wrapper.find('[value="create"]');
    expect(createUsersCheckbox).not.to.be.undefined;
    expect(createUsersCheckbox.element.checked).to.be.true;

    const readSettingsCheckbox = wrapper.findAll('[value="read"]').at(1);
    expect(readSettingsCheckbox).not.to.be.undefined;
    expect(readSettingsCheckbox.element.checked).to.be.true;

    for (let i = 0; i < checkBoxes.length; i++) {
      if (
        !(
          permissions.users.includes(checkBoxes.at(i).element.value) ||
          permissions.settings.includes(checkBoxes.at(i).element.value)
        )
      ) {
        expect(checkBoxes.at(i).element.checked).to.be.false;
      }
    }
  });
  it('should disable all checkboxes when defined so by property', function() {
    const wrapper = mount(PermissionsTable, {
      localVue,
      propsData: {
        username: username,
        permissions: permissions,
        disableCheckBoxes: true,
      },
    });

    const checkBoxes = wrapper.findAll('[type="checkbox"]');
    expect(checkBoxes).length(9);

    for (let i = 0; i < checkBoxes.length; i++) {
      expect(checkBoxes.at(i).element.disabled).to.be.true;
    }
  });
  it('should send event on table click with username and permissions', function() {
    const wrapper = mount(PermissionsTable, {
      localVue,
      propsData: {
        username: username,
        permissions: permissions,
        disableCheckBoxes: true,
      },
    });

    wrapper.find('table').trigger('click');
    const emittedTableEvents = wrapper.emitted().permissionsTableClicked[0][0];
    expect(emittedTableEvents).to.be.ok;
    expect(emittedTableEvents[0]).to.be.ok;
    expect(emittedTableEvents[0].username).equal(username);
    expect(emittedTableEvents[0].permissions).equal(permissions);
  });
});

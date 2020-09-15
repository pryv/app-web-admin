import { expect } from 'chai';
import { mount } from '@vue/test-utils';
import AdminUsers from '@/views/AdminUsers.vue';
import { createLocalVue } from '@vue/test-utils';
import { BootstrapVue, BootstrapVueIcons } from 'bootstrap-vue';
import sinon from 'sinon';
import axios from 'axios';
import { PermissionsService } from '@/services/permissions.service.js';
import CreateEditUserModal from '@/components/CreateEditUserModal.vue';
import Chance from 'chance';

describe('AdminUsers', function() {
  const chance = new Chance();

  let wrapper;
  let getReqStub;

  const users = [
    {
      username: chance.name(),
      permissions: {
        users: ['read'],
        settings: ['read'],
      },
    },
    {
      username: chance.name(),
      permissions: {
        users: ['read'],
        settings: ['read'],
      },
    },
  ];

  async function mountComponent() {
    const localVue = createLocalVue();
    localVue.use(BootstrapVue);
    localVue.use(BootstrapVueIcons);

    getReqStub = sinon.stub(axios, 'get');
    getReqStub.returns(Promise.resolve({ data: users }));

    const elem = document.createElement('div');
    if (document.body) {
      document.body.appendChild(elem);
    }
    wrapper = mount(AdminUsers, {
      localVue,
      attachTo: elem,
    });

    await wrapper.vm.$forceUpdate();
  }

  afterEach(function() {
    wrapper.destroy();
    sinon.restore();
  });

  it('should send get users request on component mount and render retrieved users in table', async function() {
    await mountComponent();

    sinon.assert.calledOnce(getReqStub);
    sinon.assert.calledWith(getReqStub, '/users');

    const usersRows = wrapper.findAll('tbody > tr');
    expect(usersRows.length).equal(users.length);
  });
  it('should display create button when user has sufficient permissions', async function() {
    sinon.stub(PermissionsService, 'canCreateAdminUsers').returns(true);
    await mountComponent();

    const button = wrapper.find('button');
    expect(button.exists()).to.be.true;
    expect(button.text()).equal('Create');
  });
  it('should hide create button when user has insufficient permissions', async function() {
    sinon.stub(PermissionsService, 'canCreateAdminUsers').returns(false);
    await mountComponent();

    const button = wrapper.find('button');
    expect(button.exists()).to.be.false;
  });
  it('should display create user component on create button click', async function() {
    sinon.stub(PermissionsService, 'canCreateAdminUsers').returns(true);
    await mountComponent();

    await wrapper.find('button').trigger('click');

    expect(wrapper.findComponent(CreateEditUserModal).exists()).to.be.true;
  });
  it('should display edit user component on table row click', async function() {
    sinon.stub(PermissionsService, 'canChangePermissions').returns(true);
    await mountComponent();

    await wrapper.find('td').trigger('click');

    expect(wrapper.findComponent(CreateEditUserModal).exists()).to.be.true;
  });
  it('should not display edit user component when user has insufficient permissions', async function() {
    sinon.stub(PermissionsService, 'canChangePermissions').returns(false);
    await mountComponent();

    await wrapper.find('td').trigger('click');

    expect(wrapper.findComponent(CreateEditUserModal).exists()).to.be.false;
  });
});

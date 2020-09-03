import { expect } from 'chai';
import { mount } from '@vue/test-utils';
import PlatformUsers from '@/views/PlatformUsers.vue';
import ConfirmationWithInputModal from '@/widgets/ConfirmationWithInputModal.vue';
import { createLocalVue } from '@vue/test-utils';
import { BootstrapVue, BootstrapVueIcons } from 'bootstrap-vue';
import sinon from 'sinon';
import axios from 'axios';
import { PermissionsService } from '@/services/permissions.service.js';
import LocalStorageMock from '../helpers/localStorage.mock';
import Chance from 'chance';

describe('PlatformUsers', function() {
  const chance = new Chance();

  let wrapper;
  let getReqStub;
  let deleteReqStub;

  const user = {
    username: chance.last(),
    password: chance.word(),
    email: chance.email(),
    appId: chance.fbid(),
    invitationToken: chance.word(),
    referer: chance.last(),
    languageCode: chance.locale(),
  };

  async function mountComponent() {
    const localVue = createLocalVue();
    localVue.use(BootstrapVue);
    localVue.use(BootstrapVueIcons);

    getReqStub = sinon.stub(axios, 'get');
    getReqStub.returns(Promise.resolve({ data: user }));
    deleteReqStub = sinon.stub(axios, 'delete');
    deleteReqStub.returns(Promise.resolve({ data: user }));

    const elem = document.createElement('div');
    if (document.body) {
      document.body.appendChild(elem);
    }
    wrapper = mount(PlatformUsers, {
      localVue,
      attachTo: elem,
    });

    await wrapper.vm.$forceUpdate();
  }

  before(function() {
    global.localStorage = new LocalStorageMock();
  });

  afterEach(function() {
    wrapper.destroy();
    sinon.restore();
  });

  it('should render input field and submit button', async function() {
    await mountComponent();

    const inputField = wrapper.find('input');
    expect(inputField.exists()).to.be.true;

    const findUserButton = wrapper.find('[type="submit"]');
    expect(findUserButton.exists()).to.be.true;
  });
  it('should send get user request on form button click', async function() {
    await mountComponent();

    const inputField = wrapper.find('input');
    const findUserButton = wrapper.find('[type="submit"]');

    inputField.setValue(user.username);
    await findUserButton.trigger('click');

    sinon.assert.calledOnce(getReqStub);
    sinon.assert.calledWith(getReqStub, `/platform-users/${user.username}`);
  });
  it('should display user retrieved from request', async function() {
    await mountComponent();

    const inputField = wrapper.find('input');
    const findUserButton = wrapper.find('[type="submit"]');

    inputField.setValue(user.username);
    await findUserButton.trigger('click');

    sinon.assert.calledOnce(getReqStub);
    sinon.assert.calledWith(getReqStub, `/platform-users/${user.username}`);

    await wrapper.vm.$forceUpdate();

    const inputFields = wrapper.findAll('input');
    expect(inputFields.length).equal(1 + Object.keys(user).length);

    for (let i = 1; i < inputFields.length; i++) {
      expect(inputFields.at(i).element.id).equal(Object.keys(user)[i - 1]);
      expect(inputFields.at(i).element.name).equal(Object.keys(user)[i - 1]);
      expect(inputFields.at(i).element.disabled).to.be.true;
      expect(inputFields.at(i).element._value).equal(
        user[Object.keys(user)[i - 1]]
      );
    }
  });
  it('should display confirmation modal on delete button click', async function() {
    sinon.stub(PermissionsService, 'canDeletePlatformUsers').returns(true);

    await mountComponent();

    const inputField = wrapper.find('input');
    const findUserButton = wrapper.find('[type="submit"]');

    inputField.setValue(user.username);
    await findUserButton.trigger('click');

    await wrapper.vm.$forceUpdate();

    const deleteUserButton = wrapper.findAll('[type="submit"]').at(1);
    expect(deleteUserButton.exists()).to.be.true;

    await deleteUserButton.trigger('click');

    expect(wrapper.findComponent(ConfirmationWithInputModal).exists()).to.be
      .true;
  });
  it('should send delete user request after confirmation', async function() {
    sinon.stub(PermissionsService, 'canDeletePlatformUsers').returns(true);

    await mountComponent();

    const inputField = wrapper.find('input');
    const findUserButton = wrapper.find('[type="submit"]');

    inputField.setValue(user.username);
    await findUserButton.trigger('click');

    await wrapper.vm.$forceUpdate();

    const deleteUserButton = wrapper.findAll('[type="submit"]').at(1);

    await deleteUserButton.trigger('click');

    await wrapper
      .findComponent(ConfirmationWithInputModal)
      .find('input')
      .setValue(user.username);

    await wrapper
      .findComponent(ConfirmationWithInputModal)
      .findAll('button')
      .at(1)
      .trigger('click');

    sinon.assert.calledOnce(deleteReqStub);
    sinon.assert.calledWith(deleteReqStub, `/platform-users/${user.username}`);
  });
});

import { assert } from 'chai';
import { mount } from '@vue/test-utils';
import PlatformUsers from '@/views/PlatformUsers.vue';
import ConfirmationWithInputModal from '@/widgets/ConfirmationWithInputModal.vue';
import { createLocalVue } from '@vue/test-utils';
import { BootstrapVue, BootstrapVueIcons } from 'bootstrap-vue';
import sinon from 'sinon';
import axios from 'axios';
import { PermissionsService } from '@/services/permissions.service.js';
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

  async function mountComponent(userExists = true) {
    const localVue = createLocalVue();
    localVue.use(BootstrapVue);
    localVue.use(BootstrapVueIcons);

    getReqStub = sinon.stub(axios, 'get');
    if (userExists) {
      getReqStub.returns(Promise.resolve({ data: { user: user } }));
    } else {
      getReqStub.returns(Promise.reject({ response: { status: 404 } }));
    }

    deleteReqStub = sinon.stub(axios, 'delete');
    deleteReqStub.returns(
      Promise.resolve({
        data: {
          user: user,
        },
      })
    );

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

  afterEach(function() {
    wrapper.destroy();
    sinon.restore();
  });

  it('must render input field and submit button', async function() {
    await mountComponent();

    const inputField = wrapper.find('input');
    assert.isTrue(inputField.exists());

    const findUserButton = wrapper.find('[type="submit"]');
    assert.isTrue(findUserButton.exists());
  });
  it('must display user retrieved from request', async function() {
    await mountComponent();

    const inputField = wrapper.find('input');
    const findUserButton = wrapper.find('[type="submit"]');

    inputField.setValue(user.username);
    await findUserButton.trigger('click');

    sinon.assert.calledOnce(getReqStub);
    sinon.assert.calledWith(getReqStub, `/platform-users/${user.username}`);

    await wrapper.vm.$forceUpdate();

    const inputFields = wrapper.findAll('input');
    assert.equal(inputFields.length, Object.keys(user).length + 1);

    for (let i = 1; i < inputFields.length; i++) {
      assert.equal(inputFields.at(i).element.id, Object.keys(user)[i - 1]);
      assert.equal(inputFields.at(i).element.name, Object.keys(user)[i - 1]);
      assert.isTrue(inputFields.at(i).element.disabled);
      assert.equal(
        inputFields.at(i).element._value,
        user[Object.keys(user)[i - 1]]
      );
    }
  });
  it('must display an error when the user does not exist', async () => {
    await mountComponent(false);

    const inputField = wrapper.find('input');
    const findUserButton = wrapper.find('[type="submit"]');
    inputField.setValue(user.username);
    await findUserButton.trigger('click');
    sinon.assert.calledOnce(getReqStub);
    sinon.assert.calledWith(getReqStub, `/platform-users/${user.username}`);
    await wrapper.vm.$forceUpdate();

    const cards = wrapper.findAll('[class="failure-msg"]');
    assert.equal(cards.length, 1);
    assert.equal(cards.at(0).text(), 'User not found');
  });
  it('must not display the delete button if not allowed', async () => {
    sinon.stub(PermissionsService, 'canDeletePlatformUsers').returns(false);
    await mountComponent();

    const inputField = wrapper.find('input');
    const findUserButton = wrapper.find('[type="submit"]');

    inputField.setValue(user.username);
    await findUserButton.trigger('click');

    sinon.assert.calledOnce(getReqStub);
    sinon.assert.calledWith(getReqStub, `/platform-users/${user.username}`);

    await wrapper.vm.$forceUpdate();

    const buttons = wrapper.findAll('[type="submit"]');
    assert.equal(buttons.length, 1);
  });
  it('must display confirmation modal on delete button click', async function() {
    sinon.stub(PermissionsService, 'canDeletePlatformUsers').returns(true);

    await mountComponent();

    const inputField = wrapper.find('input');
    const findUserButton = wrapper.find('[type="submit"]');

    inputField.setValue(user.username);
    await findUserButton.trigger('click');

    await wrapper.vm.$forceUpdate();

    const buttons = wrapper.findAll('[type="submit"]');
    assert.equal(buttons.length, 2);
    const deleteUserButton = buttons.at(1);
    assert.isTrue(deleteUserButton.exists());

    await deleteUserButton.trigger('click');

    assert.isTrue(wrapper.findComponent(ConfirmationWithInputModal).exists());
  });
  it('must send delete user request after confirmation', async function() {
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

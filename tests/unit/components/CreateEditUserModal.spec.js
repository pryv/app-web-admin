import { expect } from 'chai';
import { mount } from '@vue/test-utils';
import CreateEditUserModal from '@/components/CreateEditUserModal.vue';
import { createLocalVue } from '@vue/test-utils';
import { BootstrapVue, BootstrapVueIcons } from 'bootstrap-vue';
import sinon from 'sinon';
import axios from 'axios';
import { PermissionsService } from '@/services/permissions.service.js';
import ConfirmationModal from '@/widgets/ConfirmationModal.vue';
import Chance from 'chance';

describe('CreateEditUserModal', function() {
  const chance = new Chance();

  const username = chance.name();
  const password = chance.word();
  const permissions = {
    users: ['read', 'create'],
    settings: ['read'],
  };

  afterEach(function() {
    sinon.restore();
  });

  describe('Create user format', function() {
    let wrapper;

    before(function() {
      const elem = document.createElement('div');
      if (document.body) {
        document.body.appendChild(elem);
      }

      const localVue = createLocalVue();
      localVue.use(BootstrapVue);
      localVue.use(BootstrapVueIcons);

      wrapper = mount(CreateEditUserModal, {
        localVue,
        attachTo: elem,
        propsData: {
          create: true,
          permissions: permissions,
        },
      });
    });
    after(function() {
      wrapper.destroy();
    });

    it('should render editable username input field', function() {
      const inputFields = wrapper.findAll('input');
      expect(inputFields.at(0).element.id).equal('username');
      expect(inputFields.at(0).element.name).equal('username');
      expect(inputFields.at(0).element.placeholder).equal('Username');
      expect(inputFields.at(0).element.disabled).to.be.false;
    });
    it('should render editable password input field', function() {
      const inputFields = wrapper.findAll('input');
      expect(inputFields.at(1).element.id).equal('password');
      expect(inputFields.at(1).element.name).equal('password');
      expect(inputFields.at(1).element.placeholder).equal('Password');
      expect(inputFields.at(1).element.disabled).to.be.false;
    });
    it('should render editable table with permissions', function() {
      const checkBoxes = wrapper.findAll('[type="checkbox"]');
      expect(checkBoxes).length(9);
      for (let i = 0; i < checkBoxes.length; i++) {
        expect(checkBoxes.at(i).element.disabled).to.be.false;
      }
    });
    it('should render save, cancel and close buttons', function() {
      const buttons = wrapper.findAll('button');
      expect(buttons.length).equal(2);

      const closeButton = wrapper.findAll('[class="close-button"]');
      expect(closeButton).to.be.ok;

      expect(buttons.at(0).text()).equal('Save');
      expect(buttons.at(1).text()).equal('Cancel');
    });
    it('should emit close event on cancel button click', function() {
      wrapper
        .findAll('button')
        .at(1)
        .trigger('click');

      expect(wrapper.emitted().close[0]).to.be.ok;
    });
    it('should emit close event on close button click', function() {
      wrapper.findAll('[class="close-button"]').trigger('click');
      expect(wrapper.emitted().close[0]).to.be.ok;
    });
    it('should send user create request on save button click', async function() {
      const postReqStub = sinon.stub(axios, 'post');
      postReqStub.returns(Promise.resolve(true));

      const inputFields = wrapper.findAll('input');

      inputFields.at(0).setValue(username);
      inputFields.at(1).setValue(password);

      await wrapper
        .findAll('button')
        .at(0)
        .trigger('click');

      sinon.assert.calledOnce(postReqStub);
      sinon.assert.calledWith(postReqStub, '/users', {
        username: username,
        password: password,
        permissions: permissions,
      });
    });
  });

  describe('Edit user format', function() {
    let wrapper;

    before(function() {
      const elem = document.createElement('div');
      if (document.body) {
        document.body.appendChild(elem);
      }

      const localVue = createLocalVue();
      localVue.use(BootstrapVue);
      localVue.use(BootstrapVueIcons);

      sinon.stub(PermissionsService, 'canChangePermissions').returns(true);
      sinon.stub(PermissionsService, 'canResetPassword').returns(true);
      sinon.stub(PermissionsService, 'canDeleteUsers').returns(true);

      wrapper = mount(CreateEditUserModal, {
        localVue,
        attachTo: elem,
        propsData: {
          username: username,
          edit: true,
          permissions: permissions,
        },
      });
    });
    after(function() {
      wrapper.destroy();
    });

    it('should render not-editable username input field', function() {
      const inputFields = wrapper.findAll('input');
      expect(inputFields.at(0).element.id).equal('username');
      expect(inputFields.at(0).element.name).equal('username');
      expect(inputFields.at(0).element.placeholder).equal('Username');
      expect(inputFields.at(0).element.disabled).to.be.true;
    });
    it('should not render password input field', function() {
      const passwordInputField = wrapper.find('[id="password"]');
      expect(passwordInputField.exists()).to.be.false;
    });
    it('should render editable table with permissions', function() {
      const checkBoxes = wrapper.findAll('[type="checkbox"]');
      expect(checkBoxes).length(9);
      for (let i = 0; i < checkBoxes.length; i++) {
        expect(checkBoxes.at(i).element.disabled).to.be.false;
      }
    });
    it('should render save, cancel, close, delete and reset password buttons', function() {
      const buttons = wrapper.findAll('button');
      expect(buttons.length).equal(4);

      const closeButton = wrapper.findAll('[class="close-button"]');
      expect(closeButton).to.be.ok;

      expect(buttons.at(0).text()).equal('Save');
      expect(buttons.at(1).text()).equal('Cancel');
      expect(buttons.at(2).text()).equal('Reset password');
      expect(buttons.at(3).text()).equal('Delete');
    });
    it('should send change permissions request on save button click', async function() {
      const putReqStub = sinon.stub(axios, 'put');
      putReqStub.returns(Promise.resolve(true));

      await wrapper
        .findAll('button')
        .at(0)
        .trigger('click');

      sinon.assert.calledOnce(putReqStub);
      sinon.assert.calledWith(putReqStub, `/users/${username}/permissions`, {
        permissions: permissions,
      });
    });
    it('should render confirmation modal on reset password button click', async function() {
      await wrapper
        .findAll('button')
        .at(2)
        .trigger('click');

      expect(wrapper.findComponent(ConfirmationModal).exists()).to.be.true;
    });
    it('should render confirmation modal on delete button click', async function() {
      await wrapper
        .findAll('button')
        .at(3)
        .trigger('click');

      expect(wrapper.findComponent(ConfirmationModal).exists()).to.be.true;
    });
    it('should send reset password request after confirmation', async function() {
      const postReqStub = sinon.stub(axios, 'post');
      postReqStub.returns(Promise.resolve(true));

      await wrapper
        .findAll('button')
        .at(2)
        .trigger('click');

      await wrapper
        .findComponent(ConfirmationModal)
        .findAll('button')
        .at(1)
        .trigger('click');

      sinon.assert.calledOnce(postReqStub);
      sinon.assert.calledWith(postReqStub, `/users/${username}/reset-password`);
    });
    it('should send delete request after confirmation', async function() {
      const deleteReqStub = sinon.stub(axios, 'delete');
      deleteReqStub.returns(Promise.resolve(true));

      await wrapper
        .findAll('button')
        .at(3)
        .trigger('click');

      await wrapper
        .findComponent(ConfirmationModal)
        .findAll('button')
        .at(1)
        .trigger('click');

      sinon.assert.calledOnce(deleteReqStub);
      sinon.assert.calledWith(deleteReqStub, `/users/${username}`);
    });
  });
});

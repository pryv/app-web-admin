import { expect } from 'chai';
import { mount } from '@vue/test-utils';
import PasswordChangeModal from '@/components/PasswordChangeModal.vue';
import { createLocalVue } from '@vue/test-utils';
import { BootstrapVue, BootstrapVueIcons } from 'bootstrap-vue';
import LocalStorageMock from '../helpers/localStorage.mock';
import { sign } from 'jsonwebtoken';
import sinon from 'sinon';
import axios from 'axios';
import Chance from 'chance';

const chance = new Chance();

const username = chance.name();
const token = sign({ username: username }, chance.word(), { expiresIn: '24h' });

let wrapper;
let inputFields;

let postReqStub;

describe('PasswordChangeModal', () => {
  before(function() {
    global.localStorage = new LocalStorageMock();
    global.localStorage.setItem('token', token);

    const localVue = createLocalVue();
    localVue.use(BootstrapVue);
    localVue.use(BootstrapVueIcons);

    const elem = document.createElement('div');
    if (document.body) {
      document.body.appendChild(elem);
    }
    wrapper = mount(PasswordChangeModal, {
      localVue,
      attachTo: elem,
    });

    postReqStub = sinon.stub(axios, 'post');
  });

  after(function() {
    postReqStub.restore();
    wrapper.destroy();
  });

  it('should render password change fields', function() {
    inputFields = wrapper.findAll('input');

    expect(inputFields.length).equal(3);
  });

  it('should send change password request with data from form on save button click', function() {
    postReqStub.returns(Promise.resolve(true));

    const oldPass = 'old_pass';
    const newPass = 'new_pass';

    inputFields.at(0).setValue(oldPass);
    inputFields.at(1).setValue(newPass);
    inputFields.at(2).setValue(newPass);

    wrapper.find('[type="submit"]').trigger('click');

    sinon.assert.calledOnce(postReqStub);
    sinon.assert.calledWith(postReqStub, `/users/${username}/change-password`, {
      oldPassword: oldPass,
      newPassword: newPass,
      newPasswordCheck: newPass,
    });
  });

  it('should emit close event on cancel button click', function() {
    wrapper.find('[type="button"]').trigger('click');

    expect(wrapper.emitted().close).to.be.ok;
  });
});

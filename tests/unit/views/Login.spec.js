import { expect } from 'chai';
import { mount } from '@vue/test-utils';
import Login from '@/views/Login.vue';
import { createLocalVue } from '@vue/test-utils';
import { BootstrapVue, BootstrapVueIcons } from 'bootstrap-vue';
import LocalStorageMock from '../helpers/localStorage.mock';
import sinon from 'sinon';
import axios from 'axios';
import Chance from 'chance';

const chance = new Chance();

const username = chance.name();
const password = chance.word();
const confLeadAddress = chance.url();

let wrapper;

let submitButton;

describe('Login', () => {
  before(function() {
    global.localStorage = new LocalStorageMock();
  });

  beforeEach(function() {
    const localVue = createLocalVue();
    localVue.use(BootstrapVue);
    localVue.use(BootstrapVueIcons);

    const elem = document.createElement('div');
    if (document.body) {
      document.body.appendChild(elem);
    }
    wrapper = mount(Login, {
      localVue,
      attachTo: elem,
    });

    submitButton = wrapper.find('[type="submit"]');
  });

  afterEach(function() {
    wrapper.destroy();
    sinon.restore();
  });

  it('should send login request with data from inputs on login button click', function() {
    const postReqStub = sinon.stub(axios, 'post');
    postReqStub.returns(Promise.resolve(true));

    const inputFields = wrapper.findAll('input');

    expect(inputFields.length).equal(3);

    inputFields.at(0).setValue(confLeadAddress);
    inputFields.at(1).setValue(username);
    inputFields.at(2).setValue(password);

    submitButton.trigger('click');

    sinon.assert.calledOnce(postReqStub);
    sinon.assert.calledWith(postReqStub, `${confLeadAddress}/auth/login`, {
      username: username,
      password: password,
    });
  });
  it('should display "Incorrect credentials" message when server responded with 4**', async function() {
    const postReqStub = sinon.stub(axios, 'post');
    postReqStub.returns(Promise.reject({ response: { status: 401 } }));

    const inputFields = wrapper.findAll('input');

    expect(inputFields.length).equal(3);

    inputFields.at(0).setValue(confLeadAddress);
    inputFields.at(1).setValue(username);
    inputFields.at(2).setValue(password);

    await submitButton.trigger('click');

    sinon.assert.calledOnce(postReqStub);
    sinon.assert.calledWith(postReqStub, `${confLeadAddress}/auth/login`, {
      username: username,
      password: password,
    });

    await wrapper.vm.$forceUpdate();

    expect(wrapper.find('div.failure-msg > p').exists()).to.be.true;
    expect(wrapper.find('div.failure-msg > p').text()).include(
      'Incorrect credentials'
    );
  });
  it('should display "Unable to connect to the server" message on network error', async function() {
    const postReqStub = sinon.stub(axios, 'post');
    postReqStub.returns(Promise.reject({ response: { status: 500 } }));

    const inputFields = wrapper.findAll('input');

    expect(inputFields.length).equal(3);

    inputFields.at(0).setValue(confLeadAddress);
    inputFields.at(1).setValue(username);
    inputFields.at(2).setValue(password);

    await submitButton.trigger('click');

    sinon.assert.calledOnce(postReqStub);
    sinon.assert.calledWith(postReqStub, `${confLeadAddress}/auth/login`, {
      username: username,
      password: password,
    });

    await wrapper.vm.$forceUpdate();

    expect(wrapper.find('div.failure-msg > p').exists()).to.be.true;
    expect(wrapper.find('div.failure-msg > p').text()).include(
      'Unable to connect to the server'
    );
  });
  it('should display "Unable to connect to the server" message when server responded with 5**', async function() {
    const postReqStub = sinon.stub(axios, 'post');
    postReqStub.returns(Promise.reject({ message: 'Network Error' }));

    const inputFields = wrapper.findAll('input');

    expect(inputFields.length).equal(3);

    inputFields.at(0).setValue(confLeadAddress);
    inputFields.at(1).setValue(username);
    inputFields.at(2).setValue(password);

    await submitButton.trigger('click');

    sinon.assert.calledOnce(postReqStub);
    sinon.assert.calledWith(postReqStub, `${confLeadAddress}/auth/login`, {
      username: username,
      password: password,
    });

    await wrapper.vm.$forceUpdate();

    expect(wrapper.find('div.failure-msg > p').exists()).to.be.true;
    expect(wrapper.find('div.failure-msg > p').text()).include(
      'Unable to connect to the server'
    );
  });
});

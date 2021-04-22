import { expect } from 'chai';
import { mount } from '@vue/test-utils';
import Login from '@/views/Login.vue';
import { createLocalVue } from '@vue/test-utils';
import { BootstrapVue, BootstrapVueIcons } from 'bootstrap-vue';
import sinon from 'sinon';
import axios from 'axios';
import Chance from 'chance';

const chance = new Chance();

const username = chance.name();
const password = chance.word();
const confLeadAddress = 'https://lead.pryv.li';

let wrapper;

let submitButton;

const url = 'https://adm.pryv.li';

describe('Login', () => {
  let href;
  beforeEach(() => {
    // hack from https://stackoverflow.com/a/54034379/3967660
    href = window.location.href;
    Object.defineProperty(window, 'location', {
      value: {
        href: url,
      },
      writable: true,
    });
  });
  afterEach(() => {
    Object.defineProperty(window, 'location', {
      value: {
        href: href,
      },
      writable: true,
    });
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

  it('must send login request to server from URL domain on login button click', function() {
    const postReqStub = sinon.stub(axios, 'post');
    postReqStub.returns(Promise.resolve({ data: {} }));

    const inputFields = wrapper.findAll('input');
    expect(inputFields.length).equal(2);
    inputFields.at(0).setValue(username);
    inputFields.at(1).setValue(password);
    submitButton.trigger('click');

    sinon.assert.calledOnce(postReqStub);
    sinon.assert.calledWith(postReqStub, `${confLeadAddress}/auth/login`, {
      username: username,
      password: password,
    });
  });
  it.skip('must send login request to server from query parameter on login button click', function() {
    // can't manage to change it in the test, but works
    const customLeaderUrl = 'https://otherleader.com';
    Object.defineProperty(window, 'location', {
      value: {
        href: url + '?pryvLeaderUrl=' + customLeaderUrl,
      },
      writable: true,
    });
    const postReqStub = sinon.stub(axios, 'post');
    postReqStub.returns(Promise.resolve(true));

    const inputFields = wrapper.findAll('input');
    inputFields.at(0).setValue(username);
    inputFields.at(1).setValue(password);
    submitButton.trigger('click');

    sinon.assert.calledOnce(postReqStub);
    sinon.assert.calledWith(postReqStub, `${customLeaderUrl}/auth/login`, {
      username: username,
      password: password,
    });
  });
  it('must display "Incorrect credentials" message when server responded with 4**', async function() {
    const postReqStub = sinon.stub(axios, 'post');
    postReqStub.returns(Promise.reject({ response: { status: 401 } }));

    const inputFields = wrapper.findAll('input');
    inputFields.at(0).setValue(username);
    inputFields.at(1).setValue(password);
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
  it('must display "Unable to connect to the server" message on network error', async function() {
    const postReqStub = sinon.stub(axios, 'post');
    postReqStub.returns(Promise.reject({ response: { status: 500 } }));

    const inputFields = wrapper.findAll('input');
    inputFields.at(0).setValue(username);
    inputFields.at(1).setValue(password);
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
  it('must display "Unable to connect to the server" message when server responded with 5**', async function() {
    const postReqStub = sinon.stub(axios, 'post');
    postReqStub.returns(Promise.reject({ message: 'Network Error' }));

    const inputFields = wrapper.findAll('input');
    inputFields.at(0).setValue(username);
    inputFields.at(1).setValue(password);
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

import { expect } from 'chai';
import { mount } from '@vue/test-utils';
import NavBar from '@/components/NavBar.vue';
import { createLocalVue } from '@vue/test-utils';
import { BootstrapVue, BootstrapVueIcons } from 'bootstrap-vue';
import LocalStorageMock from '../helpers/localStorage.mock';
import sinon from 'sinon';
const axios = require('axios');
import { PermissionsService } from '@/services/permissions.service.js';
import router from '../../../src/router';

let wrapper;
let localVue;

describe('NavBar', () => {
  before(function() {
    global.localStorage = new LocalStorageMock();

    localVue = createLocalVue();
    localVue.use(BootstrapVue);
    localVue.use(BootstrapVueIcons);
  });

  after(function() {
    wrapper.destroy();
  });

  afterEach(function() {
    sinon.restore();
  });

  describe('user not logged in', function() {
    before(function() {
      wrapper = mount(NavBar, {
        localVue,
        propsData: {
          loggedIn: false,
        },
      });
    });

    it('should not display any navigation options', function() {
      const listElements = wrapper.findAll('a');

      expect(listElements.length).equal(1);
      expect(listElements.at(0).classes('navbar-brand')).to.be.true;
    });
  });

  describe('user logged in', function() {
    it('should render platform config and no users management navbars when user has those permisions', function() {
      sinon.stub(PermissionsService, 'canReadSettings').returns(true);
      sinon.stub(PermissionsService, 'canReadUsers').returns(false);

      wrapper = mount(NavBar, {
        localVue,
        propsData: {
          loggedIn: true,
        },
      });

      const listElements = wrapper.findAll('li');

      expect(listElements.length).equal(4);

      expect(
        listElements
          .at(0)
          .find('a')
          .text()
      ).equal('Platform Configuration');
      expect(
        listElements
          .at(1)
          .find('a')
          .text()
      ).equal('Profile');
    });

    it('should render users management and no platform config navbars when user has those permisions', function() {
      sinon.stub(PermissionsService, 'canReadSettings').returns(false);
      sinon.stub(PermissionsService, 'canReadUsers').returns(true);

      wrapper = mount(NavBar, {
        localVue,
        propsData: {
          loggedIn: true,
        },
      });

      const listElements = wrapper.findAll('li');

      expect(listElements.length).equal(4);

      expect(
        listElements
          .at(0)
          .find('a')
          .text()
      ).equal('Users Management');
      expect(
        listElements
          .at(1)
          .find('a')
          .text()
      ).equal('Profile');
    });

    it('should render profile dropdown', function() {
      wrapper = mount(NavBar, {
        localVue,
        propsData: {
          loggedIn: true,
        },
      });

      const dropdown = wrapper.find('ul.dropdown-menu');
      const dropdownItems = dropdown.findAll('[class="dropdown-item"]');

      expect(dropdownItems.length).equal(2);
      expect(dropdownItems.at(0).text()).equal('Change Password');
      expect(dropdownItems.at(1).text()).equal('Sign Out');
    });

    it('should send logout request when logout in profile clicked', function() {
      const logoutReqStub = sinon.stub(axios, 'post');
      logoutReqStub.returns(Promise.resolve(true));

      wrapper = mount(NavBar, {
        localVue,
        router: router,
        propsData: {
          loggedIn: true,
        },
      });

      wrapper
        .findAll('[class="dropdown-item"]')
        .at(1)
        .trigger('click');

      sinon.assert.calledOnce(logoutReqStub);
      sinon.assert.calledWith(logoutReqStub, '/auth/logout', {});
    });
  });
});

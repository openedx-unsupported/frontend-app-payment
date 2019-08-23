/* eslint-disable global-require */
import React from 'react';
import renderer, { act } from 'react-test-renderer';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import { Factory } from 'rosie';
import { IntlProvider, configure as configureI18n } from '@edx/frontend-i18n';
import * as analytics from '@edx/frontend-analytics';
import { fetchUserAccountSuccess } from '@edx/frontend-auth';

import './__factories__/basket.factory';
import '../__factories__/configuration.factory';
import '../__factories__/userAccount.factory';
import { ConnectedPaymentPage } from './';
import { configuration } from '../environment';
import messages from '../i18n';
import createRootReducer from '../data/reducers';
import { fetchBasket, basketDataReceived } from './data/actions';
import { transformResults } from './data/service';
import { ENROLLMENT_CODE_PRODUCT_TYPE } from './cart/order-details';
import { MESSAGE_TYPES, addMessage } from '../feedback';

const requirePaymentPageProps = {
  fetchBasket: () => {},
};

// Mock language cookie
Object.defineProperty(global.document, 'cookie', {
  writable: true,
  value: `${configuration.LANGUAGE_PREFERENCE_COOKIE_NAME}=en`,
});

configureI18n(configuration, messages);

describe('<PaymentPage />', () => {
  let initialState;
  let store;

  beforeEach(() => {
    const userAccount = Factory.build('userAccount');
    initialState = {
      configuration: Factory.build('configuration'),
      authentication: {
        userId: 9,
        username: userAccount.username,
      },
    };

    store = createStore(createRootReducer(), initialState);
    store.dispatch(fetchUserAccountSuccess(userAccount));
  });

  describe('Renders correctly in various states', () => {
    beforeEach(() => {
      analytics.sendTrackingLogEvent = jest.fn();
    });

    it('should render its default (loading) state', () => {
      const component = (
        <IntlProvider locale="en">
          <Provider store={store}>
            <ConnectedPaymentPage {...requirePaymentPageProps} />
          </Provider>
        </IntlProvider>
      );

      const tree = renderer.create(component);
      expect(tree.toJSON()).toMatchSnapshot();
    });

    it('should render the basket', () => {
      const component = (
        <IntlProvider locale="en">
          <Provider store={store}>
            <ConnectedPaymentPage {...requirePaymentPageProps} />
          </Provider>
        </IntlProvider>
      );
      const tree = renderer.create(component);
      act(() => {
        store.dispatch(basketDataReceived(transformResults(Factory.build('basket', {}, { numProducts: 1 }))));
        store.dispatch(fetchBasket.fulfill());
      });
      expect(tree.toJSON()).toMatchSnapshot();
    });

    it('should render the basket in a different currency', () => {
      store = createStore(
        createRootReducer(),
        Object.assign({}, initialState, {
          payment: {
            currency: {
              currencyCode: 'MXN',
              conversionRate: 19.092733,
            },
          },
        }),
      );
      const component = (
        <IntlProvider locale="en">
          <Provider store={store}>
            <ConnectedPaymentPage {...requirePaymentPageProps} />
          </Provider>
        </IntlProvider>
      );
      const tree = renderer.create(component);
      act(() => {
        store.dispatch(basketDataReceived(transformResults(Factory.build('basket', {}, { numProducts: 1 }))));
        store.dispatch(fetchBasket.fulfill());
      });
      expect(tree.toJSON()).toMatchSnapshot();
    });

    it('should render the basket with an enterprise offer', () => {
      const component = (
        <IntlProvider locale="en">
          <Provider store={store}>
            <ConnectedPaymentPage {...requirePaymentPageProps} />
          </Provider>
        </IntlProvider>
      );
      const tree = renderer.create(component);
      act(() => {
        store.dispatch(basketDataReceived(transformResults(Factory.build(
          'basket',
          {
            offers: [
              {
                benefitValue: 50,
                benefitType: 'Percentage',
                provider: 'Pied Piper',
              },
            ],
          },
          { numProducts: 1 },
        ))));
        store.dispatch(fetchBasket.fulfill());
      });

      expect(tree.toJSON()).toMatchSnapshot();
    });

    it('should render the basket for a bulk order', () => {
      const component = (
        <IntlProvider locale="en">
          <Provider store={store}>
            <ConnectedPaymentPage {...requirePaymentPageProps} />
          </Provider>
        </IntlProvider>
      );

      const tree = renderer.create(component);
      act(() => {
        store.dispatch(basketDataReceived(transformResults(Factory.build(
          'basket',
          {},
          { numProducts: 1, productType: ENROLLMENT_CODE_PRODUCT_TYPE },
        ))));
        store.dispatch(fetchBasket.fulfill());
      });
      expect(tree.toJSON()).toMatchSnapshot();
    });

    it('should render an empty basket', () => {
      const component = (
        <IntlProvider locale="en">
          <Provider store={store}>
            <ConnectedPaymentPage {...requirePaymentPageProps} />
          </Provider>
        </IntlProvider>
      );
      const tree = renderer.create(component);
      act(() => {
        store.dispatch(basketDataReceived(transformResults(Factory.build('basket', {}, { numProducts: 0 }))));
        store.dispatch(fetchBasket.fulfill());
      });
      expect(tree.toJSON()).toMatchSnapshot();
    });

    it('should render a redirect spinner', () => {
      const component = (
        <IntlProvider locale="en">
          <Provider store={store}>
            <ConnectedPaymentPage {...requirePaymentPageProps} />
          </Provider>
        </IntlProvider>
      );
      const tree = renderer.create(component);
      act(() => {
        store.dispatch(basketDataReceived(transformResults(Factory.build(
          'basket',
          {
            redirect: 'http://localhost/boo',
          },
          { numProducts: 1 },
        ))));
        store.dispatch(fetchBasket.fulfill());
      });
      expect(tree.toJSON()).toMatchSnapshot();
    });

    it('should render a free basket', () => {
      const component = (
        <IntlProvider locale="en">
          <Provider store={store}>
            <ConnectedPaymentPage {...requirePaymentPageProps} />
          </Provider>
        </IntlProvider>
      );
      const tree = renderer.create(component);
      act(() => {
        store.dispatch(basketDataReceived(transformResults(Factory.build(
          'basket',
          {
            is_free_basket: true,
          },
          { numProducts: 1 },
        ))));
        store.dispatch(fetchBasket.fulfill());
      });
      expect(tree.toJSON()).toMatchSnapshot();
    });

    it('should render all custom alert messages', () => {
      const component = (
        <IntlProvider locale="en">
          <Provider store={store}>
            <ConnectedPaymentPage {...requirePaymentPageProps} />
          </Provider>
        </IntlProvider>
      );
      const tree = renderer.create(component);
      act(() => {
        store.dispatch(basketDataReceived(transformResults(Factory.build(
          'basket',
          {
          },
          { numProducts: 1 },
        ))));
        store.dispatch(addMessage(null, "Coupon code 'HAPPY' added to basket.", null, MESSAGE_TYPES.INFO));
        store.dispatch(addMessage('single-enrollment-code-warning', null, {
          courseAboutUrl: 'http://edx.org/about_ze_course',
        }, MESSAGE_TYPES.INFO));
        store.dispatch(fetchBasket.fulfill());
      });
      expect(tree.toJSON()).toMatchSnapshot();
    });
  });
});

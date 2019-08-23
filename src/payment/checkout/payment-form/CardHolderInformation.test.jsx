/* eslint-disable global-require */
import React from 'react';
import { Provider } from 'react-redux';
import { mount } from 'enzyme';
import { IntlProvider, configure as configureI18n } from '@edx/frontend-i18n';
import { Factory } from 'rosie';
import { fetchUserAccountSuccess } from '@edx/frontend-auth';
import { createStore } from 'redux';

import { configuration } from '../../../environment';
import messages from '../../../i18n';
import CardHolderInformation, { CardHolderInformationComponent } from './CardHolderInformation';
import PaymentForm from './PaymentForm';
import '../../../__factories__/configuration.factory';
import createRootReducer from '../../../data/reducers';

import '../../../__factories__/userAccount.factory';

configureI18n(configuration, messages);

describe('<CardHolderInformation />', () => {
  let initialState;
  let store;

  describe('handleSelectCountry', () => {
    it('updates state with selected country', () => {
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
      const component = (
        <IntlProvider locale="en">
          <Provider store={store}>
            <PaymentForm onSubmitPayment={() => {}} onSubmitButtonClick={() => {}}>
              <CardHolderInformation />
            </PaymentForm>
          </Provider>
        </IntlProvider>
      );
      const wrapper = mount(component);
      const cardHolderInformation = wrapper
        .find(CardHolderInformationComponent)
        .first()
        .instance();
      const eventMock = jest.fn();

      cardHolderInformation.handleSelectCountry(eventMock, 'US');

      expect(cardHolderInformation.state).toEqual({ selectedCountry: 'US' });
    });
  });
});

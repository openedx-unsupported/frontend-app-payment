import React from 'react';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import renderer, { act } from 'react-test-renderer';
import { IntlProvider } from '@edx/frontend-platform/i18n';

import ConnectedAlertList from './AlertList';
import createRootReducer from '../data/reducers';
import { addMessage } from './data/actions';
import { MESSAGE_TYPES } from './data/constants';

jest.mock('@edx/frontend-platform/logging', () => ({
  logError: jest.fn(),
}));

describe('AlertList', () => {
  let store;

  beforeEach(() => {
    store = createStore(createRootReducer());
  });

  it('should be null by default', () => {
    const component = (
      <IntlProvider locale="en">
        <Provider store={store}>
          <ConnectedAlertList removeMessage={jest.fn()} />
        </Provider>
      </IntlProvider>
    );
    const tree = renderer.create(component).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('should render messages of each type', () => {
    const component = (
      <IntlProvider locale="en">
        <Provider store={store}>
          <ConnectedAlertList
            messageCodes={{
              boo: 'Boo indeed!',
              gah_error: 'Gah!  An error!',
            }}
            removeMessage={jest.fn()}
          />
        </Provider>
      </IntlProvider>
    );
    const tree = renderer.create(component);
    act(() => {
      store.dispatch(addMessage('boo', null, { needed: 'data' }, MESSAGE_TYPES.WARNING));
      store.dispatch(addMessage('bah', 'Bah!', null, MESSAGE_TYPES.INFO));
      store.dispatch(addMessage(null, 'Meh!', { needed: 'data' }, MESSAGE_TYPES.SUCCESS));
      store.dispatch(addMessage('gah_error', null, { needed: 'data' }, MESSAGE_TYPES.ERROR, 'gah'));
      store.dispatch(addMessage(null, 'Debug debug', null, MESSAGE_TYPES.DEBUG));
      store.dispatch(addMessage('fallback-error', null, null, MESSAGE_TYPES.ERROR));
    });
    expect(tree.toJSON()).toMatchSnapshot();
  });
});

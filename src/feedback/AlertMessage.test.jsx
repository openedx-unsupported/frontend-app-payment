import React from 'react';
import { mount } from 'enzyme';
import renderer from 'react-test-renderer';
import { IntlProvider } from '@edx/frontend-platform/i18n';

import AlertMessage from './AlertMessage';
import { MESSAGE_TYPES } from './data/constants';

describe('AlertMessage', () => {
  // The AlertList test covers most of AlertMessage testing.

  it('should handle closing', () => {
    const closeHandlerMock = jest.fn();

    const component = (
      <IntlProvider locale="en">
        <AlertMessage
          id={123}
          messageType={MESSAGE_TYPES.ERROR}
          userMessage="Wondrous message!"
          closeHandler={closeHandlerMock}
        />
      </IntlProvider>
    );

    const wrapper = mount(component);
    wrapper.find('.btn').simulate('click');

    expect(closeHandlerMock).toHaveBeenCalledWith(123);
  });

  it('should default its severity when necessary', () => {
    const closeHandlerMock = jest.fn();

    const component = (
      <IntlProvider locale="en">
        <AlertMessage
          id={123}
          messageType="unknown"
          userMessage="Wondrous message!"
          closeHandler={closeHandlerMock}
        />
      </IntlProvider>
    );

    const tree = renderer.create(component).toJSON();
    // The alert should have an 'alert-warning' class.  That's the default in the code.
    expect(tree).toMatchSnapshot();
  });

  it('should render a userMessage function', () => {
    const component = (
      <IntlProvider locale="en">
        <AlertMessage
          id={123}
          userMessage={() => 'Wondrous message!'}
          closeHandler={jest.fn()}
        />
      </IntlProvider>
    );

    const tree = renderer.create(component).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('should render a userMessage element', () => {
    const component = (
      <IntlProvider locale="en">
        <AlertMessage
          id={123}
          userMessage={<span>Wondrous message!</span>}
          closeHandler={jest.fn()}
        />
      </IntlProvider>
    );

    const tree = renderer.create(component).toJSON();
    expect(tree).toMatchSnapshot();
  });
});

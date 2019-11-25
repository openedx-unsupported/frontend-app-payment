import { getAuthenticatedHttpClient } from '@edx/frontend-platform/auth';
import { getConfig } from '@edx/frontend-platform';
import MockAdapter from 'axios-mock-adapter';
import axios from 'axios';
import { logError } from '@edx/frontend-platform/logging';

import { checkout, normalizeFieldErrors } from './service';
import { generateAndSubmitForm } from '../../data/utils';

jest.mock('../../data/utils', () => ({
  generateAndSubmitForm: jest.fn(),
}));

jest.mock('@edx/frontend-platform/logging', () => ({
  logError: jest.fn(),
}));

jest.mock('@edx/frontend-platform/auth');

const axiosMock = new MockAdapter(axios);
getAuthenticatedHttpClient.mockReturnValue(axios);

const SDN_URL = `${getConfig().ECOMMERCE_BASE_URL}/api/v2/sdn/search/`;
const CYBERSOURCE_API = `${getConfig().ECOMMERCE_BASE_URL}/payment/cybersource/api-submit/`;

beforeEach(() => {
  axiosMock.reset();
  logError.mockReset();
});

describe('Cybersource Service', () => {
  const basket = { basketId: 1, discountJwt: 'i_am_a_jwt' };
  const formDetails = {
    cardHolderInfo: {
      firstName: 'Yo',
      lastName: 'Yoyo',
      address: 'Green ln',
      unit: '#1',
      city: 'City',
      country: 'Everyland',
      postalCode: '24631',
      organization: 'skunkworks',
    },
    cardDetails: {
      cardNumber: '4111-1111-1111-1111 ',
      cardTypeId: 'VISA??',
      securityCode: '123',
      cardExpirationMonth: '10',
      cardExpirationYear: '2022',
    },
  };
  const cardValues = Object.values(formDetails.cardDetails);

  describe('normalizeCheckoutErrors', () => {
    it('should return fieldErrors if fieldErrors is not an object', () => {
      let result = normalizeFieldErrors(undefined);
      expect(result).toBeUndefined();

      result = normalizeFieldErrors(null);
      expect(result).toBeNull();

      result = normalizeFieldErrors('boo');
      expect(result).toEqual('boo');

      result = normalizeFieldErrors([]);
      expect(result).toEqual([]);

      result = normalizeFieldErrors(123);
      expect(result).toEqual(123);
    });

    it('should return an empty object if given an empty object', () => {
      const result = normalizeFieldErrors({});
      expect(result).toEqual({});
    });

    it('should return a normalized field_errors object', () => {
      const result = normalizeFieldErrors({
        field_name: 'Error message.',
        other_field_name: 'Other error message.',
      });
      expect(result).toEqual({
        field_name: { user_message: 'Error message.', error_code: null },
        other_field_name: { user_message: 'Other error message.', error_code: null },
      });
    });
  });

  describe('checkout', () => {
    beforeEach(() => {
      // Clear all instances and calls to constructor and all methods:
      Object.values(generateAndSubmitForm).map(handler => handler.mockClear);
    });

    const expectNoCardDataToBePresent = (value) => {
      if (typeof value === 'object') {
        Object.values(value).forEach(expectNoCardDataToBePresent);
      } else {
        expect(cardValues.includes(value)).toBe(false);
      }
    };

    it('should generate and submit a form on success', async () => {
      const successResponseData = {
        form_fields: {
          allThe: 'all the form fields form cybersource',
        },
      };
      const sdnResponseData = { hits: 0 };
      axiosMock.onPost(CYBERSOURCE_API).reply(200, successResponseData);
      axiosMock.onPost(SDN_URL).reply(200, sdnResponseData);

      await expect(checkout(basket, formDetails)).resolves.toEqual(undefined);
      expectNoCardDataToBePresent(axiosMock.history.post[0].data);
      expect(generateAndSubmitForm).toHaveBeenCalledWith(
        getConfig().CYBERSOURCE_URL,
        expect.objectContaining({
          ...successResponseData.form_fields,
          card_number: '4111111111111111',
          card_type: 'VISA??',
          card_cvn: '123',
          card_expiry_date: '10-2022',
        }),
      );
    });

    it('should throw an error if there are SDN hits', () => {
      const successResponseData = {
        form_fields: {
          allThe: 'all the form fields form cybersource',
        },
      };
      const sdnResponseData = { hits: 1 };
      axiosMock.onPost(CYBERSOURCE_API).reply(200, successResponseData);
      axiosMock.onPost(SDN_URL).reply(200, sdnResponseData);

      return expect(checkout(basket, formDetails)).rejects.toEqual(new Error('This card holder did not pass the SDN check.'));
    });

    it('should throw an error if the SDN check errors', async () => {
      const sdnErrorResponseData = { boo: 'yah' };

      axiosMock.onPost(SDN_URL).reply(403, sdnErrorResponseData);
      expect.hasAssertions();
      await checkout(basket, formDetails).catch((error) => {
        expect(logError).toHaveBeenCalledWith(error, {
          messagePrefix: 'SDN Check Error',
          paymentMethod: 'Cybersource',
          paymentErrorType: 'SDN Check',
          basketId: basket.basketId,
        });
      });
    });

    it('should throw an error if the cybersource checkout request errors', async () => {
      const errorResponseData = {
        field_errors: {
          booyah: 'Booyah is bad.',
        },
      };
      const sdnResponseData = { hits: 0 };

      axiosMock.onPost(CYBERSOURCE_API).reply(403, errorResponseData);
      axiosMock.onPost(SDN_URL).reply(200, sdnResponseData);

      expect.hasAssertions();
      await checkout(basket, formDetails).catch(() => {
        expectNoCardDataToBePresent(axiosMock.history.post[1].data);
        expect(logError).toHaveBeenCalledWith(expect.any(Error), {
          messagePrefix: 'Cybersource Submit Error',
          paymentMethod: 'Cybersource',
          paymentErrorType: 'Submit Error',
          basketId: basket.basketId,
        });
      });
    });

    it('should throw an unknown error if the cybersource checkout request without a response body', async () => {
      const errorResponseData = {};
      const sdnResponseData = { hits: 0 };

      axiosMock.onPost(CYBERSOURCE_API).reply(403, errorResponseData);
      axiosMock.onPost(SDN_URL).reply(200, sdnResponseData);

      expect.hasAssertions();
      await checkout(basket, formDetails).catch(() => {
        expectNoCardDataToBePresent(axiosMock.history.post[1].data);
        expect(logError).toHaveBeenCalledWith(expect.any(Error), {
          messagePrefix: 'Cybersource Submit Error',
          paymentMethod: 'Cybersource',
          paymentErrorType: 'Submit Error',
          basketId: basket.basketId,
        });
      });
    });
  });
});

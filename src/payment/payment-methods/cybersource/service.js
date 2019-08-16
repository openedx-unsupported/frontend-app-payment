import formurlencoded from 'form-urlencoded';
import pick from 'lodash.pick';
import { logAPIErrorResponse } from '@edx/frontend-logging';

import { applyConfiguration } from '../../../common/serviceUtils';
import { generateAndSubmitForm } from '../../../common/utils';


let config = {
  CYBERSOURCE_URL: null,
  ECOMMERCE_BASE_URL: null,
  ENVIRONMENT: null,
};

let apiClient = null; // eslint-disable-line no-unused-vars

export function configureApiService(newConfig, newApiClient) {
  applyConfiguration(config, newConfig);
  config = pick(newConfig, Object.keys(config));
  apiClient = newApiClient;
}

export async function sdnCheck(basketId, firstName, lastName, city, country) {
  const { data } = await apiClient.post(
    `${config.ECOMMERCE_BASE_URL}/api/v2/sdn/search/`,
    {
      name: `${firstName} ${lastName}`,
      city,
      country,
    },
  ).catch((error) => {
    logAPIErrorResponse(error, {
      messagePrefix: 'SDN Check Error',
      paymentMethod: 'Cybersource',
      paymentErrorType: 'SDN Check',
      basketId,
    });

    throw error;
  });

  return data;
}

export async function checkout(basket, { cardHolderInfo, cardDetails }) {
  const { basketId } = basket;

  const sdnCheckResponse = await sdnCheck(
    basketId,
    cardHolderInfo.firstName,
    cardHolderInfo.lastName,
    cardHolderInfo.city,
    cardHolderInfo.country,
  );

  if (sdnCheckResponse.hits > 0) {
    if (config.ENVIRONMENT !== 'test') {
      /* istanbul ignore next */
      global.location.href = `${config.ECOMMERCE_BASE_URL}/payment/sdn/failure/`;
    }
    throw new Error('This card holder did not pass the SDN check.');
  }


  const { data } = await apiClient.post(
    `${config.ECOMMERCE_BASE_URL}/payment/cybersource/api-submit/`,
    formurlencoded({
      basket: basketId,
      first_name: cardHolderInfo.firstName,
      last_name: cardHolderInfo.lastName,
      address_line1: cardHolderInfo.address,
      address_line2: cardHolderInfo.unit,
      city: cardHolderInfo.city,
      country: cardHolderInfo.country,
      state: cardHolderInfo.state,
      postal_code: cardHolderInfo.postalCode,
      organization: cardHolderInfo.organization,
    }),
    {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    },
  ).catch((error) => {
    logAPIErrorResponse(error, {
      messagePrefix: 'Cybersource Submit Error',
      paymentMethod: 'Cybersource',
      paymentErrorType: 'Submit Error',
      basketId,
    });

    throw error;
  });

  const {
    cardNumber,
    cardTypeId,
    securityCode,
    cardExpirationMonth,
    cardExpirationYear,
  } = cardDetails;

  const cybersourcePaymentParams = {
    ...data.form_fields,
    card_number: cardNumber,
    card_type: cardTypeId,
    card_cvn: securityCode,
    card_expiry_date: [cardExpirationMonth.padStart(2, '0'), cardExpirationYear].join('-'),
  };

  generateAndSubmitForm(config.CYBERSOURCE_URL, cybersourcePaymentParams);
}

import getStates from './countryStatesMap';

// eslint-disable-next-line import/prefer-default-export
export function isPostalCodeRequired(selectedCountry, isDynamicPaymentMethodsEnabled) {
  // Stripe recommends to have state and zip code since it can have a material effect on
  // our card authorization rates and fees that the card networks and issuers charge.
  // 'CA', 'GB' and 'US' were alreay required prior to implementing Dynamic Payment Methods.
  // The Stripe API also requires state and zip code for BNPL options (Affirm, Afterpay, Klarna)
  // for the countries that these payment methods are compatible with.
  let countryListRequiredPostalCode = [];
  if (isDynamicPaymentMethodsEnabled) {
    countryListRequiredPostalCode = [
      'CA', // Affirm, Afterpay, Klarna
      'GB', // Afterpay, Klarna
      'US', // Affirm, Afterpay, Klarna
      'AU', // Afterpay, Klarna
      'AT', // Klarna
      'BE', // Klarna
      'CH', // Klarna
      'CZ', // Klarna
      'DE', // Klarna
      'DK', // Klarna
      'ES', // Klarna
      'FI', // Klarna
      'FR', // Klarna
      'GR', // Klarna
      'IE', // Klarna
      'IT', // Klarna
      'NL', // Klarna
      'NO', // Klarna
      'NZ', // Afterpay, Klarna
      'PL', // Klarna
      'PT', // Klarna
      'SE', // Klarna
    ];
  } else {
    countryListRequiredPostalCode = ['CA', 'GB', 'US'];
  }

  const postalCodeRequired = countryListRequiredPostalCode.includes(selectedCountry);

  return postalCodeRequired;
}

export function getRequiredFields(fieldValues, isBulkOrder = false, enableStripePaymentProcessor = false) {
  const {
    firstName,
    lastName,
    address,
    city,
    country,
    state,
    postalCode,
    cardExpirationMonth,
    cardExpirationYear,
    organization,
  } = fieldValues;

  const requiredFields = {
    firstName,
    lastName,
    address,
    city,
    country,
  };

  if (!enableStripePaymentProcessor) {
    requiredFields.cardExpirationMonth = cardExpirationMonth;
    requiredFields.cardExpirationYear = cardExpirationYear;
  }

  if (isPostalCodeRequired(country) && enableStripePaymentProcessor) {
    requiredFields.postalCode = postalCode;
  }

  if (getStates(country)) {
    requiredFields.state = state;
  }

  if (isBulkOrder) {
    requiredFields.organization = organization;
  }

  return requiredFields;
}

export function validateAsciiNames(firstName, lastName) {
  const errors = {};

  if (
    firstName
      && lastName
      && !/[A-Za-z]/.test(firstName + lastName)
  ) {
    errors.firstName = 'payment.form.errors.ascii.name';
  }

  return errors;
}

export function validateRequiredFields(values) {
  const errors = {};

  Object.keys(values).forEach((key) => {
    if (!values[key]) {
      errors[key] = 'payment.form.errors.required.field';
    }
  });

  return errors;
}

export function validateCardDetails(cardExpirationMonth, cardExpirationYear) {
  const errors = {};

  const currentMonth = new Date().getMonth() + 1;
  const currentYear = new Date().getFullYear();
  if (
    cardExpirationMonth
      && parseInt(cardExpirationMonth, 10) < currentMonth
      && parseInt(cardExpirationYear, 10) === currentYear
  ) {
    errors.cardExpirationMonth = 'payment.form.errors.card.expired';
  }

  return errors;
}

import { createSelector } from 'reselect';
import { localeSelector, getCountryList } from '@edx/frontend-i18n';

import { configurationSelector } from '../../common/selectors';

export const storeName = 'payment';

export const localizedCurrencySelector = (state) => {
  const { currencyCode, conversionRate } = state[storeName].currency;

  return {
    currencyCode,
    conversionRate,
    showAsLocalizedCurrency: typeof currencyCode === 'string' ? currencyCode !== 'USD' : false,
  };
};

export const basketSelector = state => ({
  ...state[storeName].basket,
  isBasketProcessing:
    state[storeName].basket.isCouponProcessing ||
    state[storeName].basket.isQuantityProcessing ||
    state[storeName].basket.submitting,
});

export const cartSelector = state => ({ ...state[storeName].basket });

export const currencyDisclaimerSelector = state => ({
  actualAmount: state[storeName].basket.orderTotal,
});

export const orderSummarySelector = createSelector(
  basketSelector,
  localizedCurrencySelector,
  (basket, currency) => ({
    ...basket,
    isCurrencyConverted: currency.showAsLocalizedCurrency,
  }),
);

export const paymentSelector = createSelector(
  basketSelector,
  configurationSelector,
  (basket, configuration) => ({
    ...basket,
    dashboardURL: configuration.LMS_BASE_URL,
    supportURL: configuration.SUPPORT_URL,
    ecommerceURL: configuration.ECOMMERCE_BASE_URL,
    isEmpty:
      basket.loaded && !basket.redirect && (!basket.products || basket.products.length === 0),
    isRedirect: basket.loaded && !!basket.redirect,
  }),
);

export const countryOptionsSelector = createSelector(
  localeSelector,
  locale => ({
    countryOptions: getCountryList(locale).map(({ code, name }) => ({ value: code, label: name })),
  }),
);

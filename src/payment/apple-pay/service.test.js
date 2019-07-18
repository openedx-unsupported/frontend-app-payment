import {
  configureApiService,
  performApplePayPayment,
} from './service';


describe('Perform Apple Pay Payment', () => {
  const config = {
    ECOMMERCE_BASE_URL: 'ecommerce.org',
    ECOMMERCE_RECEIPT_BASE_URL: 'ecommerce.org/receipt',
    APPLE_PAY_MERCHANT_IDENTIFIER: 'ecommerce.edx.org',
    APPLE_PAY_MERCHANT_NAME: 'edX e-commerce',
    APPLE_PAY_COUNTRY_CODE: 'USA',
    APPLE_PAY_CURRENCY_CODE: 'USD',
    APPLE_PAY_START_SESSION_URL: '/start-session',
    APPLE_PAY_AUTHORIZE_URL: '/authorize',
    APPLE_PAY_SUPPORTED_NETWORKS: ['amex', 'discover', 'visa', 'masterCard'],
    APPLE_PAY_MERCHANT_CAPABILITIES: ['supports3DS', 'supportsCredit', 'supportsDebit'],
  };
  const apiClient = {};
  const applePayVersion = 2;
  const applePaySession = {
    begin: jest.fn(),
    abort: jest.fn(),
    completeMerchantValidation: jest.fn(),
    completePayment: jest.fn(),
  };
  global.ApplePaySession = jest.fn().mockImplementation(() => applePaySession);
  global.ApplePaySession.STATUS_SUCCESS = 'STATUS_SUCCESS';
  global.ApplePaySession.STATUS_FAILURE = 'STATUS_FAILURE';

  const eventHandlers = {
    onPaymentBegin: jest.fn(),
    onPaymentComplete: jest.fn(),
    onMerchantValidationFailure: jest.fn(),
    onPaymentAuthorizationFailure: jest.fn(),
    onPaymentCancel: jest.fn(),
  };

  configureApiService(config, apiClient);


  beforeEach(() => {
    // Clear all instances and calls to constructor and all methods:
    global.ApplePaySession.mockClear();
    applePaySession.begin.mockClear();
    applePaySession.abort.mockClear();
    applePaySession.completeMerchantValidation.mockClear();
    applePaySession.completePayment.mockClear();
    Object.values(eventHandlers).map(handler => handler.mockClear);

    performApplePayPayment({ totalAmount: 50, ...eventHandlers });
  });


  it('should create a new apple pay session', () => {
    expect(global.ApplePaySession).toHaveBeenCalledWith(
      applePayVersion,
      expect.objectContaining({
        countryCode: config.APPLE_PAY_COUNTRY_CODE,
        currencyCode: config.APPLE_PAY_CURRENCY_CODE,
        supportedNetworks: config.APPLE_PAY_SUPPORTED_NETWORKS,
        merchantCapabilities: config.APPLE_PAY_MERCHANT_CAPABILITIES,
        total: {
          label: config.APPLE_PAY_MERCHANT_NAME,
          type: 'final',
          amount: 50,
        },
        requiredBillingContactFields: ['postalAddress'],
      }),
    );

    expect(typeof applePaySession.onvalidatemerchant).toBe('function');
    expect(typeof applePaySession.onpaymentauthorized).toBe('function');

    expect(applePaySession.begin).toHaveBeenCalled();
    expect(eventHandlers.onPaymentBegin).toHaveBeenCalled();
  });


  it('should validate the merchant', () => {
    const validateEvent = { validationURL: '/validate-merchant' };
    const successResponse = { data: 1234 };

    apiClient.post = jest.fn().mockReturnValue(new Promise((resolve) => {
      resolve(successResponse);
    }));

    const requestPromise = applePaySession.onvalidatemerchant(validateEvent);

    expect(apiClient.post).toHaveBeenCalledWith(
      config.APPLE_PAY_START_SESSION_URL,
      { url: validateEvent.validationURL },
    );

    return requestPromise.finally(() => {
      expect(applePaySession.completeMerchantValidation).toHaveBeenCalledWith(successResponse.data);
    });
  });


  it('should abort if merchant validation fails', () => {
    const errorResponse = 'error';

    apiClient.post = jest.fn().mockReturnValue(new Promise((resolve, reject) => {
      reject(errorResponse);
    }));

    const requestPromise = applePaySession.onvalidatemerchant({ validationURL: '/validate-merchant' });

    expect(apiClient.post).toHaveBeenCalled();

    return requestPromise.finally(() => {
      expect(applePaySession.abort).toHaveBeenCalled();
      expect(applePaySession.completeMerchantValidation).not.toHaveBeenCalled();
      expect(eventHandlers.onMerchantValidationFailure).toHaveBeenCalledWith(errorResponse);
    });
  });


  it('should submit the payment for authorization', () => {
    const successResponse = { number: 'the order number' };
    const authorizeEvent = { payment: 'payment data' };

    apiClient.post = jest.fn().mockReturnValue(new Promise((resolve) => {
      resolve(successResponse);
    }));

    const requestPromise = applePaySession.onpaymentauthorized(authorizeEvent);

    expect(apiClient.post).toHaveBeenCalledWith(
      config.APPLE_PAY_AUTHORIZE_URL,
      authorizeEvent.payment,
    );

    return requestPromise.finally(() => {
      expect(applePaySession.completePayment)
        .toHaveBeenCalledWith(global.ApplePaySession.STATUS_SUCCESS);
      expect(eventHandlers.onPaymentComplete).toHaveBeenCalledWith(successResponse.number);
    });
  });

  it('should complete the session with a failed status if authorization fails', () => {
    const errorResponse = 'error';
    const authorizeEvent = { payment: 'payment data' };

    apiClient.post = jest.fn().mockReturnValue(new Promise((resolve, reject) => {
      reject(errorResponse);
    }));

    const requestPromise = applePaySession.onpaymentauthorized(authorizeEvent);

    expect(apiClient.post).toHaveBeenCalledWith(
      config.APPLE_PAY_AUTHORIZE_URL,
      authorizeEvent.payment,
    );

    return requestPromise.finally(() => {
      expect(applePaySession.completePayment)
        .toHaveBeenCalledWith(global.ApplePaySession.STATUS_FAILURE);
      expect(eventHandlers.onPaymentAuthorizationFailure).toHaveBeenCalledWith(errorResponse);
    });
  });

  it('should fire the cancel handler on cancel', () => {
    applePaySession.oncancel('cancel event');
    expect(eventHandlers.onPaymentCancel).toHaveBeenCalledWith('cancel event');
  });
});

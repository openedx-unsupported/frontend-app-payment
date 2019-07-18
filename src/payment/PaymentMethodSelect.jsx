import React from 'react';
import { FormattedMessage, injectIntl, intlShape } from '@edx/frontend-i18n';
import messages from './PaymentMethodSelect.messages';

import PayPalLogo from './assets/paypal-logo.png';
import AcceptedCardLogos from './assets/accepted-card-logos.png';
import { ApplePayButtonContainer } from './apple-pay';

function PaymentMethodSelect({ intl }) {
  return (
    <div className="basket-section">
      <h2 className="section-heading">
        <FormattedMessage
          id="payment.select.payment.method.heading"
          defaultMessage="Select Payment Method"
          description="The heading for the payment type selection section"
        />
      </h2>

      <p className="d-flex ">
        <button className="payment-method-button active">
          <img
            src={AcceptedCardLogos}
            alt={intl.formatMessage(messages['payment.page.method.type.credit'])}
          />
        </button>
        <button className="payment-method-button">
          <img
            src={PayPalLogo}
            alt={intl.formatMessage(messages['payment.page.method.type.paypal'])}
          />
        </button>
        <ApplePayButtonContainer />
      </p>
    </div>
  );
}

PaymentMethodSelect.propTypes = {
  intl: intlShape.isRequired,
};


export default injectIntl(PaymentMethodSelect);

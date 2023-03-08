import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  FormattedMessage, useIntl,
} from '@edx/frontend-platform/i18n';
import { sendPageEvent } from '@edx/frontend-platform/analytics';

import messages from '../payment/PaymentPage.messages';

// Actions
import { fetchSubscriptionDetails } from './data/details/actions';

// Selectors
import { subscriptionSelector } from './data/details/selectors';

// Components
import PageLoading from '../payment/PageLoading';
import EmptyCartMessage from '../payment/EmptyCartMessage';
import { SubscriptionDetails } from './details/SubscriptionDetails';
import { SubscriptionCheckout } from './checkout/SubscriptionCheckout';
import { FormattedAlertList } from '../components/formatted-alert-list/FormattedAlertList';
import { ConfirmationModal } from './confirmation-modal/ConfirmationModal';

/**
 * Subscription Page
 * This page will be responsible to handle all the new
 * program subscription checkout requests
 */
export const SubscriptionPage = () => {
  const {
    isEmpty,
    isRedirect,
    summaryQuantity,
    summarySubtotal,
  } = useSelector(subscriptionSelector);
  const intl = useIntl();
  const dispatch = useDispatch();
  const [isPaymentSuccessfull] = useState(false);

  useEffect(() => {
    sendPageEvent();
    dispatch(fetchSubscriptionDetails());
  }, [dispatch]);

  const renderContent = () => {
    // If we're going to be redirecting to another page instead of showing the user the interface,
    // show a minimal spinner while the redirect is happening.  In other cases we want to show the
    // page skeleton, but in this case that would be misleading.
    if (isRedirect) {
      return (
        <PageLoading
          srMessage={intl.formatMessage(messages['payment.loading.payment'])}
        />
      );
    }

    if (isEmpty) {
      return (
        <EmptyCartMessage />
      );
    }

    return (
      <div className="row">
        <h1 className="sr-only">
          <FormattedMessage
            id="subscription.screen.heading.page"
            defaultMessage="Payment"
            description="The screenreader-only page heading"
          />
        </h1>
        <div className="col-md-5 pr-lg-5 col-basket-summary">
          <SubscriptionDetails />
        </div>
        <div className="col-md-7 pl-lg-5 checkout-wrapper">
          <SubscriptionCheckout />
        </div>
      </div>
    );
  };

  return (
    <div className="subscription-page page__payment container-fluid py-5">
      <FormattedAlertList
        summaryQuantity={summaryQuantity}
        summarySubtotal={summarySubtotal}
      />
      {renderContent()}
      <ConfirmationModal isVisible={isPaymentSuccessfull} />
    </div>
  );
};

export default SubscriptionPage;

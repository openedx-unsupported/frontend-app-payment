import React, { useState, useEffect } from 'react';

import {
  ModalDialog, ActionRow, Button, Hyperlink,
} from '@edx/paragon';
import { useSelector } from 'react-redux';
import { ArrowForward } from '@edx/paragon/icons';
import { getConfig } from '@edx/frontend-platform';
import { useIntl, defineMessages, FormattedMessage } from '@edx/frontend-platform/i18n';

import { subscriptionStatusSelector } from '../data/status/selectors';

import { detailsSelector } from '../data/details/selectors';

const messages = defineMessages({
  'subscription.confirmation.modal.heading': {
    id: 'subscription.confirmation.modal.heading',
    defaultMessage: 'Congratulations! Your 7-day free trial of {programTitle} has started.',
    description: 'Subscription confirmation success heading.',
  },
  'subscription.confirmation.modal.body': {
    id: 'subscription.confirmation.modal.body',
    defaultMessage: "When your free trial ends, your subscription will begin, and we'll charge your payment method on file {price} per month. This subscription will automatically renew every month unless you cancel from the {ordersAndSubscriptionLink} page.",
    description: 'Subscription confirmation success message explaining monthly subscription plan.',
  },
  'subscription.confirmation.modal.body.orders.link': {
    id: 'subscription.confirmation.modal.body.orders.link',
    defaultMessage: 'Orders & Subscriptions',
    description: 'Subscription Orders & Subscriptions link placeholder.',
  },
});

/**
 * ConfirmationModal
 */
export const ConfirmationModal = () => {
  const {
    programTitle,
    price,
    currency,
    programUuid,
  } = useSelector(detailsSelector);
  const intl = useIntl();
  const { confirmationStatus } = useSelector(subscriptionStatusSelector);
  const [isOpen, setOpen] = useState(false);

  useEffect(() => {
    if (confirmationStatus === 'success') {
      setOpen(true);
    }
  }, [confirmationStatus]);

  const ordersAndSubscriptionLink = (
    <Hyperlink
      destination={getConfig().ORDER_HISTORY_URL}
    >
      {intl.formatMessage(messages['subscription.confirmation.modal.body.orders.link'])}
    </Hyperlink>
  );

  if (!isOpen) { return null; }

  return (
    <ModalDialog
      title="Subscription Confirmation Dialog"
      isOpen={isOpen}
      onClose={() => {}}
      hasCloseButton={false}
      isFullscreenOnMobile={false}
      className="confirmation-modal"
    >
      <ModalDialog.Header>
        <ModalDialog.Title as="h3">
          {
            intl.formatMessage(messages['subscription.confirmation.modal.heading'], {
              programTitle,
            })
          }
        </ModalDialog.Title>
      </ModalDialog.Header>
      <ModalDialog.Body>
        {
          intl.formatMessage(messages['subscription.confirmation.modal.body'], {
            price: intl.formatNumber(price, { style: 'currency', currency: currency || 'USD' }),
            ordersAndSubscriptionLink,
          })
        }
      </ModalDialog.Body>
      <ModalDialog.Footer>
        <ActionRow>
          <Button
            variant="brand"
            as="a"
            iconAfter={ArrowForward}
            href={`${getConfig().LMS_BASE_URL}/dashboard/programs/${programUuid}`}
          >
            <FormattedMessage
              id="subscription.confirmation.modal.navigation.title"
              defaultMessage="Go to dashboard"
              description="Subscription confirmation success button title."
            />
          </Button>
        </ActionRow>
      </ModalDialog.Footer>
    </ModalDialog>
  );
};

export default ConfirmationModal;

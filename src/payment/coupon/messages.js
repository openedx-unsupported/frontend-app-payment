import { defineMessages } from '@edx/frontend-i18n';

const messages = defineMessages({
  'payment.coupon.label': {
    id: 'payment.coupon.label',
    defaultMessage: 'Add coupon code (optional)',
    description: 'Label for the add coupon form',
  },
  'payment.coupon.submit': {
    id: 'payment.coupon.submit',
    defaultMessage: 'Apply',
    description: 'Submit button for the add coupon form',
  },
  'payment.coupon.remove': {
    id: 'payment.coupon.remove',
    defaultMessage: 'Remove',
    description: 'Submit button to remove a coupon',
  },
  'payment.coupon.benefit.percentage': {
    id: 'payment.coupon.benefit.percentage',
    defaultMessage: 'Coupon {code} applied for {value} off',
    description: 'The description of a coupon for a percentage off the total price. Percentage symbol is included in {value}',
  },
  'payment.coupon.benefit.absolute': {
    id: 'payment.coupon.benefit.absolute',
    defaultMessage: 'Coupon {code} applied for {value} off',
    description: 'The description of a coupon for a fixed amount of currency units off the total price. Currency symbol is included in {value}.',
  },
  'payment.coupon.benefit.default': {
    id: 'payment.coupon.benefit.default',
    defaultMessage: 'Coupon {code} applied',
    description: 'The description of a coupon without any specific monetary value off.',
  },
});

export default messages;

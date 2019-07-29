import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, FormattedNumber } from '@edx/frontend-i18n';

import LocalizedPrice from './LocalizedPrice';

function Benefit({ benefitType, benefitValue }) {
  if (benefitType === 'Percentage') {
    return <FormattedNumber value={benefitValue / 100} style="percent" />; // eslint-disable-line react/style-prop-object
  }
  return <LocalizedPrice amount={benefitValue} />;
}

Benefit.propTypes = {
  benefitType: PropTypes.oneOf(['Percentage', 'Absolute']).isRequired,
  benefitValue: PropTypes.number.isRequired,
};

function Offer({
  benefitType, benefitValue, provider,
}) {
  return (
    <p className="m-0 text-muted" key={`${benefitValue}-${provider}`}>
      <FormattedMessage
        id="payment.summary.discount.offer"
        defaultMessage="{benefit} discount provided by {provider}."
        description="A description of a discount offer applied to a basket."
        values={{
          benefit: (
            <Benefit
              benefitType={benefitType}
              benefitValue={benefitValue}
            />
          ),
          provider,
        }}
      />
    </p>
  );
}

Offer.propTypes = {
  benefitType: PropTypes.oneOf(['Percentage', 'Absolute']).isRequired,
  benefitValue: PropTypes.number.isRequired,
  provider: PropTypes.string.isRequired,
};

export default function Offers({ offers, discounts }) {
  if ((discounts === undefined || discounts <= 0) && offers.length === 0) return null;

  return (
    <div className="summary-row">
      <p className="d-flex m-0">
        <span className="flex-grow-1">
          <FormattedMessage
            id="payment.summary.table.label.discount.total"
            defaultMessage="Discounts applied"
            description="Label for the total discount applied to an order"
          />
        </span>
        <span>
          <LocalizedPrice amount={discounts * -1} />
        </span>
      </p>
      {offers.map(offer => (
        <Offer key={`${offer.benefitValue}-${offer.benefitType}-${offer.provider}`} {...offer} />
      ))}
    </div>
  );
}

Offers.propTypes = {
  offers: PropTypes.arrayOf(PropTypes.shape({
    benefitType: PropTypes.oneOf(['Percentage', 'Absolute']).isRequired,
    benefitValue: PropTypes.number.isRequired,
    provider: PropTypes.string.isRequired,
  })),
  discounts: PropTypes.number,
};

Offers.defaultProps = {
  offers: [],
  discounts: undefined,
};

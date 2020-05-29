import { CircularProgress } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import braintree from 'braintree-web';
import clsx from 'clsx';
import React, { useState } from 'react';
import { useMount } from 'react-use';
import { createClient } from '../braintree';
import { CartQuery, CustomerAddress } from '../graphql';

const useStyles = makeStyles(
  () => ({
    root: {
      borderRadius: 45,
      height: 45,
      maxWidth: 400,
      position: 'relative',
    },

    disabled: {
      opacity: 0.3,
      pointerEvents: 'none',
    },

    loader: {
      left: '50%',
      position: 'absolute',
      transform: 'translateX(-50%)',
    },
  }),
  { name: 'PayPalButton' },
);

type Props = {
  cart: NonNullable<CartQuery['cart']>;
  disabled?: boolean;
  onAuthorize: (nonce: string) => void;
  paymentClientToken?: string;
  shipping?: CustomerAddress | null;
};

const PayPalButton: React.FC<Props> = ({
  cart,
  disabled,
  onAuthorize,
  paymentClientToken,
  shipping,
}) => {
  const styles = useStyles();
  const [loading, setLoading] = useState(true);

  useMount(() => {
    if (process.browser && loading && document.querySelector('#paypal-button') != null) {
      createClient(paymentClientToken)
        .then((client) => braintree.paypalCheckout.create({ client }))
        .then((paypalCheckoutInstance) => {
          paypal.Button.render(
            {
              env: process.env.NODE_ENV === 'production' ? 'production' : 'sandbox',
              client:
                process.env.NODE_ENV === 'production'
                  ? {
                      production: process.env.PAYPAL_CLIENT_ID,
                    }
                  : {
                      sandbox: process.env.PAYPAL_CLIENT_ID,
                    },
              locale: 'en_US',
              style: {
                size: 'responsive',
                tagline: false,
                label: 'pay',
              },
              payment: () =>
                paypalCheckoutInstance.createPayment({
                  flow: 'checkout',
                  amount: cart.total == null ? undefined : parseFloat(cart.total),
                  currency: 'EUR',
                  enableShippingAddress: true,
                  shippingAddressEditable: false,
                  shippingAddressOverride: {
                    recipientName: `${shipping?.firstName} ${shipping?.lastName}`.trim(),
                    line1: shipping?.address1,
                    line2: shipping?.address2,
                    city: shipping?.city,
                    countryCode: shipping?.country,
                    postalCode: shipping?.postcode,
                    state: shipping?.state,
                  },
                }),
              validate: () => {
                // We can enable or disable the button here, but without visual feedback
                // actions.disable();
              },
              onAuthorize: (data) =>
                paypalCheckoutInstance.tokenizePayment(data).then((payload) => {
                  onAuthorize(payload.nonce);
                }),
              onError: () => {
                // Show an error page here, when an error occurs
              },
            },
            '#paypal-button',
          ).then(() => {
            setLoading(false);
          });
        });
    }
  });

  return (
    <div className={clsx(styles.root, disabled && styles.disabled)} id="paypal-button">
      {loading && (
        <div className={styles.loader}>
          <CircularProgress />
        </div>
      )}
    </div>
  );
};

export default PayPalButton;

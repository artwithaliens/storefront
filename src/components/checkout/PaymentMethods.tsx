import { Box, Button, makeStyles, Radio, RadioGroup, SvgIcon, Typography } from '@material-ui/core';
import React from 'react';
import { usePaymentGatewaysQuery } from '../../graphql';
import AmexSvg from '../../icons/payment-gateways/amex.svg';
import PaypalSvg from '../../icons/payment-gateways/paypal.svg';
import SofortSvg from '../../icons/payment-gateways/sofort.svg';
import VisaSvg from '../../icons/payment-gateways/visa.svg';
import isBlank from '../../utils/isBlank';

const icons: { [id: string]: React.ReactElement } = {
  braintree_cc: (
    <>
      <SvgIcon component={AmexSvg} viewBox="0 0 30 30" fontSize="large" />{' '}
      <SvgIcon component={VisaSvg} viewBox="0 0 30 30" fontSize="large" />
    </>
  ),
  braintree_paypal: <SvgIcon component={PaypalSvg} viewBox="0 0 30 30" fontSize="large" />,
  braintree_sofort: <SvgIcon component={SofortSvg} viewBox="0 0 30 30" fontSize="large" />,
  paypal: <SvgIcon component={PaypalSvg} viewBox="0 0 30 30" fontSize="large" />,
};

const useStyles = makeStyles(
  ({ palette, spacing }) => ({
    label: {
      alignItems: 'center',
      backgroundColor: palette.background.paper,
      cursor: 'pointer',
      display: 'flex',
      marginBottom: spacing(2),
      padding: spacing(2),
    },
  }),
  { name: 'PaymentModes' },
);

type Props = {
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onFinish: () => void;
  paymentMethod?: string;
};

const PaymentMethods: React.FC<Props> = ({ onChange, onFinish, paymentMethod }) => {
  const styles = useStyles();
  const { data: { paymentGateways } = { data: undefined }, loading } = usePaymentGatewaysQuery();

  return (
    <>
      <RadioGroup name="paymentMode">
        {paymentGateways?.nodes?.map(
          (paymentGateway) =>
            paymentGateway != null && (
              <React.Fragment key={paymentGateway.id}>
                <label className={styles.label} htmlFor={`paymentMode-${paymentGateway.id}`}>
                  <div>
                    <Radio
                      value={paymentGateway.id}
                      id={`paymentMode-${paymentGateway.id}`}
                      checked={paymentMethod === paymentGateway.id}
                      onChange={onChange}
                    />
                  </div>
                  <Box flexGrow={1} ml={2}>
                    <Typography variant="h5">{paymentGateway.title}</Typography>
                    {paymentGateway.icon == null ? (
                      icons[paymentGateway.id]
                    ) : (
                      <img src={paymentGateway.icon} alt="" height="24" />
                    )}
                    {!isBlank(paymentGateway.description) && (
                      <Typography variant="body2">{paymentGateway.description}</Typography>
                    )}
                  </Box>
                </label>
              </React.Fragment>
            ),
        )}
      </RadioGroup>
      <Box mt={2}>
        <Button type="submit" color="primary" disabled={loading} onClick={onFinish}>
          {loading ? 'Loading' : 'Continue to Review Your Order'}
        </Button>
      </Box>
    </>
  );
};
export default PaymentMethods;

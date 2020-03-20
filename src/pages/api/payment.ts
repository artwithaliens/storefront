/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { NextApiRequest, NextApiResponse } from 'next';
import client from '../../braintree/apollo';
import {
  ChargePaymentMethodDocument,
  ChargePaymentMethodMutation,
  ChargePaymentMethodMutationVariables,
} from '../../braintree/graphql';

type Data = {
  transaction?: {
    id?: string;
    status?: string;
  };
  error?: string;
};

export default (req: NextApiRequest, res: NextApiResponse<Data>) => {
  client
    .mutate<ChargePaymentMethodMutation, ChargePaymentMethodMutationVariables>({
      mutation: ChargePaymentMethodDocument,
      variables: {
        input: {
          paymentMethodId: req.body.nonce,
          transaction: {
            amount: parseFloat(req.body.total),
          },
        },
      },
    })
    .then((data) => {
      res.status(200).json({
        transaction: {
          id: data.data?.chargePaymentMethod?.transaction?.legacyId,
          status: data.data?.chargePaymentMethod?.transaction?.status ?? undefined,
        },
      });
    })
    .catch((error) => {
      res.status(400).json({ error: error.message });
    });
};

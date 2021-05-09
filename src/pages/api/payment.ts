import { ApolloClient, gql, InMemoryCache } from '@apollo/client';
import { NextApiRequest, NextApiResponse } from 'next';

type ChargePaymentMethodVariables = {
  input: {
    paymentMethodId: string;
    transaction: {
      amount: number;
    };
  };
};

type ChargePaymentMethodMutation = {
  chargePaymentMethod?: {
    transaction?: {
      legacyId: string;
      status?: string | null;
    };
  };
};

const ChargePaymentMethodDocument = gql`
  mutation ChargePaymentMethod($input: ChargePaymentMethodInput!) {
    chargePaymentMethod(input: $input) {
      transaction {
        legacyId
        status
      }
    }
  }
`;

type Data = {
  transaction?: {
    id?: string;
    status?: string;
  };
  error?: string;
};

export default (req: NextApiRequest, res: NextApiResponse<Data>) => {
  new ApolloClient({
    uri:
      process.env.NODE_ENV === 'production'
        ? 'https://payments.braintree-api.com/graphql'
        : 'https://payments.sandbox.braintree-api.com/graphql',
    headers: {
      authorization: `Bearer ${process.env.BRAINTREE_API_KEY}`,
      'braintree-version': '2020-05-07',
      'content-type': 'application/json',
    },
    cache: new InMemoryCache(),
  })
    .mutate<ChargePaymentMethodMutation, ChargePaymentMethodVariables>({
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
    // eslint-disable-next-line promise/prefer-await-to-then
    .then((data) => {
      res.status(200).json({
        transaction: {
          id: data.data?.chargePaymentMethod?.transaction?.legacyId,
          status: data.data?.chargePaymentMethod?.transaction?.status ?? undefined,
        },
      });
    })
    // eslint-disable-next-line promise/prefer-await-to-then
    .catch((error) => {
      res.status(400).json({ error: error.message });
    });
};

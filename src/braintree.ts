import braintree from 'braintree-web';

export function createClient(paymentClientToken?: string) {
  return braintree.client.create({
    authorization: paymentClientToken ?? '',
  });
}

type CreditCardData = {
  billingAddress: {
    postalCode?: string;
  };
  cvv: string;
  expirationDate: string;
  number: string;
  options?: {
    validate?: boolean;
  };
};

export function makePayment(paymentClientToken: string, creditCard: CreditCardData) {
  return new Promise<{ cardType: string; lastFour: string; nonce: string }>((resolve, reject) => {
    createClient(paymentClientToken).then((client) => {
      client.request(
        {
          data: { creditCard },
          endpoint: 'payment_methods/credit_cards',
          method: 'post',
        },
        (
          error:
            | {
                details: {
                  originalError: {
                    fieldErrors: { field: string; fieldErrors: object }[];
                  };
                };
              }
            | undefined,
          data: {
            creditCards: { details: { cardType: string; lastFour: string }; nonce: string }[];
          },
        ) => {
          if (error == null) {
            const {
              nonce,
              details: { cardType, lastFour },
            } = data.creditCards[0];
            resolve({ cardType, lastFour, nonce });
          } else if (error.details.originalError.fieldErrors.length > 0) {
            error.details.originalError.fieldErrors.forEach(
              (fieldError: { field: string; fieldErrors: object }) => {
                if (fieldError.field === 'creditCard') {
                  reject(fieldError.fieldErrors);
                }
              },
            );
          }
        },
      );
    });
  });
}

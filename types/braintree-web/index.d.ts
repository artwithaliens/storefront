import 'braintree-web';

declare module 'braintree-web' {
  export type PayPalCheckout = {
    create(options: { client: Client }): Promise<PayPalCheckout>;
    create(options: { authorization: string }, callback: callback): void;

    createPayment(options: object): void;

    tokenizePayment(data: {}): Promise<{ nonce: string }>;
  };
  export const paypalCheckout: PayPalCheckout;
}

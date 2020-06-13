declare module '*.svg' {
  const content: React.ElementType<React.SVGProps<SVGSVGElement>>;
  export default content;
}

type PayPalActions = {
  [name: string]: Function;
};

type PayPalButtonConfig = {
  client?: {
    production?: string;
    sandbox?: string;
  };
  env?: 'production' | 'sandbox';
  locale?: string;
  onAuthorize?: (data: {}, actions: PayPalActions) => void;
  onCancel?: (data: {}) => void;
  onError?: (err: Error) => void;
  payment?: () => void;
  validate?: (actions: PayPalActions) => void;
  style?: {
    label?: 'checkout' | 'credit' | 'pay' | 'buynow' | 'paypal' | 'installment';
    size?: 'small' | 'medium' | 'large' | 'responsive';
    tagline?: boolean;
  };
};

declare const paypal: {
  Button: {
    render(config: PayPalButtonConfig, selector: string): Promise<void>;
  };
  Buttons: {
    driver(
      name: string,
      libraries: { [library: string]: object },
    ): React.ComponentType<PayPalButtonConfig>;
  };
};

declare namespace NodeJS {
  interface ProcessEnv {
    readonly SITE_URL: string;
    readonly GRAPHQL_URL: string;
    readonly BRAINTREE_MERCHANT_ID: string;
    readonly BRAINTREE_API_KEY: string;
    readonly BRAINTREE_TOKENIZATION_KEY: string;
    readonly PAYPAL_CLIENT_ID: string;
    readonly GA_TRACKING_ID: string;
    readonly SENDGRID_API_KEY: string;
  }
}

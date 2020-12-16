declare module '*.svg' {
  const Component: React.ElementType<React.SVGProps<SVGSVGElement>>;
  export default Component;
}

declare const paypal: unknown;

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

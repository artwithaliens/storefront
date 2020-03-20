import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

const Checkout: NextPage = () => {
  const router = useRouter();
  useEffect(() => {
    router.push('/checkout/[step]', '/checkout/billing-address');
  }, [router]);
  return null;
};

Checkout.getInitialProps = (context) => {
  if (context.res != null) {
    context.res.writeHead(302, { location: '/checkout/billing-address' });
    context.res.end();
  }
  return {};
};

export default Checkout;

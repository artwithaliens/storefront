import { useCookie } from 'react-use';

const COOKIE_NAME = 'accept-cookies';

export default function useAcceptCookies() {
  const [acceptedCookies, setAcceptedCookies] = useCookie(COOKIE_NAME);

  const handleAcceptCookies = () => {
    setAcceptedCookies('accepted', { expires: 365 });
  };

  return {
    acceptedCookies: acceptedCookies === 'accepted',
    handleAcceptCookies,
  };
}

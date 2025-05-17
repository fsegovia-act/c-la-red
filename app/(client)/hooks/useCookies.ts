import { useState, useEffect } from "react";
import Cookies from "js-cookie";

export function useCookies() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const setCookie = (
    name: string,
    value: string,
    options?: Cookies.CookieAttributes
  ) => {
    if (isClient) {
      Cookies.set(name, value, options);
    }
  };

  const getCookie = (name: string) => {
    if (isClient) {
      return Cookies.get(name);
    }
    return undefined;
  };

  const removeCookie = (name: string, options?: Cookies.CookieAttributes) => {
    if (isClient) {
      Cookies.remove(name, options);
    }
  };

  return { setCookie, getCookie, removeCookie };
}

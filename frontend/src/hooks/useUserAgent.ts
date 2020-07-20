import { useEffect } from "react";
import { UAParser } from "ua-parser-js";

const useUserAgent = () => {
  useEffect(() => {}, []);
  const userAgent = typeof navigator === "undefined" ? "SSR" : navigator.userAgent;
  const uaParser = new UAParser(userAgent);
  return uaParser.getResult();
};

export default useUserAgent;

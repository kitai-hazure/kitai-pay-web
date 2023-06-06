import { polygonMumbai } from "wagmi/chains";

export const ETH_CHAINS = [polygonMumbai];

export const SITE_NAME = "Kitai Pay";
export const SITE_DESCRIPTION = "Your payments, your way.";
export const SITE_URL = "https://kitai-pay.com";

export const SOCIAL_TWITTER = "kalashshah04";
export const SOCIAL_GITHUB = "kitai-hazure";

export const ironOptions = {
  cookieName: SITE_NAME,
  password: process.env.SESSION_PASSWORD || "password-rakhle-bhai",
  cookieOptions: {
    secure: process.env.NODE_ENV === "production",
  },
};

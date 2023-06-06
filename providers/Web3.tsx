/* eslint-disable react/no-children-prop */
import "@rainbow-me/rainbowkit/styles.css";
import {
  connectorsForWallets,
  RainbowKitProvider,
  lightTheme,
  darkTheme,
} from "@rainbow-me/rainbowkit";
import {
  injectedWallet,
  metaMaskWallet,
  trustWallet,
  walletConnectWallet,
  coinbaseWallet,
} from "@rainbow-me/rainbowkit/wallets";

import { configureChains, createClient, WagmiConfig } from "wagmi";
import { publicProvider } from "wagmi/providers/public";

import { ReactNode } from "react";

import { ETH_CHAINS } from "@/utils/config";

interface Props {
  children: ReactNode;
}

const { chains, provider, webSocketProvider } = configureChains(ETH_CHAINS, [
  publicProvider(),
]);

const connectors = connectorsForWallets([
  {
    groupName: "Recommended",
    wallets: [
      injectedWallet({ chains }),
      metaMaskWallet({ chains }),
      walletConnectWallet({ chains }),
    ],
  },
  {
    groupName: "Others",
    wallets: [
      trustWallet({ chains }),
      coinbaseWallet({ chains, appName: "DAPP KIT" }),
    ],
  },
]);

const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider,
  webSocketProvider,
});

const Web3Provider = (props: Props) => {
  return (
    <WagmiConfig client={wagmiClient}>
      <RainbowKitProvider
        chains={chains}
        theme={{
          lightMode: lightTheme({ overlayBlur: "small" }),
          darkMode: darkTheme({ overlayBlur: "small" }),
        }}
        appInfo={{
          appName: "Kitai Pay",
          learnMoreUrl: "https://github.com/kitai-hazure",
        }}
      >
        {props.children}
      </RainbowKitProvider>
    </WagmiConfig>
  );
};

export default Web3Provider;

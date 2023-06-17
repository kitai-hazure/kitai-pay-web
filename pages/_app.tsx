import type { AppProps } from "next/app";
import Web3Provider from "@/providers/Web3";
import { SEO } from "@/components/layout";
import { createTheme, NextUIProvider } from "@nextui-org/react";
import { SuperfluidProvider } from "@/providers/SuperfluidProvider";

const theme = createTheme({
  type: "light",
});

const AppBackground = () => {
  return (
    <div
      style={{
        position: "absolute",
        width: "100%",
        minHeight: "100vh",
        height: "100vh",
        // backgroundColor: "#000",
        backgroundImage: "url(/gradient-right-dark.svg)",
      }}
    />
  );
};

export default function App({ Component, pageProps }: AppProps) {
  return (
    <NextUIProvider theme={theme}>
      <Web3Provider>
        <SuperfluidProvider>
          <SEO />
          <AppBackground />
          <Component {...pageProps} />
        </SuperfluidProvider>
      </Web3Provider>
    </NextUIProvider>
  );
}

import Head from "next/head";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { SITE_NAME, SITE_DESCRIPTION } from "@/utils/config";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  return (
    <main className={`${inter.className}`}>
      <Head>
        <title>{SITE_NAME}</title>
        <meta name="description" content={SITE_DESCRIPTION} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <ConnectButton />
    </main>
  );
}

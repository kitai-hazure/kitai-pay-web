import { useEffect, useState } from "react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { ethers } from "ethers";
import { ChainId, IWalletTransaction, Transaction } from "@biconomy/core-types";
import SmartAccount from "@biconomy/smart-account";
import { useAccount, useSigner } from "wagmi";

// const CONTRACT_ADDRESS = "0xbc1e4f34BA4B57218EbB8079a255a3A5CFE40280";
const CONTRACT_ADDRESS = "0xaE703cec6fE5E68843E4396dBF928A3f55c39dc5";
import RANDOM_CONTRACT from "../artifacts/Example.json";
import { Button, Text } from "@nextui-org/react";

const randomInterface = new ethers.utils.Interface(RANDOM_CONTRACT.abi);

const Login = () => {
  const { data: signer } = useSigner();
  const { address } = useAccount();
  const [smartAccount, setSmartAccount] = useState<SmartAccount | null>(null);
  const [scwAddress, setScwAddress] = useState("");
  const [scwLoading, setScwLoading] = useState(false);

  const sAddress = smartAccount?.address;
  console.log("smartAccount", smartAccount);
  console.log("address", sAddress);

  useEffect(() => {
    async function setupSmartAccount() {
      setScwAddress("");
      setScwLoading(true);
      const walletProvider = new ethers.providers.Web3Provider(
        (signer?.provider as any).provider
      );
      console.log("bi", process.env.NEXT_PUBLIC_BICONOMY_API_KEY);
      const smartAccount = new SmartAccount(walletProvider, {
        activeNetworkId: ChainId.POLYGON_MUMBAI,
        supportedNetworksIds: [ChainId.POLYGON_MUMBAI],
        networkConfig: [
          {
            chainId: ChainId.POLYGON_MUMBAI,
            dappAPIKey: process.env.NEXT_PUBLIC_BICONOMY_API_KEY,
          },
        ],
      });
      await smartAccount.init();
      const context = smartAccount.getSmartAccountContext();
      setScwAddress(context.baseWallet.getAddress());
      setSmartAccount(smartAccount);
      setScwLoading(false);
    }

    if (!!signer?.provider && !!address) {
      setupSmartAccount();
      console.log("Provider...", signer?.provider);
    }
  }, [address, signer?.provider]);

  const idk = async () => {
    if (!smartAccount) return;
    const transferEncodedData = randomInterface.encodeFunctionData("transfer");

    const transferMoreEncodedData =
      randomInterface.encodeFunctionData("transfer_more");

    const txs: Transaction[] = [];

    const tx1: Transaction = {
      to: CONTRACT_ADDRESS,
      data: transferEncodedData,
      // gasLimit: 15000000,
    };

    txs.push(tx1);

    const tx2: Transaction = {
      to: CONTRACT_ADDRESS,
      data: transferMoreEncodedData,
      gasLimit: 15000000,
    };

    txs.push(tx2);

    // Optional: Transaction subscription. One can subscribe to various transaction states
    // Event listener that gets triggered once a hash is generetaed
    smartAccount.on("txHashGenerated", (response: any) => {
      console.log("txHashGenerated event received via emitter", response);
    });
    smartAccount.on("onHashChanged", (response: any) => {
      console.log("onHashChanged event received via emitter", response);
    });
    // Event listener that gets triggered once a transaction is mined
    smartAccount.on("txMined", (response: any) => {
      console.log("txMined event received via emitter", response);
    });
    // Event listener that gets triggered on any error
    smartAccount.on("error", (response: any) => {
      console.log("error event received via emitter", response);
    });

    // Sending gasless transaction
    // const txResponse = await smartAccount.sendTransactionBatch({
    //   transactions: txs,
    // });
    // const feeQuotes = await smartAccount.getFeeQuotesForBatch({
    //   transactions: txs,
    // });

    // console.log("Fee Quotes", feeQuotes);

    // const txResponse = await smartAccount.createUserPaidTransactionBatch({
    //   transactions: txs,
    //   feeQuote: feeQuotes[0],
    // });

    // const trxResponse = smartAccount.sendTransaction({ transaction: tx1 });
    const feeQuote = await smartAccount.getFeeQuotes({
      transaction: tx1,
    });
    const txSingle = await smartAccount.createUserPaidTransaction({
      transaction: tx1,
      feeQuote: feeQuote[0],
    });

    const res = await smartAccount.sendUserPaidTransaction({
      tx: txSingle,
    });
    console.log("res", res);

    // console.log("UserOp hash", txResponse);
    // If you do not subscribe to listener, one can also get the receipt like shown below
    // const txReciept = await txResponse.wait();
    // console.log("Tx Hash", txReciept.transactionHash);
    // DONE! You just sent a batched gasless transaction
  };

  return (
    <div>
      <main>
        <Text color="success" css={{ color: "White" }}>
          Biconomy SDK Next.js Ranibow Example{" "}
        </Text>
        <ConnectButton />

        {scwLoading && <h2>Loading Smart Account...</h2>}

        {scwAddress && (
          <div>
            <Text color="success">Smart Account Address</Text>
            <Text color="success">{scwAddress}</Text>
          </div>
        )}

        <Button onPress={idk}>Send Tokens</Button>
      </main>
    </div>
  );
};

export default Login;

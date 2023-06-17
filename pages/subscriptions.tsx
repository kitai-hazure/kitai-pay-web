import CreateFlow from "@/components/Superfluid/CreateFlow";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import React from "react";
import { useAccount } from "wagmi";

const Subscriptions = () => {
  const { isConnected } = useAccount();
  const [connected, setIsConnected] = React.useState<boolean>(false);
  React.useEffect(() => {
    setIsConnected(isConnected);
  }, [isConnected]);
  return connected ? (
    <div>
      <CreateFlow />
    </div>
  ) : (
    <ConnectButton />
  );
};

export default Subscriptions;

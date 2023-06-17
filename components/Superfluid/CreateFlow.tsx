import { Button, Input } from "@nextui-org/react";
import React from "react";
import { useNetwork } from "wagmi";
import { getProvider, fetchSigner } from "@wagmi/core";
import { Framework } from "@superfluid-finance/sdk-core";
import { useSuperfluid } from "@/providers/SuperfluidProvider";

const CreateFlow = () => {
  const [recipientAddress, setRecipientAddress] = React.useState<string>("");
  //0xc6B19e47Bbfb70D2c466E15F25506d2D4D1D5829
  const [flowRate, setFlowRate] = React.useState<number>(0);
  const [loading, setLoading] = React.useState<boolean>(true);

  const handleChangeFlowRate = (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log("called");
    setFlowRate(Number(event.target.value));
  };

  const { sf, superSigner, fdaix, createNewFlow, getAllFlowsForUser } =
    useSuperfluid();
  React.useEffect(() => {
    if (sf && superSigner && fdaix) {
      // Access sf, superSigner, and fdaix here
      console.log(sf);
      console.log(superSigner);
      console.log(fdaix);
      setLoading(false);
    }
  }, [sf, superSigner, fdaix]);

  return loading ? (
    <>Loading</>
  ) : (
    <div className="flex h-screen flex-col items-center justify-center">
      <div>
        <h1>Let's Learn to create a stream</h1>
      </div>
      <div>
        <Input
          onChange={(e) => {
            setRecipientAddress(e.target.value);
          }}
          placeholder="Enter recipient address"
          type="text"
          value={recipientAddress}
        />
      </div>
      <div>
        <Input
          type="text"
          value={flowRate.toString()}
          onChange={(e) => {
            setFlowRate(Number(e.target.value));
          }}
          placeholder="Enter Flow Rate"
        />
      </div>
      <div>
        <Button onClick={() => createNewFlow(recipientAddress, flowRate)}>
          Let's create a stream
        </Button>
        <Button onClick={() => getAllFlowsForUser()}>Get Flows</Button>
      </div>
    </div>
  );
};

export default CreateFlow;

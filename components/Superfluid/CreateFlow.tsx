import { Button } from "@nextui-org/react";
import React from "react";
import { useNetwork } from "wagmi";
import { getProvider, fetchSigner } from "@wagmi/core";
import { Framework } from "@superfluid-finance/sdk-core";
import { useSuperfluid } from "@/providers/SuperfluidProvider";

const createNewFlow = async (recipientAddress: string, flowRate: number) => {
  const provider = getProvider();
  const signer = await fetchSigner();
  console.log(signer);
  //Initialize SDK - here we using polygon and getting provider from wagmi
  const sf = await Framework.create({
    chainId: 80001, //TODO: GET BASED ON CHAIN
    provider,
    resolverAddress: "0x8c54c83fbde3c59e59dd6e324531fb93d4f504d3",
  });

  const superSigner = await sf.createSigner({ signer: signer! });

  console.log(await superSigner.getAddress());
  //get addresses here - https://docs.superfluid.finance/superfluid/developers/networks
  const fdaix = await sf.loadSuperToken(
    "0x5D8B4C2554aeB7e86F387B4d6c00Ac33499Ed01f"
  );

  console.log(fdaix);

  try {
    const createFlowOperation = fdaix.createFlow({
      sender: await superSigner.getAddress(),
      receiver: recipientAddress,
      flowRate: flowRate.toString(),
      // userData?: string - can add description as well
    });

    console.log(createFlowOperation);
    console.log("Creating your stream...");

    const result = await createFlowOperation.exec(superSigner);
    console.log(result);

    console.log(
      `Congrats - you've just created a money stream!
      `
    );
  } catch (error) {
    console.log(
      "Hmmm, your transaction threw an error. Make sure that this stream does not already exist, and that you've entered a valid Ethereum address!"
    );
    console.error(error);
  }
};

const CreateFlow = () => {
  const [recipientAddress, setRecipientAddress] = React.useState<string>("");
  //0xc6B19e47Bbfb70D2c466E15F25506d2D4D1D5829
  const [flowRate, setFlowRate] = React.useState<number>(0);

  const handleChangeRecipientAddress = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRecipientAddress(event.target.value);
  };

  const handleChangeFlowRate = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFlowRate(Number(event.target.value));
  };

  const { sf, superSigner, fdaix } = useSuperfluid();
  React.useEffect(() => {
    console.log("Running use effect");
    console.log(sf);
    console.log(superSigner);
    console.log(fdaix);
    if (sf && superSigner && fdaix) {
      // Access sf, superSigner, and fdaix here
      console.log(sf);
      console.log(superSigner);
      console.log(fdaix);
    }
  }, [sf, superSigner, fdaix]);

  return (
    <div className="flex h-screen flex-col items-center justify-center">
      <div>
        <h1>Let's Learn to create a stream</h1>
      </div>
      <div className="pt-5">
        <input
          type="text"
          className="rounded-md border border-gray-300 px-4 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
          value={recipientAddress}
          onChange={handleChangeRecipientAddress}
          placeholder="Enter Recipient Address"
        />
      </div>
      <div className="p-5">
        <input
          type="text"
          className="rounded-md border border-gray-300 px-4 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
          value={flowRate.toString()}
          onChange={handleChangeFlowRate}
          placeholder="Enter Flow Rate"
        />
      </div>
      <div>
        <Button onClick={() => createNewFlow(recipientAddress, flowRate)}>
          Let's create a stream
        </Button>
      </div>
    </div>
  );
};

export default CreateFlow;

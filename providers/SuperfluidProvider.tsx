import { createContext, useContext, useEffect, useState } from "react";
import { Framework, SuperToken } from "@superfluid-finance/sdk-core";
import { Signer, ethers } from "ethers";
import { getProvider, fetchSigner } from "@wagmi/core";
import { useAccount, useSigner } from "wagmi";

interface SuperfluidContextType {
  sf: Framework | null;
  superSigner: ethers.Signer | null;
  superSignerAddress: string | null;
  fdaix: SuperToken | null;
  createNewFlow: Function;
  getSentFlowsForUser: any;
  deleteFlow: Function;
  updateFlow: Function;
  batchTransactions: Function;
}

const SuperfluidContext = createContext<SuperfluidContextType>({
  sf: null,
  superSigner: null,
  superSignerAddress: null,
  fdaix: null,
  createNewFlow: () => {},
  getSentFlowsForUser: () => {},
  deleteFlow: () => {},
  updateFlow: () => {},
  batchTransactions: () => {},
});

export function useSuperfluid(): SuperfluidContextType {
  return useContext(SuperfluidContext);
}

export function SuperfluidProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sf, setSuperfluid] = useState<Framework | null>(null);
  const [superSigner, setSuperSigner] = useState<ethers.Signer | null>(null);
  const [fdaix, setFDAIX] = useState<SuperToken | null>(null);
  const [superSignerAddress, setSuperSignerAddress] = useState<string | null>(
    null
  );
  const address = useAccount();
  const { data: signer } = useSigner();
  console.log(address);
  useEffect(() => {
    async function initializeSuperfluid() {
      const provider = getProvider();
      const sfInstance = await Framework.create({
        chainId: 80001, // TODO: GET BASED ON CHAIN
        provider,
        resolverAddress: "0x8c54c83fbde3c59e59dd6e324531fb93d4f504d3",
      });

      console.log("REACHED HERE");

      console.log(signer);
      if (!signer) return;
      const superSignerInstance = sfInstance.createSigner({
        signer: signer as Signer,
      });

      const superSignerAddress = await superSignerInstance.getAddress();

      console.log("SUCCESSFUL");
      console.log("Signer Address:", await superSignerInstance.getAddress());

      const fdaixInstance = await sfInstance.loadSuperToken(
        "0x5D8B4C2554aeB7e86F387B4d6c00Ac33499Ed01f"
      );

      console.log("GOT fdaix");

      setSuperfluid(sfInstance);
      setSuperSignerAddress(superSignerAddress);
      setSuperSigner(superSignerInstance);
      setFDAIX(fdaixInstance);
    }

    if (address) {
      console.log("RUNNING INIT SUPERFLUID");
      initializeSuperfluid();
    }
  }, [signer]);

  //Function to Add new flow
  const createNewFlow = async (
    recipientAddress: string,
    flowRate: number,
    description?: string
  ) => {
    if (sf && superSigner && fdaix) {
      try {
        const createFlowOperation = fdaix.createFlow({
          sender: await superSigner.getAddress(),
          receiver: recipientAddress,
          flowRate: flowRate.toString(),
          userData: description,
          //   userData?: string - can add description as well
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
    } else {
      throw new Error("Error initializing SDK");
    }
  };

  //Function to get all flows from graphQL where user is sender!
  const getSentFlowsForUser = async () => {
    if (!(sf && superSigner && fdaix)) {
      throw new Error("Error initializing SDK");
    }
    const superFluidAddress = await superSigner.getAddress();
    console.log("Querying for address :", superFluidAddress.toLowerCase());
    const data = await fetch(
      //   "https://console.superfluid.finance/subgraph?_network=mumbai",
      "https://api.thegraph.com/subgraphs/name/superfluid-finance/protocol-v1-mumbai",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query: `
          query FetchStreamsFromAddress{
            streams(where: {sender: "${superFluidAddress.toLowerCase()}"}) {
              id
              userData
              currentFlowRate
              receiver {
                id
                receivedTransferEvents {
                  addresses
                  transactionHash
                  token
                }
              }
            }
          }
      `,
        }),
        next: { revalidate: 10 },
      }
    )
      .then((res) => res.json())
      .then((data) => data);

    console.log("Data fetched from API : ", data);
  };

  //TODO: Add in getRecievingFlows For User - pls pls am lazy @KalashShah or @DhruvDave

  const deleteFlow = async (receiverAddress: string, userData?: string) => {
    if (!(superSigner && fdaix)) {
      throw new Error("Error initialzing SDK, couldnt find signer and token");
    }

    let flowOp = fdaix.deleteFlow({
      sender: await superSigner.getAddress(),
      receiver: receiverAddress,
      userData: userData,
    });

    const res = await flowOp.exec(superSigner);
    console.log(res);
  };

  const updateFlow = async (
    receiverAddress: string,
    updatedFlowRate: string,
    description?: string
  ) => {
    if (!(superSigner && fdaix)) {
      throw new Error("Error initialzing SDK, couldnt find signer and token");
    }
    let flowOp = fdaix.updateFlow({
      sender: await superSigner.getAddress(),
      receiver: receiverAddress,
      flowRate: updatedFlowRate,
      userData: description,
    });

    const res = await flowOp.exec(superSigner);
    console.log(res);
  };

  const batchTransactions = async (listOPs: any) => {
    if (!(superSigner && sf)) {
      throw new Error("Error initialzing SDK, couldnt find signer and token");
    }
    if (!listOPs) {
      console.log("EXECUTING SAMPLE TRANSACTIONS");
      const approveOp = fdaix!.approve({
        receiver: "0x302A9674E39A43B6d414410E5991ff9a89Cc6EeE",
        amount: "10",
      });
      const transferFromOp = fdaix!.transferFrom({
        sender: await superSigner.getAddress(),
        receiver: "0x302A9674E39A43B6d414410E5991ff9a89Cc6EeE",
        amount: "5",
      });

      const Ops = [approveOp, transferFromOp];
      console.log("Calling....");
      const batchCall = sf.batchCall(Ops);
      const res = await batchCall.exec(superSigner);
      console.log(res);
      return;
    }
    const batchCall = sf.batchCall(listOPs);
    const res = await batchCall.exec(superSigner);
    console.log(res);
  };

  return (
    <SuperfluidContext.Provider
      value={{
        sf,
        superSigner,
        superSignerAddress,
        fdaix,
        createNewFlow,
        getSentFlowsForUser,
        deleteFlow,
        updateFlow,
        batchTransactions,
      }}
    >
      {children}
    </SuperfluidContext.Provider>
  );
}

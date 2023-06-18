import CreatePayment from "@/components/create-payment";
import { Button, useModal } from "@nextui-org/react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import React, { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { IPaymentProps } from "@/types/payments/payment.types";
import { useSuperfluid } from "@/providers/SuperfluidProvider";
import { Flow } from "@/types/flow";
import FlowListModal from "@/components/Superfluid/FlowListModal";
import { Text } from "@nextui-org/react";
import Lottie from "react-lottie";
import asset from "../assets/69760-currency.json";

export default function Home() {
  const {
    sf,
    superSigner,
    fdaix,
    createNewFlow,
    getSentFlowsForUser,
    deleteFlow,
    updateFlow,
    batchTransactions,
    flowsForCurrentUser,
    superSignerAddress,
    initialized,
  } = useSuperfluid();

  const {
    setVisible: setVisibleIncomingFlows,
    bindings: bindingsIncomingFlows,
  } = useModal();
  const {
    setVisible: setVisibleOutgoingFlows,
    bindings: bindingsOutgoingFlows,
  } = useModal();
  const [outgoingFlows, setOutgoingFlows] = useState<Flow[]>([]);
  const [incomingFlows, setIncomingFlows] = useState<Flow[]>([]);

  useEffect(() => {
    if (!initialized) return;
    (async () => {
      const res = await getSentFlowsForUser();
      setOutgoingFlows(() => {
        let response = res.data.streams.map((stream: any) => {
          const split: Array<string> = stream.id.split("-");
          return {
            currentFlowRate: stream.currentFlowRate,
            id: stream.id,
            sender: split[0],
            receiver: split[1],
            token: split[2],
          };
        });
        response = response.filter(
          (flow: Flow) => flow.currentFlowRate !== "0"
        );
        return response;
      });
    })();

    (async () => {
      const res = await flowsForCurrentUser();
      setIncomingFlows(() => {
        let response = res.data.streams.map((stream: any) => {
          const split: Array<string> = stream.id.split("-");
          return {
            currentFlowRate: stream.currentFlowRate,
            id: stream.id,
            sender: split[0],
            receiver: split[1],
            token: split[2],
          };
        });
        response = response.filter(
          (flow: Flow) => flow.currentFlowRate !== "0"
        );
        return response;
      });
    })();
  }, [initialized]);

  const { isConnected } = useAccount();
  const [connected, setIsConnected] = React.useState<boolean>(false);
  const [visible, setVisible] = React.useState(false);
  const [createdPayments, setCreatedPayments] = React.useState<
    IPaymentProps[] | null
  >([]);
  const [loading, setLoading] = React.useState<boolean>(false);
  const handler = () => setVisible(true);
  const closeHandler = () => setVisible(false);

  React.useEffect(() => {
    setIsConnected(isConnected);
  }, [isConnected]);

  const handleFinalSavePayments = async (payments: any) => {
    setLoading(true);
    try {
      if (payments?.length == 1) {
        await createNewFlow(
          payments[0].receiver,
          payments[0].flow_rate,
          "This is test description"
        );
      } else {
        const opsList = payments?.map((payment: IPaymentProps) => {
          const op = fdaix?.createFlow({
            sender: superSignerAddress!,
            receiver: payment.receiver,
            flowRate: payment.flow_rate.toString(),
            // userData: "This is test description",
          });
          return op;
        });

        await batchTransactions(opsList!);
      }
      setLoading(false);
    } catch (error) {
      console.log("ERROR WHILE CREATING PAYMENTS: ", error);
      setLoading(false);
    }
  };

  return connected ? (
    <div style={{ color: "red" }}>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          margin: "15px",
        }}
      >
        <div>
          <h1 style={{ color: "purple" }}>Making</h1>
          <h1 style={{ color: "orange" }}>Payments and Subscriptions</h1>
          <h1 style={{ color: "purple" }}>Easier</h1>
        </div>

        <Lottie
          options={{
            animationData: asset,
            autoplay: true,
            loop: true,
          }}
          height="40%"
          width="40%"
        />
        {/* <Text
          h1
          size={60}
          css={{
            textGradient: "45deg, $yellow600 -20%, $red600 100%",
            color: "white",
            
          }}
          weight="bold"
        >
          Some Random Text L
        </Text> */}
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
          paddingLeft: "30%",
          paddingRight: "30%",
        }}
      >
        <Button
          auto
          flat
          onPress={handler}
          style={{
            margin: "1%",
          }}
        >
          Create Payment
        </Button>
        <CreatePayment
          visible={visible}
          closeHandler={closeHandler}
          createdPayments={createdPayments}
          setCreatedPayments={setCreatedPayments}
          handleFinalSave={handleFinalSavePayments}
        />
        <>
          <FlowListModal
            title="My Streams"
            flows={outgoingFlows}
            setVisible={setVisibleOutgoingFlows}
            bindings={bindingsOutgoingFlows}
            initialized={initialized}
            incoming={false}
            setFlows={setOutgoingFlows}
          />
          <FlowListModal
            title="Incoming Streams"
            flows={incomingFlows}
            setVisible={setVisibleIncomingFlows}
            bindings={bindingsIncomingFlows}
            initialized={initialized}
            incoming={true}
            setFlows={setIncomingFlows}
          />
        </>
      </div>
    </div>
  ) : (
    <ConnectButton />
  );
}

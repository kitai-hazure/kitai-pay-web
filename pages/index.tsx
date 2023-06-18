import CreateFlow from "@/components/Superfluid/CreateFlow";
import CreatePayment from "@/components/create-payment";
import {
  Modal,
  Button,
  Text,
  Input,
  Row,
  Checkbox,
  useModal,
} from "@nextui-org/react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import React, { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { IPaymentProps } from "@/types/payments/payment.types";
import { useSuperfluid } from "@/providers/SuperfluidProvider";
import { Flow } from "@/types/flow";
import FlowListModal from "@/components/Superfluid/FlowListModal";

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
        return res.data.streams.map((stream: any) => {
          const split: Array<string> = stream.id.split("-");
          return {
            currentFlowRate: stream.currentFlowRate,
            id: stream.id,
            sender: split[0],
            receiver: split[1],
            token: split[2],
          };
        });
      });
    })();

    (async () => {
      const res = await flowsForCurrentUser();
      setIncomingFlows(() => {
        return res.data.streams.map((stream: any) => {
          const split: Array<string> = stream.id.split("-");
          return {
            currentFlowRate: stream.currentFlowRate,
            id: stream.id,
            sender: split[0],
            receiver: split[1],
            token: split[2],
          };
        });
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
    <div>
      <Button onPress={handler}>Create Payment</Button>
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
        />
        <FlowListModal
          title="Incoming Streams"
          flows={incomingFlows}
          setVisible={setVisibleIncomingFlows}
          bindings={bindingsIncomingFlows}
          initialized={initialized}
          incoming={true}
        />
      </>
    </div>
  ) : (
    <ConnectButton />
  );
}

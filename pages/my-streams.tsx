import FlowListModal from "@/components/Superfluid/FlowListModal";
import { useSuperfluid } from "@/providers/SuperfluidProvider";
import { Flow } from "@/types/flow";
import { useModal } from "@nextui-org/react";
import React, { useEffect, useState } from "react";

export default function MyStreams() {
  const { getSentFlowsForUser, initialized, flowsForCurrentUser } =
    useSuperfluid();
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

  return (
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
  );
}

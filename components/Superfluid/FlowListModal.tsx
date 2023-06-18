import { Flow } from "@/types/flow";
import { Button, Card, Loading, Modal, Text } from "@nextui-org/react";

const FlowCard = ({ flow, incoming }: { flow: Flow; incoming: boolean }) => {
  return (
    <Card css={{ mw: "600px" }} key={flow.id}>
      <Card.Body>
        <div style={{ display: "flex", flexDirection: "row" }}>
          <Text>{flow.currentFlowRate}</Text>
          <img
            style={{ marginLeft: "5px", marginTop: "7px" }}
            src="https://assets.coingecko.com/coins/images/9956/small/dai-multi-collateral-mcd.png?1574218774"
            width="15px"
            height="15px"
          />
          <Text style={{ marginLeft: "5px" }}>per month</Text>
        </div>
        {!incoming ? (
          <Text>To: {flow.receiver}</Text>
        ) : (
          <Text>From: {flow.sender}</Text>
        )}
      </Card.Body>
    </Card>
  );
};

const FlowListModal = ({
  flows,
  setVisible,
  bindings,
  initialized,
  title,
  incoming,
}: {
  flows: Flow[];
  setVisible: React.Dispatch<React.SetStateAction<boolean>>;
  bindings: any;
  initialized: boolean;
  title: string;
  incoming: boolean;
}) => {
  return (
    <>
      <Button auto flat onPress={() => setVisible(true)}>
        {title}
      </Button>
      <Modal
        scroll
        width="600px"
        closeButton
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
        {...bindings}
      >
        <Modal.Header>
          <Text id="modal-title" size={18}>
            {title}
          </Text>
        </Modal.Header>
        <Modal.Body>
          {(!initialized || flows.length === 0) && (
            <Loading color="secondary" />
          )}
          {flows.map((flow) => (
            <FlowCard key={flow.id} {...{ incoming, flow }} />
          ))}
        </Modal.Body>
        <Modal.Footer>
          <Button flat auto color="error" onPress={() => setVisible(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default FlowListModal;

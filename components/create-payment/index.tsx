import React from "react";
import { Modal, Button, Text, Input, Card, Spacer } from "@nextui-org/react";
import { IPaymentProps } from "@/types/payments/payment.types";

interface ICreatePaymentProps {
  visible: boolean;
  closeHandler: () => void;
  createdPayments?: IPaymentProps[] | null;
  setCreatedPayments?: React.Dispatch<
    React.SetStateAction<IPaymentProps[] | null>
  >;
  handleFinalSave?: any;
}
const CreatePayment = ({
  visible,
  closeHandler,
  createdPayments,
  setCreatedPayments,
  handleFinalSave,
}: ICreatePaymentProps) => {
  const [receiver, setReceiver] = React.useState<string | null>(null);
  const [flowRate, setFlowRate] = React.useState<number | null>(null);

  const handleAddPayment = () => {
    if (receiver === null || flowRate === null) {
      setCreatedPayments?.([
        {
          receiver: "Please Enter Receiver Address",
          flow_rate: -1,
        },
      ]);
    } else {
      const newPayments = createdPayments;
      newPayments?.pop();

      setCreatedPayments?.([
        ...newPayments!,
        {
          receiver,
          flow_rate: flowRate,
        },
        {
          receiver: "Please Enter Receiver Address",
          flow_rate: -1,
        },
      ]);
    }
  };

  const handleSavePayments = () => {
    // TODO -> SHOW ERROR IF NO PAYMENTS
    if (!createdPayments || createdPayments.length === 0) return;
    if (!receiver || !flowRate) return;
    const newPayments = createdPayments;
    // if (receiver && flowRate) {
    if (
      createdPayments[createdPayments.length - 1].receiver ===
        "Please Enter Receiver Address" &&
      createdPayments[createdPayments.length - 1].flow_rate === -1
    ) {
      newPayments.pop();
      newPayments.push({
        receiver,
        flow_rate: flowRate,
      });
    }
    // }

    // console.log("CREATED PAYMENTS BEFORE CALL: ", createdPayments);
    handleFinalSave?.(newPayments);
    closeHandler();
  };

  return (
    <div>
      <Modal
        closeButton
        aria-labelledby="Create Payments"
        open={visible}
        onClose={closeHandler}
        width="40%"
      >
        <Modal.Header>
          <Text id="modal-title" size={18}>
            Create{" "}
            <Text b size={18}>
              Payments
            </Text>
          </Text>
        </Modal.Header>
        <Modal.Body>
          {createdPayments && createdPayments.length > 0 ? (
            <div>
              {createdPayments.map((payment, index) => {
                return (
                  <Card style={{ marginBottom: "1rem" }}>
                    <Card.Body>
                      <Input
                        placeholder="Receiver Wallet Address"
                        defaultValue={
                          payment.receiver === "Please Enter Receiver Address"
                            ? ""
                            : payment.receiver
                        }
                        onChange={(e) => setReceiver(e.target.value)}
                      />
                      <Spacer y={1} />
                      <Input
                        placeholder="Flow Rate (Wei per month)"
                        defaultValue={
                          payment.flow_rate === -1 ? "" : payment.flow_rate
                        }
                        onChange={(e) => setFlowRate(parseInt(e.target.value))}
                      />
                    </Card.Body>
                  </Card>
                );
              })}
            </div>
          ) : (
            <Text h6 style={{ textAlign: "center" }}>
              You have no payments yet. Click the button below to create yours
            </Text>
          )}
        </Modal.Body>
        <Modal.Footer
          style={{
            width: "100%",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Button shadow color="primary" auto onPress={handleAddPayment}>
            Add Payment(s)
          </Button>
          <Button shadow color="primary" auto onPress={handleSavePayments}>
            Save Payment(s)
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default CreatePayment;

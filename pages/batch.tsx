const CONTRACT_ADDRESS = "0xbc1e4f34BA4B57218EbB8079a255a3A5CFE40280";
import RANDOM_CONTRACT from "../artifacts/Example.json";

const randomInterface = new ethers.utils.Interface(RANDOM_CONTRACT.abi);

import { Button, Grid } from "@nextui-org/react";
import { ethers } from "ethers";

export default function App() {
  return (
    <Grid.Container gap={2}>
      <Grid>
        <Button color="primary">Primary</Button>
      </Grid>
    </Grid.Container>
  );
}

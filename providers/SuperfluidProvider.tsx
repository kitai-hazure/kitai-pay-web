import { createContext, useContext, useEffect, useState } from "react";
import { Framework, SuperToken } from "@superfluid-finance/sdk-core";
import { ethers } from "ethers";
import { getProvider, fetchSigner } from "@wagmi/core";

interface SuperfluidContextType {
  sf: Framework | null;
  superSigner: ethers.Signer | null;
  fdaix: SuperToken | null;
}

const SuperfluidContext = createContext<SuperfluidContextType>({
  sf: null,
  superSigner: null,
  fdaix: null,
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

  useEffect(() => {
    async function initializeSuperfluid() {
      const provider = getProvider();
      const signer = await fetchSigner();
      const sfInstance = await Framework.create({
        chainId: 80001, // TODO: GET BASED ON CHAIN
        provider,
        resolverAddress: "0x8c54c83fbde3c59e59dd6e324531fb93d4f504d3",
      });

      if (!signer) return;
      const superSignerInstance = await sfInstance.createSigner({
        signer: signer!,
      });

      const fdaixInstance = await sfInstance.loadSuperToken(
        "0x5D8B4C2554aeB7e86F387B4d6c00Ac33499Ed01f"
      );

      setSuperfluid(sfInstance);
      setSuperSigner(superSignerInstance);
      setFDAIX(fdaixInstance);
    }

    if (window.ethereum) {
      initializeSuperfluid();
    }
  }, []);

  return (
    <SuperfluidContext.Provider value={{ sf, superSigner, fdaix }}>
      {children}
    </SuperfluidContext.Provider>
  );
}

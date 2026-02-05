import { BrowserProvider, JsonRpcSigner } from "ethers";

declare global {
  interface Window {
    ethereum?: any;
  }
}

export async function connectWallet(): Promise<{
  provider: BrowserProvider;
  signer: JsonRpcSigner;
  address: string;
}> {
  if (!window.ethereum) {
    throw new Error("MetaMask is not installed");
  }

  const provider = new BrowserProvider(window.ethereum);
  await provider.send("eth_requestAccounts", []);
  const signer = await provider.getSigner();
  const address = await signer.getAddress();

  return { provider, signer, address };
}

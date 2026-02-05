import { BrowserProvider, Contract } from "ethers";
import { PRICE_ROUTER_ABI, ERC20_ABI } from "./abis";

export async function executeSell(quote: any) {
  if (!window.ethereum) {
    throw new Error("MetaMask not installed");
  }

  if (!quote || !quote.tokenAmount) {
    throw new Error("Invalid sell quote");
  }

  const provider = new BrowserProvider(window.ethereum);
  const signer = await provider.getSigner();
  const user = await signer.getAddress();

  const routerAddress = process.env.NEXT_PUBLIC_PRICE_ROUTER!;
  const tokenAddress = process.env.NEXT_PUBLIC_TOKEN!;

  const token = new Contract(tokenAddress, ERC20_ABI, signer);
  const router = new Contract(routerAddress, PRICE_ROUTER_ABI, signer);

  // 1️⃣ Approve ETX if needed
  const allowance = await token.allowance(user, routerAddress);
  if (allowance < BigInt(quote.tokenAmount)) {
    const approveTx = await token.approve(routerAddress, quote.tokenAmount);
    await approveTx.wait(1);
  }

  // 2️⃣ Execute sell
  const tx = await router.sell(
    user,
    quote.tokenAmount,
    quote.usdcAmount,
    quote.expiry,
    quote.nonce,
    quote.signature
  );

  return await tx.wait(1);
}

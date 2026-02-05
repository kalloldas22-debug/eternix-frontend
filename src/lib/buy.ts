import { BrowserProvider, Contract } from "ethers";
import { PRICE_ROUTER_ABI, ERC20_ABI } from "./abis";

export async function executeBuy(amountIn: string, quote: any) {
  if (!window.ethereum) {
    throw new Error("MetaMask not installed");
  }

  // Wallet + signer
  const provider = new BrowserProvider(window.ethereum);
  const signer = await provider.getSigner();
  const user = await signer.getAddress();

  // Addresses
  const routerAddress = process.env.NEXT_PUBLIC_PRICE_ROUTER!;
  const usdcAddress = process.env.NEXT_PUBLIC_USDC!;

  // Contracts
  const usdc = new Contract(usdcAddress, ERC20_ABI, signer);
  const router = new Contract(routerAddress, PRICE_ROUTER_ABI, signer);

  /* =========================
     1️⃣ Approve USDC (if needed)
     ========================= */

  const allowance = await usdc.allowance(user, routerAddress);

  if (allowance < BigInt(quote.usdcAmount)) {
    const approveTx = await usdc.approve(
      routerAddress,
      quote.usdcAmount
    );
    await approveTx.wait(); // wait for approval
  }

  /* =========================
     2️⃣ Execute BUY on router
     ========================= */

  const tx = await router.buy(
    user,
    quote.tokenAmount,
    quote.usdcAmount,
    quote.expiry,
    quote.nonce,
    quote.signature
  );

  // Wait for confirmation
  const receipt = await tx.wait();

  /* =========================
     3️⃣ Return clean result
     ========================= */

  return {
    txHash: tx.hash,
    blockNumber: receipt.blockNumber,
    status: receipt.status
  };
}

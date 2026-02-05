export interface BuyQuote {
  price: string;
  amountOut: string;
  nonce: string;
  expiry: number;
  signature: string;
}

const BACKEND_BASE_URL = "http://localhost:4000"; // 👈 adjust if different

export async function fetchBuyQuote(
  buyer: string,
  amountIn: string
): Promise<BuyQuote> {
  const res = await fetch(`${BACKEND_BASE_URL}/buy-quote`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      buyer,
      amountIn,
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(err || "Failed to fetch buy quote");
  }

  return res.json();
}

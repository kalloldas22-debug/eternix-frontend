"use client";

import { useState } from "react";
import { executeBuy } from "@/lib/buy";
import { executeSell } from "@/lib/sell";

export default function Home() {
  const [amount, setAmount] = useState("1");
  const [sellAmount, setSellAmount] = useState("1");

  const [quote, setQuote] = useState<any>(null);
  const [sellQuote, setSellQuote] = useState<any>(null);

  const [address, setAddress] = useState<string>("");
  const [status, setStatus] = useState("");

  /* =========================
     WALLET
  ========================= */
  async function connectWallet() {
    if (!window.ethereum) {
      setStatus("MetaMask not installed");
      return;
    }

    const [account] = await window.ethereum.request({
      method: "eth_requestAccounts",
    });

    setAddress(account);
    setStatus(`Connected: ${account}`);
  }

  /* =========================
     BUY QUOTE
  ========================= */
  async function getQuote() {
    if (!address) {
      setStatus("Please connect wallet first");
      return;
    }

    setStatus("Fetching buy quote...");

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND}/buy-quote?ts=${Date.now()}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          buyer: address,
          amountIn: amount,
        }),
        cache: "no-store",
      }
    );

    const data = await res.json();
    setQuote(data);
    setStatus("Buy quote received");
  }

  /* =========================
     BUY EXECUTION
  ========================= */
  async function buy() {
    if (!quote) {
      setStatus("Get buy quote first");
      return;
    }

    try {
      setStatus("Executing buy...");

      const receipt = await executeBuy(amount, quote);

      setStatus(
        `Buy confirmed ✅
Tx: ${receipt.txHash}
Block: ${receipt.blockNumber}`
      );

      setQuote(null);          // 🔁 clear old quote
      await getQuote();        // 🔁 refresh price
    } catch (e: any) {
      console.error(e);
      setStatus(e.message ?? "Buy failed");
    }
  }

  /* =========================
     SELL QUOTE
  ========================= */
  async function getSellQuote() {
    if (!address) {
      setStatus("Please connect wallet first");
      return;
    }

    setStatus("Fetching sell quote...");

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND}/sell-quote?ts=${Date.now()}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          seller: address,
          amountIn: sellAmount,
        }),
        cache: "no-store",
      }
    );

    const data = await res.json();
    setSellQuote(data);
    setStatus("Sell quote received");
  }

  /* =========================
     SELL EXECUTION
  ========================= */
  async function sell() {
  try {
    if (!sellQuote) {
      setStatus("No sell quote available");
      return;
    }

    setStatus("Executing sell...");

    const receipt = await executeSell(sellQuote);

    setStatus(
      `Sell confirmed ✅
Tx: ${receipt.transactionHash}
Block: ${receipt.blockNumber}`
    );

    // 🔁 Refresh buy price after sell
    await getQuote();
  } catch (e: any) {
    console.error(e);
    setStatus(e.message ?? "Sell failed");
  }
}

  /* =========================
     UI
  ========================= */
  return (
    <main style={{ padding: 40 }}>
      <h1>Eternix dApp</h1>

      <button onClick={connectWallet}>
        {address ? "Wallet Connected" : "Connect Wallet"}
      </button>

      {address && <p style={{ fontSize: 12 }}>Connected: {address}</p>}

      <hr />

      <h2>Buy ETX</h2>

      <input
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        placeholder="Token amount"
      />

      <br /><br />

      <button onClick={getQuote}>Get Buy Quote</button>

      {quote && (
        <>
          <pre>{JSON.stringify(quote, null, 2)}</pre>
          <button onClick={buy}>Buy ETX</button>
        </>
      )}

      <hr style={{ margin: "40px 0" }} />

      <h2>Sell ETX</h2>

      <input
        value={sellAmount}
        onChange={(e) => setSellAmount(e.target.value)}
        placeholder="Sell amount"
      />

      <br /><br />

      <button onClick={getSellQuote}>Get Sell Quote</button>

      {sellQuote && (
        <>
          <pre>{JSON.stringify(sellQuote, null, 2)}</pre>
          <button onClick={sell}>Sell ETX</button>
        </>
      )}

      <p>{status}</p>
    </main>
  );
}

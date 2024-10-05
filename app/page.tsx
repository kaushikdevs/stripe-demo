"use client";
import { useState } from "react";

export default function Home() {
  const [accountHolderName, setAccountHolderName] = useState("");
  const [routingNumber, setRoutingNumber] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [amount, setAmount] = useState("");

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (loading) return;
    try {
      setLoading(true);

      // Step 1: Create bank token

      const data = {
        account_holder_name: accountHolderName,
        routing_number: routingNumber,
        account_number: accountNumber,
        account_holder_type: "individual",
      };

      const tokenResponse = await fetch(
        "/api/account/stripe/create-bank-token",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        }
      );

      const tokenData = await tokenResponse.json();
      const token = tokenData.token;

      // Step 2: Transfer funds
      const transferResponse = await fetch(
        "/api/account/stripe/transfer-funds",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token, amount: parseInt(amount) * 100 }), // Convert to cents
        }
      );

      const transferData = await transferResponse.json();
      if (transferResponse.ok) {
        alert("Funds transferred successfully");
      } else {
        alert("Transfer failed: " + transferData.error);
      }
    } catch (error) {
      console.log("payout error ====> ", error);
      alert("An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-screen h-screen flex items-center justify-center">
      <div className="border-[1px] p-8 rounded-lg w-full max-w-md">
        <form onSubmit={handleSubmit}>
          <h1 className="text-2xl font-semibold mb-6 text-center">
            Bank Transfer
          </h1>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">
              Account Holder Name:
            </label>
            <input
              className="w-full px-3 py-2 text-black border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
              type="text"
              placeholder="enter account holder name"
              value={accountHolderName}
              onChange={(e) => setAccountHolderName(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">
              Routing Number:
            </label>
            <input
              className="w-full px-3 py-2 text-black border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
              type="text"
              placeholder="enter account routing number"
              value={routingNumber}
              onChange={(e) => setRoutingNumber(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">
              Account Number:
            </label>
            <input
              className="w-full px-3 py-2 text-black border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
              type="text"
              placeholder="enter account number"
              value={accountNumber}
              onChange={(e) => setAccountNumber(e.target.value)}
              required
            />
          </div>
          <div className="mb-6">
            <label className="block text-sm font-medium mb-1">
              Amount (USD):
            </label>
            <input
              className="w-full px-3 py-2 text-black border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
              type="number"
              placeholder="enter amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition duration-300"
            disabled={loading}
          >
            {loading ? "Loading..." : "Transfer Funds"}
          </button>
        </form>
      </div>
    </div>
  );
}

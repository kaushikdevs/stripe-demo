import { Request, Response } from "express";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "");

export async function POST(request: Request, response: Response) {
  try {
    const { token, amount } = request.body;

    // Step 1: Create a connected account for the user (optional, depending on your business model)
    const account = await stripe.accounts.create({
      type: "custom",
      country: "US",
      capabilities: {
        transfers: { requested: true },
      },
    });

    // Step 2: Attach the bank account to the user's connected account
    const bankAccount = await stripe.accounts.createExternalAccount(
      account.id,
      { external_account: token }
    );

    // Step 3: Transfer funds (payout)
    const payout = await stripe.payouts.create({
      amount, // Amount in cents
      currency: "usd",
      destination: bankAccount.id, // The linked bank account ID
      source_type: "bank_account",
    });

    response.status(200).json({ payout });
  } catch (error: any) {
    response.status(500).json({ error: error.message });
  }
}

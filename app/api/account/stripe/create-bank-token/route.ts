import { Request, Response } from "express";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2024-09-30.acacia",
});

export async function POST(request: Request, response: Response) {
  try {
    const {
      account_holder_name,
      routing_number,
      account_number,
      account_holder_type,
    }: any = request.body;

    // Create a bank account token
    const token = await stripe.tokens.create({
      bank_account: {
        country: "US",
        currency: "usd",
        account_holder_name,
        account_holder_type,
        routing_number,
        account_number,
      },
    });

    response.status(200).json({ token: token });
  } catch (error: any) {
    response.status(500).json({ error: error.message });
  }
}

import { Request, Response } from "express";
import Razorpay from "razorpay";

// Initialize Razorpay instance
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || "",
  key_secret: process.env.RAZORPAY_KEY_SECRET || "",
});

export async function POST(request: Request, response: Response) {
  try {
    const { account_holder_name, account_number, ifsc_code, amount } =
      request.body;

    // Step 1: Create a contact for the payout recipient
  } catch (error: any) {
    response.status(500).json({ error: error.message });
  }
}

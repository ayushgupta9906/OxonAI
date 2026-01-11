import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: "2024-12-18.acacia",
});

export async function POST(req: NextRequest) {
    try {
        // In production, get customer ID from your database based on authenticated user
        // For demo, we'll create a new portal session

        const { customerId } = await req.json();

        // Create a Stripe Customer Portal session
        const session = await stripe.billingPortal.sessions.create({
            customer: customerId || "cus_demo", // Replace with actual customer ID from your DB
            return_url: `${process.env.NEXT_PUBLIC_BASE_URL}/billing`,
        });

        return NextResponse.json({ url: session.url });
    } catch (error: any) {
        console.error("Portal session error:", error);
        return NextResponse.json(
            { error: error.message },
            { status: 500 }
        );
    }
}

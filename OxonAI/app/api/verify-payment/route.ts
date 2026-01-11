import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: "2024-12-18.acacia",
});

export async function GET(req: NextRequest) {
    try {
        const sessionId = req.nextUrl.searchParams.get("session_id");

        if (!sessionId) {
            return NextResponse.json({ error: "No session ID" }, { status: 400 });
        }

        const session = await stripe.checkout.sessions.retrieve(sessionId);

        return NextResponse.json({
            status: session.payment_status,
            customerEmail: session.customer_email,
            planName: session.metadata?.planName,
            billingCycle: session.metadata?.billingCycle,
        });
    } catch (error: any) {
        console.error("Payment verification error:", error);
        return NextResponse.json(
            { error: error.message },
            { status: 500 }
        );
    }
}

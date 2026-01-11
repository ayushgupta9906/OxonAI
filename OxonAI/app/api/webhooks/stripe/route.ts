import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: "2024-12-18.acacia",
});

// Webhook to handle Stripe events
export async function POST(req: NextRequest) {
    const signature = req.headers.get("stripe-signature");

    if (!signature) {
        return NextResponse.json({ error: "No signature" }, { status: 400 });
    }

    try {
        const body = await req.text();
        const event = stripe.webhooks.constructEvent(
            body,
            signature,
            process.env.STRIPE_WEBHOOK_SECRET!
        );

        // Handle different event types
        switch (event.type) {
            case "checkout.session.completed":
                const session = event.data.object;
                console.log("Payment successful:", session.id);
                // Update your database: mark subscription as active
                break;

            case "customer.subscription.updated":
                const subscription = event.data.object;
                console.log("Subscription updated:", subscription.id);
                // Update subscription status in your database
                break;

            case "customer.subscription.deleted":
                const deletedSub = event.data.object;
                console.log("Subscription cancelled:", deletedSub.id);
                // Mark subscription as cancelled in your database
                break;

            case "invoice.payment_succeeded":
                const invoice = event.data.object;
                console.log("Payment succeeded:", invoice.id);
                // Update payment history in your database
                break;

            case "invoice.payment_failed":
                const failedInvoice = event.data.object;
                console.log("Payment failed:", failedInvoice.id);
                // Handle failed payment (send email, etc.)
                break;

            default:
                console.log(`Unhandled event type: ${event.type}`);
        }

        return NextResponse.json({ received: true });
    } catch (error: any) {
        console.error("Webhook error:", error.message);
        return NextResponse.json(
            { error: error.message },
            { status: 400 }
        );
    }
}

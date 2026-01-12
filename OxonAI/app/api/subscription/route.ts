export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";

export async function GET(req: NextRequest) {
    try {
        const stripe = getStripe();
        // In production: Get user ID from session/auth
        // const session = await getServerSession();
        // const userId = session?.user?.id;

        // For now, get from query params (replace with proper auth)
        const { searchParams } = new URL(req.url);
        const customerId = searchParams.get("customerId");

        if (!customerId) {
            return NextResponse.json({ subscription: null });
        }

        // Fetch customer's subscriptions from Stripe
        const subscriptions = await stripe.subscriptions.list({
            customer: customerId,
            status: "active",
            limit: 1,
        });

        if (subscriptions.data.length === 0) {
            return NextResponse.json({ subscription: null });
        }

        const sub = subscriptions.data[0];
        const product = await stripe.products.retrieve(
            sub.items.data[0].price.product as string
        );

        return NextResponse.json({
            subscription: {
                plan: product.name,
                status: sub.status,
                currentPeriodEnd: new Date(sub.current_period_end * 1000).toISOString(),
                cancelAtPeriodEnd: sub.cancel_at_period_end,
                customerId: sub.customer as string,
            },
        });
    } catch (error: any) {
        console.error("Subscription fetch error:", error);
        return NextResponse.json(
            { error: error.message, subscription: null },
            { status: 500 }
        );
    }
}

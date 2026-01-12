import Stripe from 'stripe';

let stripeInstance: Stripe | null = null;

export function getStripe(): Stripe {
    if (!stripeInstance) {
        if (!process.env.STRIPE_SECRET_KEY) {
            // During build time, we don't want to crash if it's just being imported
            // But we should throw if it's actually called and the key is missing
            throw new Error('STRIPE_SECRET_KEY environment variable is not set');
        }
        stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY, {
            apiVersion: '2025-02-24.acacia',
        });
    }
    return stripeInstance;
}

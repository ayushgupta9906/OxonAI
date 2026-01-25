# 🔐 Environment Configuration Guide

## Required API Keys

Add these to your `.env` file in the `OxonAI/` website folder:

```bash
# AI Provider Keys (Required for IDE Agent)
OPENAI_API_KEY=sk-...
GOOGLE_API_KEY=AIza...
OPENROUTER_API_KEY=sk-or-v1-...

# Stripe (Optional - for payments)
NEXT_PUBLIC_STRIPE_SEED_MONTHLY_PRICE_ID=price_xxx
NEXT_PUBLIC_STRIPE_SEED_YEARLY_PRICE_ID=price_xxx
NEXT_PUBLIC_STRIPE_EDGE_MONTHLY_PRICE_ID=price_xxx
NEXT_PUBLIC_STRIPE_EDGE_YEARLY_PRICE_ID=price_xxx
NEXT_PUBLIC_STRIPE_QUANTUM_MONTHLY_PRICE_ID=price_xxx
NEXT_PUBLIC_STRIPE_QUANTUM_YEARLY_PRICE_ID=price_xxx
STRIPE_SECRET_KEY=sk_test_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx

# Database
DATABASE_URL=mongodb+srv://...
```

## How to Get API Keys

### OpenRouter (Recommended - supports multiple models)
1. Go to https://openrouter.ai/
2. Sign up / Login
3. Go to Keys → Create New Key
4. Copy your key starting with `sk-or-v1-`

### Google (Gemini)
1. Go to https://makersuite.google.com/app/apikey
2. Create API Key
3. Copy key starting with `AIza`

### OpenAI (Optional)
1. Go to https://platform.openai.com/api-keys  
2. Create new secret key
3. Copy key starting with `sk-`

### Stripe (For Payments)
1. Go to https://dashboard.stripe.com/
2. Get your price IDs from Products section
3. Add webhook secret from Developers → Webhooks

## Testing Without Stripe

If you don't have Stripe configured, the pricing page will show a message. The IDE will still work!

## IDE Configuration

The IDE now uses **server-side API keys** automatically. Users don't need to enter keys!

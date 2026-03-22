# 🐼 Estranged Panda

> Wear What Defines You

Premium custom print clothing e-commerce store delivering across India.

## Tech Stack

- **Frontend** — React + TypeScript + Tailwind CSS + shadcn/ui
- **Database** — Supabase (PostgreSQL)
- **Auth** — Supabase Auth
- **Payments** — PhonePe
- **Notifications** — WhatsApp (WATI) + Email (Resend)
- **Vendor** — Printrove (Print on Demand)
- **Shipping** — Blue Dart

## Pages

| Route | Description |
|-------|-------------|
| `/` | Home — product catalog with category filters |
| `/product/:id` | Product detail — colour, size, quantity selector |
| `/checkout` | Delivery form + PhonePe payment |
| `/order-success` | Order confirmation with EP-2025-XXXX order number |
| `/login` | Customer login + register |
| `/my-orders` | Customer order history + tracking |
| `/admin` | Admin panel — orders, products, Blue Dart tracking |

## Environment Variables

```
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
VITE_ADMIN_PASSWORD=
RESEND_API_KEY=
WATI_API_KEY=
WATI_PHONE=
PHONEPE_MERCHANT_ID=
PHONEPE_SALT_KEY=
ADMIN_EMAIL=
ADMIN_WHATSAPP=
```

## Order Flow

1. Customer browses catalog → adds to cart
2. Checkout → fills delivery details → pays via PhonePe
3. Order saved to Supabase → Email + WhatsApp sent to customer and admin
4. Admin visits `/admin` → places order manually on Printrove
5. Admin enters Blue Dart tracking number → customer notified automatically

© 2025 Estranged Panda. All rights reserved.

# GlamSphere - AI-Powered Personalized Cosmetics Marketplace

A full-stack MERN application for a cosmetics marketplace with AI-assisted personalization, including a skin quiz, shade finder, recommendations, chatbot, and admin dashboard.

```text
glamsphere/
backend/     Node.js + Express + MongoDB API
frontend/    React + Vite + Tailwind CSS + Chart.js
```

## Prerequisites

- Node.js 18+
- MongoDB database, local or Atlas
- Optional Cloudinary account for image uploads
- Optional Razorpay or Stripe test keys for payments

## Backend Setup

```bash
cd backend
npm install
cp .env.example .env
# Edit .env and set at least MONGO_URI and JWT_SECRET
npm run seed
npm run dev
```

The backend runs on `http://localhost:5000`.

## Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

The frontend runs on `http://localhost:5173`.

The Vite dev server proxies `/api` requests to `http://localhost:5000`.

## Default Account

After seeding:

- Admin: `admin@glamsphere.com`
- Password: `Admin@12345`

Customers can register from the app.

## Key API Routes

| Area | Route prefix |
|---|---|
| Auth | `/api/auth` |
| Products | `/api/products` |
| Cart | `/api/cart` |
| Wishlist | `/api/wishlist` |
| Orders | `/api/orders` |
| Coupons | `/api/coupons` |
| Payments | `/api/payments` |
| AI features | `/api/ai` |
| Admin analytics | `/api/admin` |

## Deployment

### Backend

Deploy the `backend/` folder as a Node web service.

Set these environment variables in your hosting dashboard:

- `NODE_ENV=production`
- `MONGO_URI`
- `JWT_SECRET`
- `JWT_EXPIRES_IN=20d`
- `CLIENT_URL`, for example your deployed frontend URL

The health check route is `/api/health`.

### Frontend

Deploy the `frontend/` folder as a Vite app.

Set this environment variable:

- `VITE_API_URL=https://your-backend-url/api`

## Notes

- Product images upload through `POST /api/products/:id/images` and are stored in Cloudinary.
- The seeded catalog includes public product image URLs, so the storefront works without Cloudinary uploads.
- The chatbot currently uses a rule-based responder in `backend/utils/chatbotService.js`.

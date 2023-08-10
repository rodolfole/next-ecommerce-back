# E-Commerce Dashboard

<div align="center">

### <img src="https://raw.githubusercontent.com/rodolfole/next-ecommerce-back/main/app/favicon.ico" height="30px"/> [Ecommerce-Dashboard](https://next-ecommerce-back.vercel.app)

</div>

## Cloning the repository

```shell
git clone https://github.com/rodolfole/next-ecommerce-back.git
```

## Getting Started

Install the dependencies:

```sh
$ pnpm i
# or
$ yarn
# or
$ npm i
```

Setup .env file

```js
DATABASE_URL=
FRONTEND_STORE_URL=
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
MERCADO_PAGO_ACCESS_TOKEN=
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=
NEXTAUTH_SECRET=
STRIPE_API_KEY=
STRIPE_WEBHOOK_SECRET=
```

Config prisma

```sh
$ pnpm prisma generate
$ pnpm prisma db push
```

Start the app

```sh
$ pnpm dev
# or
$ yarn dev
# or
$ npm run dev
```

### To prove the purchase of products use the following cards:

- Mercado pago: https://www.mercadopago.com.mx/developers/es/docs/your-integrations/test/cards
- Stripe: https://stripe.com/docs/testing

## Built With

- Nextjs 13
- Prisma
- MySQL
- Tailwind
- Zustand

import { NextResponse } from "next/server";
import mercadopago from "mercadopago";
import { CreatePreferencePayload } from "mercadopago/models/preferences/create-payload.model";

import prismadb from "@/lib/prismadb";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

export async function POST(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  mercadopago.configure({
    access_token: process.env.MERCADO_PAGO_ACCESS_TOKEN!,
  });

  const { productIds } = await req.json();

  if (!productIds || productIds.length === 0) {
    return new NextResponse("Product ids are required", { status: 400 });
  }

  const products = await prismadb.product.findMany({
    where: {
      id: {
        in: productIds,
      },
    },
    include: { images: true },
  });

  const preference: CreatePreferencePayload = {
    auto_return: "approved",
    back_urls: {
      success: `${process.env.FRONTEND_STORE_URL}/cart?success=1`,
      failure: `${process.env.FRONTEND_STORE_URL}/cart?canceled=1`,
    },
    items: products.map((p) => ({
      currency_id: "MXN",
      id: p.id,
      picture_url: p.images[0].url,
      quantity: 1,
      title: p.name,
      unit_price: p.price.toNumber(),
    })),
    notification_url: `https://e7ea-45-188-167-170.ngrok-free.app/api/9767755d-07c2-4c4c-b32c-e291c0f6b7df/checkout/mercadopago/notify`,
  };

  const response = await mercadopago.preferences.create(preference);

  console.log({ preference, response });

  return NextResponse.json(
    { url: response.body.init_point },
    {
      headers: corsHeaders,
    }
  );
}

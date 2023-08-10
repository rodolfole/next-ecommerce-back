import { NextResponse } from "next/server";
import mercadopago from "mercadopago";

import prismadb from "@/lib/prismadb";

mercadopago.configure({
  access_token: process.env.MERCADO_PAGO_ACCESS_TOKEN!,
});

export async function POST(req: Request, { params }: { params: any }) {
  const { searchParams } = new URL(req.url);
  const topic = searchParams.get("topic") || undefined;
  const type = searchParams.get("type") || undefined;
  const topicType = topic || type;
  console.log("NOTIFY");

  console.log({ topic, type, topicType, searchParams });
  try {
    if (topicType && topicType === "payment") {
      const paymentId = searchParams.get("data.id") || searchParams.get("id");
      let payment = await mercadopago.payment.findById(Number(paymentId));
      let paymentStatus = payment.body.status;
      console.log({
        paymentId,
        charges: payment.body.charges_details,
        addi_info: payment.response.additional_info,
        items: payment.response.additional_info.items,
        tran_deta: payment.body.transaction_details,
        paymentStatus,
      });

      if (paymentStatus === "approved") {
        await prismadb.order.create({
          data: {
            storeId: params.storeId,
            isPaid: true,
            orderItems: {
              create: payment.response.additional_info.items.map(
                (product: any) => ({
                  product: {
                    connect: {
                      id: product.id,
                    },
                  },
                })
              ),
            },
          },
        });
      }
    }

    return NextResponse.json({
      type: topicType,
      ok: true,
    });
  } catch (error) {
    console.log("[MERCADOPAGO_NOTIFY_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

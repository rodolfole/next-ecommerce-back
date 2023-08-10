import { redirect } from "next/navigation";
import { ReactNode } from "react";

import Navbar from "@/components/navbar";
import prismadb from "@/lib/prismadb";
import getCurrentUser from "@/actions/getCurrentUser";

export default async function DashboardLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: { storeId: string };
}) {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  const store = await prismadb.store.findFirst({
    where: {
      id: params.storeId,
      userId: user.id,
    },
  });

  if (!store) {
    redirect("/");
  }

  return (
    <>
      <Navbar />
      {children}
    </>
  );
}

import { redirect } from "next/navigation";
import { ReactNode } from "react";

import getCurrentUser from "@/actions/getCurrentUser";
import prismadb from "@/lib/prismadb";

export default async function SetupLayout({
  children,
}: {
  children: ReactNode;
}) {
  const user = await getCurrentUser();

  if (!user?.id) {
    redirect("/login");
  }

  const store = await prismadb.store.findFirst({
    where: {
      userId: user.id,
    },
  });

  if (store) {
    redirect(`/${store.id}`);
  }

  return <>{children}</>;
}

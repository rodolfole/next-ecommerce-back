import { redirect } from "next/navigation";

import prismadb from "@/lib/prismadb";

import { SettingsForm } from "./components/SettingsForm";
import getCurrentUser from "@/actions/getCurrentUser";

const SettingsPage = async ({ params }: { params: { storeId: string } }) => {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/sign-in");
  }

  const store = await prismadb.store.findFirst({
    where: {
      id: params.storeId,
      userId: user.id,
    },
  });

  console.log(store);

  if (!store) {
    redirect("/");
  }

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <SettingsForm initialData={store} />
      </div>
    </div>
  );
};

export default SettingsPage;

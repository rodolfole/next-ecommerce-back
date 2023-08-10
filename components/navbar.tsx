import { redirect } from "next/navigation";

import getCurrentUser from "@/actions/getCurrentUser";
import { MainNav } from "@/components/MainNav";
import StoreSwitcher from "@/components/StoreSwitcher";
import { ThemeToggle } from "@/components/ThemeToggle";
import prismadb from "@/lib/prismadb";
import UserMenu from "./UserMenu";

const Navbar = async () => {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  const stores = await prismadb.store.findMany({
    where: {
      userId: user.id,
    },
  });

  return (
    <div className="border-b">
      <div className="flex h-16 items-center px-4">
        <StoreSwitcher items={stores} />
        <MainNav className="mx-6" />
        <div className="ml-auto flex items-center space-x-4">
          <ThemeToggle />
          <UserMenu />
        </div>
      </div>
    </div>
  );
};

export default Navbar;

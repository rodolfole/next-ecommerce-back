import { format } from "date-fns";

import prismadb from "@/lib/prismadb";
import { formatter } from "@/lib/utils";

import { ProductsClient } from "./components/Client";
import { ProductColumn } from "./components/Columns";

const ProductsPage = async ({ params }: { params: { storeId: string } }) => {
  const products = await prismadb.product.findMany({
    where: {
      storeId: params.storeId,
    },
    include: {
      category: true,
      colors: true,
      sizes: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const formattedProducts: ProductColumn[] = products.map((item) => ({
    category: item.category.name,
    colors: item.colors.map((color) => color.url),
    createdAt: format(item.createdAt, "MMMM do, yyyy"),
    id: item.id,
    isArchived: item.isArchived,
    isFeatured: item.isFeatured,
    name: item.name,
    price: formatter.format(item.price.toNumber()),
    sizes: item.sizes.map((size) => size.name),
  }));

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <ProductsClient data={formattedProducts} />
      </div>
    </div>
  );
};

export default ProductsPage;

"use client";

import { useParams, useRouter } from "next/navigation";
import { FC } from "react";
import { LuPlus } from "react-icons/lu";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Heading } from "@/components/ui/Heading";
import { DataTable } from "@/components/ui/DataTable";
import { BillboardColumn, columns } from "./Columns";
import { ApiList } from "@/components/ui/ApiList";

interface BillboardClientProps {
  data: BillboardColumn[];
}

export const BillboardClient: FC<BillboardClientProps> = ({ data }) => {
  const params = useParams();
  const router = useRouter();

  return (
    <>
      <div className="flex items-center justify-between">
        <Heading
          title={`Billboards (${data.length})`}
          description="Manage billboards for your store"
        />
        <Button
          onClick={() => router.push(`/${params.storeId}/billboards/new`)}
        >
          <LuPlus className="mr-2 h-4 w-4" /> Add New
        </Button>
      </div>
      <Separator />
      <DataTable searchKey="label" columns={columns} data={data} />
      <Heading title="API" description="API Calls for Billboards" />
      <Separator />
      <ApiList entityName="billboards" entityIdName="billboardId" />
    </>
  );
};

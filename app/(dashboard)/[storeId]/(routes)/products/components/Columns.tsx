"use client";

import { ColumnDef } from "@tanstack/react-table";

import { CellAction } from "./CellAction";
import Image from "next/image";

export type ProductColumn = {
  id: string;
  name: string;
  price: string;
  category: string;
  sizes: string[];
  colors: string[];
  createdAt: string;
  isFeatured: boolean;
  isArchived: boolean;
};

export const columns: ColumnDef<ProductColumn>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "isArchived",
    header: "Archived",
  },
  {
    accessorKey: "isFeatured",
    header: "Featured",
  },
  {
    accessorKey: "price",
    header: "Price",
  },
  {
    accessorKey: "category",
    header: "Category",
  },
  {
    accessorKey: "sizes",
    header: "Sizes",
  },
  {
    accessorKey: "colors",
    header: "Colors",
    cell: ({ row }) => (
      <div className="flex items-center gap-x-2">
        {row.original.colors.map((url, index) => (
          <Image
            alt="Color image"
            className="h-12 w-12"
            key={index.toString()}
            src={url}
            width={50}
            height={50}
          />
        ))}
      </div>
    ),
  },
  {
    accessorKey: "createdAt",
    header: "Date",
  },
  {
    id: "actions",
    cell: ({ row }) => <CellAction data={row.original} />,
  },
];

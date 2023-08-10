"use client";

import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import { Billboard, Category } from "@prisma/client";
import { FC, useState } from "react";
import { FieldValues, useController, useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { LuTrash } from "react-icons/lu";
import Select from "react-select";

import Input from "@/components/Input";
import { AlertModal } from "@/components/modals/AlertModal";
import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/Heading";
import { Separator } from "@/components/ui/separator";

interface CategoryFormProps {
  initialData: Category | null;
  billboards: Billboard[];
}

export const CategoryForm: FC<CategoryFormProps> = ({
  initialData,
  billboards,
}) => {
  const params = useParams();
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const title = initialData ? "Edit category" : "Create category";
  const description = initialData ? "Edit a category." : "Add a new category";
  const toastMessage = initialData ? "Category updated." : "Category created.";
  const action = initialData ? "Save changes" : "Create";

  const billboardOpts = billboards.map(({ id, label }) => ({
    label,
    value: id,
  }));

  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FieldValues>({
    defaultValues: initialData || {
      name: "",
      billboardId: "",
    },
    mode: "onTouched",
  });

  const { field: billboardId } = useController({
    name: "billboardId",
    control,
  });

  const onSubmit = async (data: FieldValues) => {
    try {
      setIsLoading(true);
      if (initialData) {
        await axios.patch(
          `/api/${params.storeId}/categories/${params.categoryId}`,
          data
        );
      } else {
        await axios.post(`/api/${params.storeId}/categories`, data);
      }
      router.refresh();
      router.push(`/${params.storeId}/categories`);
      toast.success(toastMessage);
    } catch (error: any) {
      toast.error("Something went wrong.");
    } finally {
      setIsLoading(false);
    }
  };

  const onDelete = async () => {
    try {
      setIsLoading(true);
      await axios.delete(
        `/api/${params.storeId}/categories/${params.categoryId}`
      );
      router.refresh();
      router.push(`/${params.storeId}/categories`);
      toast.success("Category deleted.");
    } catch (error: any) {
      toast.error(
        "Make sure you removed all products using this category first."
      );
    } finally {
      setIsLoading(false);
      setOpen(false);
    }
  };

  const handleSelectChange = (option: any) => {
    billboardId.onChange(option.value);
  };

  return (
    <>
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={onDelete}
        loading={isLoading}
      />
      <div className="flex items-center justify-between">
        <Heading title={title} description={description} />
        {initialData && (
          <Button
            disabled={isLoading}
            variant="destructive"
            size="sm"
            onClick={() => setOpen(true)}
          >
            <LuTrash className="h-4 w-4" />
          </Button>
        )}
      </div>
      <Separator />
      <div className="md:grid md:grid-cols-3 gap-8">
        <Input
          disabled={isLoading}
          errors={errors}
          id="name"
          label="Name"
          placeholder="Category name"
          register={register}
          required
        />

        <Select
          className="react-select"
          id="select-billboard"
          instanceId="select-billboard"
          onChange={handleSelectChange}
          options={billboardOpts}
          value={billboardOpts.find(({ value }) => value === billboardId.value)}
        />
      </div>
      <Button
        className="ml-auto"
        disabled={isLoading}
        onClick={handleSubmit(onSubmit)}
      >
        {action}
      </Button>
    </>
  );
};

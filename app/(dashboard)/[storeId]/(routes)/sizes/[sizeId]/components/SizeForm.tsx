"use client";

import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import { Size } from "@prisma/client";
import { FC, useState } from "react";
import { FieldValues, useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { LuTrash } from "react-icons/lu";

import Input from "@/components/Input";
import { AlertModal } from "@/components/modals/AlertModal";
import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/Heading";
import { Separator } from "@/components/ui/separator";

interface SizeFormProps {
  initialData: Size | null;
}

export const SizeForm: FC<SizeFormProps> = ({ initialData }) => {
  const params = useParams();
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const title = initialData ? "Edit size" : "Create size";
  const description = initialData ? "Edit a size." : "Add a new size";
  const toastMessage = initialData ? "Size updated." : "Size created.";
  const action = initialData ? "Save changes" : "Create";

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FieldValues>({
    defaultValues: initialData || {
      name: "",
      value: "",
    },
    mode: "onTouched",
  });

  const onSubmit = async (data: FieldValues) => {
    try {
      setIsLoading(true);
      if (initialData) {
        await axios.patch(
          `/api/${params.storeId}/sizes/${params.sizeId}`,
          data
        );
      } else {
        await axios.post(`/api/${params.storeId}/sizes`, data);
      }
      router.refresh();
      router.push(`/${params.storeId}/sizes`);
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
      await axios.delete(`/api/${params.storeId}/sizes/${params.sizeId}`);
      router.refresh();
      router.push(`/${params.storeId}/sizes`);
      toast.success("Size deleted.");
    } catch (error: any) {
      toast.error("Make sure you removed all products using this size first.");
    } finally {
      setIsLoading(false);
      setOpen(false);
    }
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
          placeholder="Size name"
          register={register}
          required
        />
        <Input
          disabled={isLoading}
          errors={errors}
          id="value"
          label="Value"
          placeholder="Size value"
          register={register}
          required
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

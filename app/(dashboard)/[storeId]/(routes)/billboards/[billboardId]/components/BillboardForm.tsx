"use client";

import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import { Billboard } from "@prisma/client";
import { FC, useState } from "react";
import { FieldValues, useController, useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { LuTrash } from "react-icons/lu";

import Input from "@/components/Input";
import { AlertModal } from "@/components/modals/AlertModal";
import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/Heading";
import ImageUpload from "@/components/ui/ImageUpload";
import { Separator } from "@/components/ui/separator";

interface BillboardFormProps {
  initialData: Billboard | null;
}

export const BillboardForm: FC<BillboardFormProps> = ({ initialData }) => {
  const params = useParams();
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const title = initialData ? "Edit billboard" : "Create billboard";
  const description = initialData ? "Edit a billboard." : "Add a new billboard";
  const toastMessage = initialData
    ? "Billboard updated."
    : "Billboard created.";
  const action = initialData ? "Save changes" : "Create";

  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FieldValues>({
    defaultValues: initialData || {
      label: "",
      imageUrl: "",
    },
    mode: "onTouched",
  });

  const { field: imageUrl } = useController({ name: "imageUrl", control });

  const onSubmit = async (data: FieldValues) => {
    try {
      setIsLoading(true);
      if (initialData) {
        await axios.patch(
          `/api/${params.storeId}/billboards/${params.billboardId}`,
          data
        );
      } else {
        await axios.post(`/api/${params.storeId}/billboards`, data);
      }
      router.refresh();
      router.push(`/${params.storeId}/billboards`);
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
        `/api/${params.storeId}/billboards/${params.billboardId}`
      );
      router.refresh();
      router.push(`/${params.storeId}/billboards`);
      toast.success("Billboard deleted.");
    } catch (error: any) {
      toast.error(
        "Make sure you removed all categories using this billboard first."
      );
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
        <ImageUpload
          value={imageUrl.value ? [imageUrl.value] : []}
          disabled={isLoading}
          onChange={(url) => imageUrl.onChange(url)}
          onRemove={() => imageUrl.onChange("")}
        />
        <Input
          disabled={isLoading}
          errors={errors}
          id="label"
          label="Label"
          placeholder="Billboard label"
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

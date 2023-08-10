"use client";

import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import { Store } from "@prisma/client";
import { FC, useState } from "react";
import { FieldValues, useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { LuTrash } from "react-icons/lu";

import Input from "@/components/Input";
import { AlertModal } from "@/components/modals/AlertModal";
import { ApiAlert } from "@/components/ui/ApiAlert";
import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/Heading";
import { Separator } from "@/components/ui/separator";
import { useOrigin } from "@/hooks/useOrigin";

interface SettingsFormProps {
  initialData: Store;
}

export const SettingsForm: FC<SettingsFormProps> = ({ initialData }) => {
  const params = useParams();
  const router = useRouter();
  const origin = useOrigin();

  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FieldValues>({
    defaultValues: initialData || {
      name: "",
      web: "",
    },
    mode: "onTouched",
  });

  const onSubmit = async (data: FieldValues) => {
    try {
      setIsLoading(true);
      await axios.patch(`/api/stores/${params.storeId}`, data);
      router.refresh();
      toast.success("Store updated.");
    } catch (error: any) {
      toast.error("Something went wrong.");
    } finally {
      setIsLoading(false);
    }
  };

  const onDelete = async () => {
    try {
      setIsLoading(true);
      await axios.delete(`/api/stores/${params.storeId}`);
      router.refresh();
      router.push("/");
      toast.success("Store deleted.");
    } catch (error: any) {
      toast.error("Make sure you removed all products and categories first.");
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
        <Heading
          title="Store settings"
          description="Manage store preferences"
        />
        <Button
          disabled={isLoading}
          variant="destructive"
          size="sm"
          onClick={() => setOpen(true)}
        >
          <LuTrash className="h-4 w-4" />
        </Button>
      </div>
      <Separator />
      <div className="md:grid md:grid-cols-3 gap-8">
        <Input
          disabled={isLoading}
          errors={errors}
          id="name"
          label="Name"
          placeholder="Store Name"
          register={register}
          required
        />

        <Input
          disabled={isLoading}
          errors={errors}
          id="web"
          label="Website"
          placeholder="Store web"
          register={register}
          required
        />
      </div>
      <Button
        className="ml-auto"
        disabled={isLoading}
        onClick={handleSubmit(onSubmit)}
      >
        Save changes
      </Button>
      <Separator />

      <ApiAlert
        title="NEXT_PUBLIC_API_URL"
        variant="public"
        description={`${origin}/api/${params.storeId}`}
      />
    </>
  );
};

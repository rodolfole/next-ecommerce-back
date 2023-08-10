"use client";

import axios from "axios";
import { useState } from "react";
import { FieldValues, useForm } from "react-hook-form";
import { toast } from "react-hot-toast";

import Input from "@/components/Input";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { useStoreModal } from "@/hooks/useStoreModal";

export const StoreModal = () => {
  const storeModal = useStoreModal();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FieldValues>({
    defaultValues: {
      name: "",
    },
    mode: "onTouched",
  });

  const onSubmit = async (values: FieldValues) => {
    try {
      setIsLoading(true);
      const response = await axios.post("/api/stores", values);
      window.location.assign(`/${response.data.id}`);
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      title="Create store"
      description="Add a new store to manage products and categories."
      isOpen={storeModal.isOpen}
      onClose={storeModal.onClose}
    >
      <div>
        <div className="space-y-4 py-2 pb-4">
          <div className="space-y-2">
            <Input
              disabled={isLoading}
              errors={errors}
              id="name"
              label="Name"
              placeholder="E-Commerce Name"
              register={register}
              required
            />
            <div className="pt-6 space-x-2 flex items-center justify-end w-full">
              <Button
                disabled={isLoading}
                variant="outline"
                onClick={storeModal.onClose}
              >
                Cancel
              </Button>
              <Button disabled={isLoading} onClick={handleSubmit(onSubmit)}>
                Continue
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};

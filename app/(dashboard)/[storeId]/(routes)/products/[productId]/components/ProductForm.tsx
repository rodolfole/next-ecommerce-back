"use client";

import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import { Category, Color, Image, Product, Size } from "@prisma/client";
import { FC, useEffect, useState } from "react";
import {
  FieldValues,
  SubmitHandler,
  useController,
  useFieldArray,
  useForm,
} from "react-hook-form";
import { toast } from "react-hot-toast";
import { LuTrash } from "react-icons/lu";
import Select from "react-select";

import Input from "@/components/Input";
import { AlertModal } from "@/components/modals/AlertModal";
import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/Heading";
import ImageUpload from "@/components/ui/ImageUpload";
import { Separator } from "@/components/ui/separator";
import Checkbox from "@/components/Checkbox";
import MultiTag from "./MultiTag";

interface ProductFormProps {
  initialData:
    | (Product & {
        images: Image[];
      } & {
        sizes: Size[];
      })
    | null;
  categories: Category[];
  colors: Color[];
  sizes: Size[];
}

const ProductForm: FC<ProductFormProps> = ({
  initialData,
  categories,
  sizes: sizesDB,
}) => {
  const params = useParams();
  const router = useRouter();

  const [open, setOpen] = useState(false);

  const [updateData, setUpdateData] = useState<any>([]);

  const title = initialData ? "Edit product" : "Create product";
  const description = initialData ? "Edit a product." : "Add a new product";
  const toastMessage = initialData ? "Product updated." : "Product created.";
  const action = initialData ? "Save changes" : "Create";

  const [isLoading, setIsLoading] = useState(false);
  const categoresOpts = categories.map(({ id, name }) => ({
    label: name,
    value: id,
  }));

  const sizesOpts = sizesDB.map(({ id, name }) => ({
    label: name,
    value: id,
  }));

  const defaultValues = initialData
    ? {
        ...initialData,
        price: parseFloat(String(initialData?.price)),
      }
    : {
        categoryId: "",
        colors: [],
        description: "",
        images: [],
        isArchived: false,
        isFeatured: false,
        name: "",
        price: 0,
        sizes: [],
        stock: 0,
      };

  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FieldValues>({
    defaultValues,
    mode: "onTouched",
  });

  const { field: categoryId } = useController({ name: "categoryId", control });
  const { field: sizes } = useController({ name: "sizes", control });

  const { field: colors } = useController({ name: "colors", control });
  const { fields, append, remove } = useFieldArray({
    name: "colors",
    control,
  });

  const { field: images } = useController({ name: "images", control });

  const handleSelectChange = (option: any) => {
    categoryId.onChange(option.value);
  };

  const handleSizeChange = (option: any) => {
    const sizesOpts = option?.map((opt: any) => ({ sizeId: opt.value }));

    sizes.onChange(sizesOpts);
    setUpdateData(option);
  };

  const handleRemoveChange = (index: number) => {
    colors.onChange([
      ...colors.value?.filter(
        (current: any) => current.url !== colors.value[index].url
      ),
    ]);
  };

  const handleRemoveImgView = (newColors: any, index: number): string[] => {
    if (newColors?.every((color: any) => color.hasOwnProperty("url")))
      return [newColors[index]?.url];
    else return [];
  };

  const onDelete = async () => {
    try {
      setIsLoading(true);
      await axios.delete(`/api/${params.storeId}/products/${params.productId}`);
      router.refresh();
      router.push(`/${params.storeId}/products`);
      toast.success("Product deleted.");
    } catch (error: any) {
      toast.error("Something went wrong.");
    } finally {
      setIsLoading(false);
      setOpen(false);
    }
  };

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    try {
      setIsLoading(true);
      if (initialData) {
        console.log({ updatedData: data });

        await axios.patch(
          `/api/${params.storeId}/products/${params.productId}`,
          { ...data, stock: parseInt(data.stock) }
        );
      } else {
        console.log({ createdData: data });

        await axios.post(`/api/${params.storeId}/products`, {
          ...data,
          stock: parseInt(data.stock),
        });
      }
      router.refresh();
      router.push(`/${params.storeId}/products`);
      toast.success(toastMessage);
    } catch (error: any) {
      toast.error("Something went wrong.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (initialData?.sizes) {
      setUpdateData(
        initialData?.sizes.map((size) => ({ label: size.name, value: size.id }))
      );
    }
  }, [initialData?.sizes]);

  console.log({ defaultValues });

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
      <div>
        <label
          className={`
          font-medium
          text-sm
        `}
        >
          Images
        </label>
        <ImageUpload
          value={images.value.map((image: any) => image.url)}
          onChange={(url) => {
            images.onChange([...images.value, { url }]);
          }}
          onRemove={(url) =>
            images.onChange([
              ...images.value.filter((current: any) => current.url !== url),
            ])
          }
        />
      </div>

      <div className="md:grid md:grid-cols-3 gap-8">
        <Input
          disabled={isLoading}
          errors={errors}
          id="name"
          label="Name"
          placeholder="Product name"
          register={register}
          required
        />

        <Input
          disabled={isLoading}
          errors={errors}
          id="price"
          label="Price"
          register={register}
          required
          type="number"
        />

        <Select
          className="react-select"
          id="select-categories"
          instanceId="select-categories"
          onChange={handleSelectChange}
          options={categoresOpts}
          value={categoresOpts.find(({ value }) => value === categoryId.value)}
        />

        <MultiTag
          value={updateData}
          id="select-sizes"
          onChange={handleSizeChange}
          options={sizesOpts}
        />

        <Input
          disabled={isLoading}
          errors={errors}
          id="description"
          label="Description"
          placeholder="Description"
          register={register}
          required={false}
        />

        <Input
          disabled={isLoading}
          errors={errors}
          id="stock"
          label="Stock"
          placeholder="Stock"
          register={register}
          required
          type="number"
        />

        <div className="flex flex-col items-start rounded-md border py-4 px-10">
          <Checkbox
            disabled={isLoading}
            errors={errors}
            id="isFeatured"
            label="Featured"
            register={register}
          />
          <p className="text-sm text-muted-foreground">
            This product will appear on the home page
          </p>
        </div>

        <div className="flex flex-col items-start rounded-md border py-4 px-10">
          <Checkbox
            disabled={isLoading}
            errors={errors}
            id="isArchived"
            label="Archived"
            register={register}
          />
          <p className="text-sm text-muted-foreground">
            This product will not appear anywhere in the store
          </p>
        </div>
      </div>

      <div className="md:grid md:grid-cols-3 gap-8">
        <div>
          <label>Colors</label>
          <div>
            {fields.map((field, index) => (
              <div className="form-control" key={field.id}>
                <Input
                  disabled={isLoading}
                  errors={errors}
                  id={`colors.${index}.name` as const}
                  label="Name"
                  register={register}
                  required
                />
                <ImageUpload
                  value={handleRemoveImgView(colors.value, index)}
                  onChange={(url) => {
                    const colorsArr = [...colors.value];
                    colorsArr[index] = { ...colorsArr[index], url };
                    colors.onChange([...colorsArr]);
                  }}
                  onRemove={(url) => {
                    const newColors = colors.value?.map((color: any) => {
                      color.url === url && delete color.url;
                      return color;
                    });
                    handleRemoveImgView(newColors, index);
                  }}
                />

                {index > 0 && (
                  <button
                    type="button"
                    onClick={() => {
                      handleRemoveChange(index);
                      remove(index);
                    }}
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={() =>
                append({
                  name: "",
                  url: "",
                })
              }
            >
              Add color
            </button>
          </div>
        </div>
      </div>

      <Button
        className="ml-auto"
        disabled={
          colors.value?.length === 0 &&
          colors.value?.every((color: any) => color.hasOwnProperty("url"))
        }
        onClick={handleSubmit(onSubmit)}
      >
        {action}
      </Button>
    </>
  );
};

export default ProductForm;

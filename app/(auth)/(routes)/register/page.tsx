"use client";

import axios from "axios";
import { useRouter } from "next/navigation";
import { signIn, useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { toast } from "react-hot-toast";

import RegisterForm from "./RegisterForm";

const RegisterPage = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const session = useSession();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FieldValues>({
    defaultValues: {
      confirm_password: "",
      email: "",
      name: "",
      password: "",
    },
  });

  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    setIsLoading(true);

    const { confirm_password, ...credentials } = data;

    axios
      .post("/api/register", credentials)
      .then(() =>
        signIn("credentials", {
          ...data,
          redirect: false,
        })
      )
      .then((callback) => {
        if (callback?.error) {
          toast.error("Invalid credentials!");
        }

        if (callback?.ok) {
          router.push("/");
        }
      })
      .catch(() => toast.error("Something went wrong!"))
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    if (session?.status === "authenticated") {
      router.replace("/");
    }
  }, [session?.status, router]);

  return (
    <RegisterForm
      disabled={isLoading}
      errors={errors}
      onSubmit={handleSubmit(onSubmit)}
      register={register}
    />
  );
};

export default RegisterPage;

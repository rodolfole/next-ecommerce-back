import { signIn } from "next-auth/react";
import React, { FC } from "react";
import { FieldErrors, FieldValues, UseFormRegister } from "react-hook-form";
import { FcGoogle } from "react-icons/fc";

import Button from "@/components/Button";
import Input from "@/components/Input";

interface RegisterFormProps {
  disabled: boolean;
  errors: FieldErrors<FieldValues>;
  onSubmit: () => void;
  register: UseFormRegister<FieldValues>;
}

const RegisterForm: FC<RegisterFormProps> = ({
  disabled,
  errors,
  onSubmit,
  register,
}) => {
  return (
    <>
      <div className="text-center">
        <h1 className="block text-2xl font-bold text-gray-800 dark:text-white">
          Sign up
        </h1>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
          Already have an account?
          <a
            className="text-blue-600 decoration-2 hover:underline font-medium"
            href="/login"
          >
            Sign in here
          </a>
        </p>
      </div>

      <div className="mt-5">
        <Button disabled={disabled} onClick={() => signIn("google")}>
          <FcGoogle className="h-4 w-4" />
          Sign up with Google
        </Button>

        <div className="py-3 flex items-center text-xs text-gray-400 uppercase before:flex-[1_1_0%] before:border-t before:border-gray-200 before:mr-6 after:flex-[1_1_0%] after:border-t after:border-gray-200 after:ml-6 dark:text-gray-500 dark:before:border-gray-600 dark:after:border-gray-600">
          Or
        </div>

        <form>
          <div className="grid gap-y-4">
            <Input
              errors={errors}
              id="email"
              label="Email address"
              name="email"
              register={register}
              required
              type="email"
            />

            <Input
              errors={errors}
              id="name"
              label="Name"
              name="name"
              register={register}
              required
              type="text"
            />

            <Input
              errors={errors}
              id="password"
              label="Password"
              name="password"
              register={register}
              required
              type="password"
            />

            <Input
              errors={errors}
              id="confirm_password"
              label="Confirm Password"
              name="confirm_password"
              register={register}
              required
              type="password"
            />

            <Button disabled={disabled} onClick={onSubmit}>
              Sign up
            </Button>
          </div>
        </form>
      </div>
    </>
  );
};

export default RegisterForm;

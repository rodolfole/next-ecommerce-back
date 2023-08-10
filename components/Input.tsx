import { forwardRef, InputHTMLAttributes } from "react";
import { FieldErrors, FieldValues, UseFormRegister } from "react-hook-form";
import { BiDollar } from "react-icons/bi";

import { cn } from "@/lib/utils";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  errors: FieldErrors;
  formatPrice?: boolean;
  label: string;
  register: UseFormRegister<FieldValues>;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      disabled,
      errors,
      formatPrice,
      id,
      label,
      register,
      required,
      type,
      ...props
    },
    ref
  ) => {
    return (
      <div className="relative w-full space-y-2">
        {formatPrice && (
          <BiDollar
            size={24}
            className="
          absolute
          left-2
            text-neutral-700
            top-5
          "
          />
        )}
        <label
          className={`
          font-medium
          text-sm
          ${formatPrice ? "left-9" : "left-4"}
          ${errors[id!] ? "text-rose-500" : "text-zinc-400"}
        `}
          htmlFor={id}
        >
          {label}
        </label>
        <input
          className={cn(
            "bg-background border border-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-ring h-10 placeholder:text-muted-foreground px-3 py-2 ring-offset-background rounded-md text-sm w-full",
            className,
            errors[id!] && "border-rose-600 focus:border-rose-500"
          )}
          disabled={disabled}
          {...register(id!, { required })}
          {...props}
          type={type}
        />
      </div>
    );
  }
);

Input.displayName = "Input";

export default Input;

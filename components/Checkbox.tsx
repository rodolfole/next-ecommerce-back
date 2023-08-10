import { forwardRef, InputHTMLAttributes } from "react";
import { FieldErrors, FieldValues, UseFormRegister } from "react-hook-form";

export interface CheckboxProps extends InputHTMLAttributes<HTMLInputElement> {
  errors: FieldErrors;
  label: string;
  register: UseFormRegister<FieldValues>;
}

const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  (
    { disabled, errors, id, label, register, required, value, ...props },
    ref
  ) => {
    return (
      <div>
        <input
          {...register(id!, { required })}
          className="
          -ml-[1.5rem]
          appearance-none
          border
          border-neutral-300
          border-primary
          border-solid
          checked:bg-primary
          checked:text-primary
          float-left
          h-[1.125rem]
          mr-[6px]
          mt-[0.15rem]
          outline-none
          relative
          ring-offset-background
          rounded-[0.25rem]
          w-[1.125rem]
        "
          id={id}
          type="checkbox"
          value={value}
        />
        <label
          className="inline-block pl-[0.15rem] hover:cursor-pointer"
          htmlFor={id}
        >
          {label}
        </label>
      </div>
    );
  }
);

Checkbox.displayName = "Checkbox";

export default Checkbox;

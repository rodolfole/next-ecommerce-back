"use client";

import { ButtonHTMLAttributes, FC, MouseEvent } from "react";

enum VariantBtn {
  Default = "Default",
  Outline = "Outline",
}

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  onClick: (e: MouseEvent<HTMLButtonElement>) => void;
  variant?: VariantBtn;
  small?: boolean;
}

const Button: FC<ButtonProps> = ({
  children,
  onClick,
  small,
  variant = VariantBtn.Default,
}) => {
  return (
    <button
      onClick={onClick}
      className={`
        inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 w-full
        ${
          variant === VariantBtn.Outline &&
          "border border-input bg-background hover:bg-accent hover:text-accent-foreground"
        }
        ${
          variant === VariantBtn.Default &&
          "bg-primary text-primary-foreground hover:bg-primary/90"
        }
        ${
          small
            ? "border-[1px] font-light py-1 text-sm"
            : "border-2 font-semibold py-3 text-md"
        }
      `}
    >
      {children}
    </button>
  );
};

export default Button;

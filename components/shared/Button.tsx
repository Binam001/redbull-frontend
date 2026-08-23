import React from "react";
import Link from "next/link";

import { Icon } from "@iconify/react";

interface ButtonProps {
  label: string;
  className?: string;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  variant?: "solid" | "outline" | "white";
  href?: string;
  icon?: string;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
}

const Button = ({
  label,
  className,
  onClick,
  variant = "solid",
  href,
  icon,
  type = "button",
  disabled = false,
}: ButtonProps) => {
  const baseStyles =
    "w-fit px-8 py-2.5 transition-all duration-500 cursor-pointer text-sm md:text-base font-medium inline-flex items-center justify-center gap-2 group";

  const variantStyles =
    variant === "solid"
      ? "bg-primary text-white hover:bg-primary/90 border-2 border-primary"
      : variant === "outline"
        ? "bg-transparent text-primary border-2 border-primary hover:bg-primary hover:text-white"
        : "bg-white text-gray-900 shadow-sm hover:shadow-md border-2 border-white";

  const combinedClassName = `${baseStyles} ${variantStyles} ${className || ""}`;

  const content = (
    <>
      <span>{label}</span>
      {icon && (
        <Icon
          icon={icon}
          className="size-4 group-hover:translate-x-1 transition-transform"
        />
      )}
    </>
  );

  if (href) {
    return (
      <Link href={href} className={combinedClassName} aria-label={label}>
        {content}
      </Link>
    );
  }

  return (
    <button
      type={type}
      onClick={onClick}
      aria-label={label}
      className={combinedClassName}
      disabled={disabled}
    >
      {content}
    </button>
  );
};

export default Button;

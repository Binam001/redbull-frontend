import React from "react";
import Link from "next/link";

import { Icon } from "@iconify/react";

interface ButtonProps {
  label?: string;
  children?: React.ReactNode;
  className?: string;
  onClick?: React.MouseEventHandler<HTMLElement>;
  variant?: "solid" | "outline" | "white";
  href?: string;
  icon?: string | React.ReactNode;
  as?: "button" | "span" | "div";
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
}

const Button = ({
  label,
  children,
  className,
  onClick,
  variant = "solid",
  href,
  icon,
  as,
  type = "button",
  disabled = false,
}: ButtonProps) => {
  const baseStyles =
    "w-fit px-8 py-2.5 transition-all duration-500 cursor-pointer rounded-full text-sm md:text-base font-medium inline-flex items-center justify-center gap-2 group";

  const variantStyles =
    variant === "solid"
      ? "bg-primary text-white hover:bg-primary/90 border-2 border-primary"
      : variant === "outline"
        ? "bg-transparent text-primary border-2 border-primary hover:bg-primary hover:text-white"
        : "bg-white text-gray-900 shadow-sm hover:shadow-md border-2 border-white";

  const combinedClassName = `${baseStyles} ${variantStyles} ${className || ""}`;

  const content = (
    <>
      {label && <span>{label}</span>}
      {children}
      {icon &&
        (typeof icon === "string" ? (
          <Icon
            icon={icon}
            className="size-4 group-hover:translate-x-1 transition-transform"
          />
        ) : (
          icon
        ))}
    </>
  );

  if (href) {
    return (
      <Link href={href} className={combinedClassName} aria-label={label}>
        {content}
      </Link>
    );
  }

  if (as === "span") {
    return (
      <span className={combinedClassName} aria-label={label}>
        {content}
      </span>
    );
  }

  if (as === "div") {
    return (
      <div className={combinedClassName} aria-label={label}>
        {content}
      </div>
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

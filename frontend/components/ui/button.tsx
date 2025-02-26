import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "outline";
}

export const Button: React.FC<ButtonProps> = ({
  variant = "primary",
  className = "",  
  children,
  ...props
}) => {
  const baseStyles = "px-4 py-2 rounded-lg font-medium transition";
  const variantStyles =
    variant === "primary"
      ? "bg-blue-600 text-white hover:bg-blue-700"
      : "border border-gray-300 text-gray-700 hover:bg-gray-100";

  return (
    <button className={`${baseStyles} ${variantStyles} ${className}`} {...props}>
      {children}
    </button>
  );
};


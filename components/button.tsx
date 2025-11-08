import React from "react";

interface ButtonProps {
  text: string;
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
  type?: any;
  form?: string;
}

export default function Button({
  text,
  onClick,
  className,
  type,
  disabled,
  form,
}: ButtonProps) {
  return (
    <button
      disabled={disabled}
      type={type}
      form={form}
      className={`${className} cursor-pointer rounded-[40px] text-sm font-semibold  md:px-4 px-3.5 py-3`}
      onClick={onClick}
    >
      {text}
    </button>
  );
}

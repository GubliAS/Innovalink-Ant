import React from "react";

interface ButtonProps {
  text: string;
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
  type?: any;
}

export default function Button({
  text,
  onClick,
  className,
  type,
  disabled,
}: ButtonProps) {
  return (
    <button
      disabled={disabled}
      type={type}
      className={`${className} cursor-pointer rounded-[40px] text-sm font-semibold  md:px-4 px-3.5 md:py-3 py-2`}
      onClick={onClick}
    >
      {text}
    </button>
  );
}

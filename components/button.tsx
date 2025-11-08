import React from "react";
import Link from "next/link";



interface ButtonProps {
  text: string;
  onClick?: () => void;
  className?: string;
  href?: string;
  type?: any;
  form?: string;
  disabled?: boolean;
}

export default function Button({
  text,
  onClick,
  className,
  type,
  href,
  disabled,
  form,
}: ButtonProps) {
  const buttonContent = (
    <button
      disabled={disabled}
      type={type}
      form={form}
      className={`  disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer rounded-[40px] text-sm font-semibold  md:px-4 px-3.5 py-3 ${className}`}
      onClick={onClick}
    >
      {text}
    </button>
  );
  if (href) {
    return <Link href={href} target="_blank" className="w-fit">{buttonContent}</Link>;
  }

  return buttonContent;

}

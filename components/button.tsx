import Link from "next/link";
import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  text: string;
  href?: string;
}

export default function Button({
  text,
  onClick,
  className,
  type = "button",
  disabled,
  form,
  href,
  ...props
}: ButtonProps) {
  const buttonContent = (
    <button
      disabled={disabled}
      type={type}
      form={form}
      onClick={onClick}
      className={`${className} cursor-pointer rounded-[40px] text-sm font-semibold md:px-4 px-3.5 py-3 disabled:opacity-50 disabled:cursor-not-allowed`}
      {...props} // allows data-cal-* and other attributes to pass through
    >
      {text}
    </button>
  );

  if (href) {
    return (
      <Link href={href} target="_blank" className="w-fit">
        {buttonContent}
      </Link>
    );
  }

  return buttonContent;
}

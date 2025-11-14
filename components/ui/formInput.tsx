import React from "react";
import { CircleAlert } from "lucide-react";

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement | HTMLTextAreaElement> {
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  placeholder: string;
  error?: string;
  disabled?: boolean;
  type?: string;
  as?: "input" | "textarea";
  rows?: number;
}

const FormInput: React.FC<FormInputProps> = ({
  name,
  value,
  onChange,
  placeholder,
  error,
  disabled = false,
  type = "text",
  as = "input",
  rows,
  className,
  ...props
}) => {
  const baseClassName = `text-sm lg:text-base w-full px-3.5 py-2.5 bg-neutral-0 dark:bg-neutral-6 rounded-lg focus:outline-none border-[1.5px] ${
    error
      ? "border-red-500 dark:border-red-500"
      : "dark:border-transparent border-neutral-2 dark:focus:border-neutral-0 focus:border-neutral-3"
  } text-neutral-6 dark:text-neutral-0 placeholder-neutral-4 transition ${
    as === "textarea" ? "resize-none" : ""
  } ${className || ""}`;

  const InputElement = as === "textarea" ? "textarea" : "input";

  return (
    <div className="relative">
      <InputElement
        type={as === "input" ? type : undefined}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        rows={as === "textarea" ? rows : undefined}
        className={baseClassName}
        {...(props as any)}
      />
      {error && (
        <>
          <p className="text-red-500 text-xs mt-1">{error}</p>
          <div className="absolute top-3 right-2">
            <CircleAlert className="w-5 h-5 text-error-4" />
          </div>
        </>
      )}
    </div>
  );
};

export default FormInput;
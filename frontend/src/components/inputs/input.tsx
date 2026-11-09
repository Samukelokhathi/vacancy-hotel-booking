import type React from "react";
import inputStyle from "./input.module.css";

type InputProps = {
  id?: string;
  value?: string | number | boolean | null;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
  label?: string;
  error?: string;
  name?: string;
  placeholder?: string;
  type?: React.HTMLInputTypeAttribute;
  className?: string;
  required?: boolean;
  min?: number;
};

export const Input: React.FC<InputProps> = ({
  id,
  value,
  onChange,
  label,
  error,
  name,
  min,
  placeholder,
  type = "text",
  className = "",
  required,
}) => {
  const normalizedValue =
    value === null || typeof value === "boolean" ? "" : value;

  return (
    <div className={inputStyle["input-label-container"]}>
      <label htmlFor={id} className={inputStyle["input-label"]}>
        {label}
      </label>
      <input
        name={name}
        id={id}
        type={type}
        value={normalizedValue}
        onChange={onChange}
        className={`${inputStyle.input} ${className}`.trim()}
        required={required}
        min={min}
        placeholder={placeholder}
      />
      {error && <span className={inputStyle["input-error"]}>{error}</span>}
    </div>
  );
};

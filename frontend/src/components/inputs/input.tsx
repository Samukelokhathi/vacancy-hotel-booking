import type React from "react";
import inputStyle from "./Input.module.css";

type InputProps = {
  id?: string;
  value?: string | number;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
  style?: React.CSSProperties;
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
  style,
  label,
  error,
  name,
  min,
  type = "text",
  className = "",
  required,
}) => {
  return (
    <div className={inputStyle["input-label-container"]}>
      <label className={inputStyle["input-label"]}>{label}</label>
      <input
        name={name}
        id={id}
        style={style}
        type={type}
        value={value}
        onChange={onChange}
        className={`${inputStyle.input} ${className}`.trim()}
        required={required}
        min={min}
      />
      {error && <span className={inputStyle["input-error"]}>{error}</span>}
    </div>
  );
};

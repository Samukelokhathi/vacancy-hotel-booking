import React from "react";
import textStyle from "./Text.module.css";

type Props = {
  variant?: string;
  children: React.ReactNode;
  style?: React.CSSProperties;
  className?: string;
};

export const Text: React.FC<Props> = ({
  variant,
  children,
  style,
  className,
}) => {
  if (variant === "h1")
    return (
      <h1 style={style} className={className}>
        {children}
      </h1>
    );
  if (variant === "h2")
    return (
      <h2 style={style} className={textStyle.h2}>
        {children}{" "}
      </h2>
    );
  if (variant === "p")
    return (
      <p style={style} className={className}>
        {children}
      </p>
    );
  if (variant === "span")
    return (
      <span style={style} className={className}>
        {children}
      </span>
    );

  return (
    <div style={style} className={className}>
      {children}
    </div>
  );
};

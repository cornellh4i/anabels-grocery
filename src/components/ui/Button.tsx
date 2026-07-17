"use client";
import { useState, type CSSProperties, type ReactNode } from "react";

export interface ButtonProps {
  variant?: "primary" | "secondary" | "danger" | "ghost";
  size?: "sm" | "md";
  loading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  onClick?: () => void;
  children?: ReactNode;
}

export default function Button(props: ButtonProps) {
  const [pressed, setPressed] = useState(false);

  const size = props.size ?? "md";
  const isDisabled = props.disabled || props.loading;

  const mainButtonStyle: CSSProperties = {
    display: "flex",
    padding: "8px 24px",
    justifyContent: "center",
    alignItems: "center",
    gap: "9.18px",
    borderRadius: "40px",
    border: pressed ? "0.918px solid #323B89" : "0.918px dashed #323B89",
    background: pressed
      ? "rgba(19, 30, 122, 0.75)"
      : "rgba(111, 126, 252, 0.15)",
    color: pressed ? "white" : "inherit",
    cursor: isDisabled ? "not-allowed" : "pointer",
    width: props.fullWidth ? "100%" : "auto",
  };

  const smallButtonStyle: CSSProperties = {
    display: "flex",
    height: "33px",
    padding: "8px 20px",
    alignItems: "center",
    gap: "10px",
    borderRadius: "40px",
    border: "0.75px solid rgba(0, 0, 0, 0.20)",
    background: pressed ? "rgba(111, 126, 252, 0.15)" : "transparent",
    cursor: isDisabled ? "not-allowed" : "pointer",
    width: props.fullWidth ? "100%" : "auto",
  };

  return (
    <button
      type="button"
      data-stub="Button"
      onClick={props.onClick}
      disabled={isDisabled}
      onPointerDown={() => {
        if (!isDisabled) {
          setPressed(true);
        }
      }}
      onPointerUp={() => setPressed(false)}
      onPointerLeave={() => setPressed(false)}
      onPointerCancel={() => setPressed(false)}
      style={size === "sm" ? smallButtonStyle : mainButtonStyle}
    >
      {props.leftIcon}
      <span>{props.loading ? "Loading..." : props.children}</span>
      {props.rightIcon}
    </button>
  );
}

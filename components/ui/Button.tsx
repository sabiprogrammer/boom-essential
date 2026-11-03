import type { ButtonHTMLAttributes } from "react";
import { buttonStyles, type ButtonSize, type ButtonVariant, type Surface } from "./button-styles";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  surface?: Surface;
  size?: ButtonSize;
};

/** Action button (submits, toggles). For navigation use ButtonLink. */
export function Button({
  variant,
  surface,
  size,
  className,
  type = "button",
  children,
  ...rest
}: ButtonProps) {
  return (
    <button type={type} className={buttonStyles({ variant, surface, size, className })} {...rest}>
      {children}
    </button>
  );
}

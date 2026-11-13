"use client";

import { useState, type Ref } from "react";
import { adminAuthCopy } from "@/content/admin-auth";
import { inputStyles } from "@/components/contact/field-styles";
import { EyeIcon, EyeOffIcon } from "@/components/ui/icons";

type PasswordFieldProps = {
  id: string;
  name: string;
  inputRef?: Ref<HTMLInputElement>;
  "aria-describedby"?: string;
  "aria-invalid"?: true;
  "aria-required"?: true;
};

/**
 * A password input with a show/hide control. The control is a real button that is announced as a toggle
 * (`aria-pressed`) with a label that names the action, and it stays in the keyboard order after the field.
 * Hidden by default; the typed value never leaves this component except through the form submit.
 */
export function PasswordField({ id, name, inputRef, ...aria }: PasswordFieldProps) {
  const [visible, setVisible] = useState(false);
  const label = visible ? adminAuthCopy.login.hidePassword : adminAuthCopy.login.showPassword;

  return (
    <div className="relative">
      <input
        ref={inputRef}
        id={id}
        name={name}
        type={visible ? "text" : "password"}
        autoComplete="current-password"
        required
        spellCheck={false}
        autoCapitalize="none"
        className={`${inputStyles} pr-14`}
        {...aria}
      />
      <button
        type="button"
        onClick={() => setVisible((current) => !current)}
        aria-pressed={visible}
        aria-controls={id}
        aria-label={label}
        title={label}
        className="absolute inset-y-0 right-0 grid w-12 place-items-center text-ink-muted transition-colors hover:text-navy focus-visible:text-navy"
      >
        {visible ? <EyeOffIcon className="size-5" /> : <EyeIcon className="size-5" />}
      </button>
    </div>
  );
}

"use client";

import * as React from "react";
import { Eye, EyeOff } from "lucide-react";

import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group";

type PasswordInputProps = Omit<
  React.ComponentProps<typeof InputGroupInput>,
  "type"
> & {
  icon?: React.ReactNode;
};

export function PasswordInput({ icon, ...props }: PasswordInputProps) {
  const [showPassword, setShowPassword] = React.useState(false);

  return (
    <InputGroup>
      {icon && <InputGroupAddon>{icon}</InputGroupAddon>}
      <InputGroupInput type={showPassword ? "text" : "password"} {...props} />
      <InputGroupAddon align="inline-end">
        <InputGroupButton
          type="button"
          aria-label={showPassword ? "Hide password" : "Show password"}
          aria-pressed={showPassword}
          size="icon-xs"
          onClick={() => setShowPassword((value) => !value)}
        >
          {showPassword ? <EyeOff /> : <Eye />}
        </InputGroupButton>
      </InputGroupAddon>
    </InputGroup>
  );
}

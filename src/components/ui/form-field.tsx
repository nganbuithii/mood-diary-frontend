import type { ComponentProps, ReactNode } from "react";

import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";

type FieldErrorValue = { message?: string } | undefined;

export interface FieldControlProps {
  id: string;
  "aria-invalid": boolean;
  "aria-describedby": string | undefined;
}

export interface FormFieldBaseProps {
  id: string;
  label: ReactNode;
  labelAction?: ReactNode;
  error?: FieldErrorValue;
}

interface FormFieldProps extends FormFieldBaseProps {
  children: (control: FieldControlProps) => ReactNode;
}

export function FormField({ id, label, labelAction, error, children }: FormFieldProps) {
  const errorId = `${id}-error`;
  const labelNode = <FieldLabel htmlFor={id}>{label}</FieldLabel>;

  return (
    <Field data-invalid={!!error}>
      {labelAction ? (
        <div className="flex items-center justify-between gap-2">
          {labelNode}
          {labelAction}
        </div>
      ) : (
        labelNode
      )}
      {children({ id, "aria-invalid": !!error, "aria-describedby": error ? errorId : undefined })}
      <FieldError id={errorId} errors={[error]} />
    </Field>
  );
}

type TextFieldProps = FormFieldBaseProps &
  Omit<ComponentProps<typeof InputGroupInput>, "id"> & {
    icon?: ReactNode;
  };

export function TextField({ id, label, labelAction, error, icon, ...inputProps }: TextFieldProps) {
  return (
    <FormField id={id} label={label} labelAction={labelAction} error={error}>
      {(control) => (
        <InputGroup>
          {icon && <InputGroupAddon>{icon}</InputGroupAddon>}
          <InputGroupInput {...inputProps} {...control} />
        </InputGroup>
      )}
    </FormField>
  );
}

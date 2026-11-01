import { FormEventHandler } from "react";

import { useFormStatus } from "react-dom";

export function SubmitButton({
  text,
  expanded,
  onSubmit,
  onClick,
}: {
  text: string;
  expanded: boolean;
  onSubmit?: FormEventHandler<HTMLButtonElement> | null;
  onClick?: FormEventHandler<HTMLButtonElement> | null;
}) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      aria-disabled={pending}
      disabled={pending}
      className={`${expanded ? "apl-button-expanded" : "apl-button-fixed"}`}
      onSubmit={onSubmit ? (event) => onSubmit(event) : undefined}
      onClick={onClick ? (event) => onClick(event) : undefined}
    >
      {pending ? "Bitte warten..." : text}
    </button>
  );
}

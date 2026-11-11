"use client";
import { useFormStatus } from "react-dom";
import { FiSend } from "react-icons/fi";

export default function ContactSubmitButton({ label, pendingLabel }: { label: string; pendingLabel: string }) {
  const { pending } = useFormStatus();
  return (
    <button type="submit" aria-busy={pending} disabled={pending}
      className="btn-primary min-w-[12rem] disabled:cursor-wait disabled:opacity-70">
      {pending ? (
        <>
          <span aria-hidden="true" className="h-4 w-4 animate-spin rounded-full border-2 border-accent-fg border-b-transparent" />
          {pendingLabel}
        </>
      ) : (
        <>
          {label} <FiSend aria-hidden="true" />
        </>
      )}
    </button>
  );
}

"use client";
import { useFormStatus } from "react-dom";
import { FaPaperPlane } from "react-icons/fa";

export default function ContactSubmitButton({ label }: { label: string }) {
  const { pending } = useFormStatus();
  return (
    <button type="submit" aria-label={label} aria-busy={pending} disabled={pending}
      className="group flex items-center justify-center gap-2 h-[3rem] w-auto bg-gray-900 text-white rounded-full outline-none transition-all focus:scale-110 hover:bg-gray-950 active:scale-105 dark:bg-white dark:bg-opacity-10 disabled:scale-100 disabled:bg-opacity-65 hover:bg-black dark:hover:bg-opacity-20">
      {pending ? <span aria-hidden="true" className="h-5 w-5 animate-spin rounded-full border-b-2 border-white" /> : <>{label} <FaPaperPlane aria-hidden="true" className="text-xs opacity-70 transition-all" /></>}
    </button>
  );
}

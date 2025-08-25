"use client";
import { ReactNode, useEffect, useState } from "react";

export type Toast = {
  id: number;
  message: string;
  variant?: "default" | "error";
};

let pushToast: ((toast: Toast) => void) | undefined;

export function toast(opts: { message: string; variant?: "default" | "error" }) {
  if (pushToast) {
    pushToast({ id: Date.now(), ...opts });
  }
}

export default function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  useEffect(() => {
    pushToast = (toast: Toast) => {
      setToasts((prev) => [...prev, toast]);
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== toast.id));
      }, 4000);
    };
    return () => {
      pushToast = undefined;
    };
  }, []);

  return (
    <>
      {children}
      <div className="fixed top-4 right-4 z-50 space-y-2">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`rounded px-4 py-2 text-sm shadow text-white ${t.variant === "error" ? "bg-red-600" : "bg-gray-800"}`}
          >
            {t.message}
          </div>
        ))}
      </div>
    </>
  );
}

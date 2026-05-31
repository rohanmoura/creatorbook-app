"use client";

import { AlertTriangle, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";

type PageStateProps = {
  title: string;
  description: string;
  type?: "loading" | "error";
  actionLabel?: string;
  onAction?: () => void;
};

export function PageState({
  title,
  description,
  type = "loading",
  actionLabel,
  onAction,
}: PageStateProps) {
  const Icon = type === "loading" ? Loader2 : AlertTriangle;

  return (
    <main className="mx-auto flex min-h-[65vh] max-w-3xl items-center justify-center px-4 py-12 sm:px-6">
      <div className="premium-panel w-full rounded-lg p-8 text-center">
        <div className="mx-auto mb-5 flex size-14 items-center justify-center rounded-full bg-primary/10 text-primary">
          <Icon className={type === "loading" ? "size-7 animate-spin" : "size-7"} />
        </div>
        <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
        <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-muted-foreground">
          {description}
        </p>
        {actionLabel && onAction ? (
          <Button type="button" className="mt-6" onClick={onAction}>
            {actionLabel}
          </Button>
        ) : null}
      </div>
    </main>
  );
}

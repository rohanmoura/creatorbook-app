"use client";

import type { LucideIcon } from "lucide-react";
import type { ComponentProps } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";

type ToastActionButtonProps = {
  label: string;
  message: string;
  description?: string;
  icon?: LucideIcon;
  variant?: ComponentProps<typeof Button>["variant"];
  size?: ComponentProps<typeof Button>["size"];
  disabled?: boolean;
  className?: string;
};

export function ToastActionButton({
  label,
  message,
  description,
  icon: Icon,
  variant = "outline",
  size = "sm",
  disabled,
  className,
}: ToastActionButtonProps) {
  return (
    <Button
      type="button"
      size={size}
      variant={variant}
      disabled={disabled}
      className={className}
      onClick={() => toast.success(message, { description })}
    >
      {Icon ? <Icon className="size-3.5" /> : null}
      {label}
    </Button>
  );
}

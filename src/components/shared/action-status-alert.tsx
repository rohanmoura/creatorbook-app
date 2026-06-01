import { AlertCircle, CheckCircle2 } from "lucide-react";

import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";

type ActionStatusAlertProps = {
  title?: string;
  status?: string;
  messages: Record<string, string>;
  successStatuses?: string[];
};

export function ActionStatusAlert({
  title,
  status,
  messages,
  successStatuses = [],
}: ActionStatusAlertProps) {
  if (!status || !messages[status]) {
    return null;
  }

  const isSuccess = successStatuses.includes(status);
  const Icon = isSuccess ? CheckCircle2 : AlertCircle;

  return (
    <Alert
      variant={isSuccess ? "default" : "destructive"}
      className={
        isSuccess
          ? "border-emerald-200 bg-emerald-50 text-emerald-950"
          : undefined
      }
    >
      <Icon className="size-4" />
      <AlertTitle>{title ?? (isSuccess ? "Action completed" : "Action needed")}</AlertTitle>
      <AlertDescription>{messages[status]}</AlertDescription>
    </Alert>
  );
}

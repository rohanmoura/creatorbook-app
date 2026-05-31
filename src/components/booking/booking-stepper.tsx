import { CheckCircle2 } from "lucide-react";

import { cn } from "@/lib/utils";

type BookingStepperProps = {
  currentStep?: number;
};

const steps = [
  "Select service",
  "Choose time",
  "Add context",
  "Request review",
];

export function BookingStepper({ currentStep = 3 }: BookingStepperProps) {
  return (
    <div className="premium-panel rounded-lg p-4">
      <div className="grid gap-3 md:grid-cols-4">
        {steps.map((step, index) => {
          const stepNumber = index + 1;
          const isDone = stepNumber < currentStep;
          const isActive = stepNumber === currentStep;

          return (
            <div key={step} className="flex items-center gap-3">
              <span
                className={cn(
                  "flex size-8 shrink-0 items-center justify-center rounded-full border text-sm font-medium",
                  isDone && "border-emerald-200 bg-emerald-50 text-emerald-700",
                  isActive && "border-primary bg-primary text-primary-foreground",
                  !isDone && !isActive && "bg-background text-muted-foreground"
                )}
              >
                {isDone ? <CheckCircle2 className="size-4" /> : stepNumber}
              </span>
              <span
                className={cn(
                  "text-sm",
                  isActive ? "font-medium text-foreground" : "text-muted-foreground"
                )}
              >
                {step}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

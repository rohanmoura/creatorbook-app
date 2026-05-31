import { CheckCircle2, CircleDashed } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

const checklist = [
  { label: "Profile bio", done: true },
  { label: "Service packages", done: true },
  { label: "Availability slots", done: true },
  { label: "Portfolio proof", done: true },
  { label: "Admin verification", done: false },
];

export function ProfileChecklistCard() {
  const completed = checklist.filter((item) => item.done).length;
  const percent = Math.round((completed / checklist.length) * 100);

  return (
    <Card className="rounded-lg">
      <CardHeader>
        <CardTitle>Profile checklist</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between gap-4 text-sm">
          <span className="text-muted-foreground">{completed} of {checklist.length} complete</span>
          <span className="font-medium">{percent}%</span>
        </div>
        <Progress value={percent} className="mt-3" />
        <div className="mt-5 grid gap-3 text-sm">
          {checklist.map((item) => {
            const Icon = item.done ? CheckCircle2 : CircleDashed;
            return (
              <div
                key={item.label}
                className="flex items-center justify-between gap-3 rounded-md border p-3"
              >
                <span className="flex items-center gap-2">
                  <Icon
                    className={
                      item.done
                        ? "size-4 text-emerald-600"
                        : "size-4 text-muted-foreground"
                    }
                  />
                  {item.label}
                </span>
                <span className="text-muted-foreground">
                  {item.done ? "Done" : "Pending"}
                </span>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}


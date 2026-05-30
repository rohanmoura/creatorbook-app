import { cn } from "@/lib/utils";

type SectionHeaderProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  className?: string;
};

export function SectionHeader({
  eyebrow,
  title,
  description,
  className,
}: SectionHeaderProps) {
  return (
    <div className={cn("max-w-2xl", className)}>
      {eyebrow ? (
        <p className="mb-2 text-sm font-medium text-primary">{eyebrow}</p>
      ) : null}
      <h2 className="text-2xl font-semibold tracking-tight text-foreground md:text-3xl">
        {title}
      </h2>
      {description ? (
        <p className="mt-3 text-base leading-7 text-muted-foreground">
          {description}
        </p>
      ) : null}
    </div>
  );
}


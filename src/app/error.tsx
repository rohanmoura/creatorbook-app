"use client";

import { PageState } from "@/components/shared/page-state";

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <PageState
      type="error"
      title="Something needs another try"
      description="CreatorBook could not finish loading this screen. Retry the view and the demo state will reload."
      actionLabel="Try again"
      onAction={reset}
    />
  );
}

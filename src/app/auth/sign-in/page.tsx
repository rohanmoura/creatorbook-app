import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export default function SignInPage() {
  return (
    <main className="mx-auto flex min-h-[70vh] max-w-md items-center px-4 py-12 sm:px-6">
      <Card className="w-full rounded-lg">
        <CardHeader>
          <CardTitle>Sign in to CreatorBook</CardTitle>
          <p className="text-sm leading-6 text-muted-foreground">
            Mock authentication for the portfolio demo. Choose a role after sign in.
          </p>
        </CardHeader>
        <CardContent>
          <form className="grid gap-4">
            <label className="grid gap-2 text-sm">
              Email
              <Input type="email" placeholder="you@example.com" />
            </label>
            <label className="grid gap-2 text-sm">
              Password
              <Input type="password" placeholder="••••••••" />
            </label>
            <Button asChild>
              <Link href="/onboarding/role">
                Continue
                <ArrowRight className="size-4" />
              </Link>
            </Button>
          </form>
        </CardContent>
      </Card>
    </main>
  );
}


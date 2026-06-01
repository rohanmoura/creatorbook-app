"use client";

import { useEffect } from "react";

import {
  demoBookingStorageKey,
  type DemoBookingRequest,
} from "@/lib/demo-storage";

type PersistBookingRequestProps = {
  request: DemoBookingRequest;
};

export function PersistBookingRequest({ request }: PersistBookingRequestProps) {
  useEffect(() => {
    window.localStorage.setItem(demoBookingStorageKey, JSON.stringify(request));
  }, [request]);

  return null;
}

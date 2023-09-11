"use client";
import { api } from "~/utils/trpc";

function TRPCProvider({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

export default api.withTRPC(TRPCProvider);

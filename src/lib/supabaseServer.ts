// src/lib/supabaseServer.ts
import { cookies } from "next/headers";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { type Database } from "@/types/supabase"; // 👈 optional if you generated types

export const supabaseServer = () => {
  return createRouteHandlerClient<Database>({ cookies });
};
